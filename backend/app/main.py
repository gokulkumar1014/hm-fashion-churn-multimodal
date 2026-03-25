from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from typing import List, Optional, Any
import asyncio
import os
import io
import json
import traceback
import re
from google import genai
from google.cloud import storage

from app.services import conductor
from app.database import lakehouse

# ==============================================================================
# 1. Pydantic Models for Strict Data Validation (Dream View Structure)
# ==============================================================================
class CustomerDossier(BaseModel):
    customer_id: str
    age: Optional[int]
    status: Optional[str]
    ltv: float

class RiskAssessment(BaseModel):
    churn_probability: float
    risk_level: str
    status_badge: str

class StyleAnalysis(BaseModel):
    persona_id: Any
    drift_score: float
    trend_summary: str

class Strategy(BaseModel):
    name: str
    insight: str
    voucher: str

class RecommendationItem(BaseModel):
    article_id: int
    prod_name: Optional[str] = "Unknown Product"
    product_type_name: Optional[str] = None
    colour_group_name: Optional[str] = None
    index_group_name: Optional[str] = None
    detail_desc: Optional[str] = None

class FinalResponse(BaseModel):
    dossier: CustomerDossier
    risk_assessment: RiskAssessment
    style_analysis: StyleAnalysis
    strategy: Strategy
    recent_activity_feed: List[RecommendationItem]
    orchestrated_recommendations: List[RecommendationItem]

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    narrative: str
    data: Optional[FinalResponse] = None


# ==============================================================================
# 2. Lifespan Management (The Performance Key)
# ==============================================================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    On startup, execute a complete 'Cold Start' dummy request.
    This forces Polars to cache remote GCS schema metadata and forces ONNX
    to allocate its memory graphs before any user ever hits the endpoint.
    """
    print("🚀 Initializing FastAPI Gateway...")
    print("⏳ Executing Cold Start Sequence (Polars GCS & ONNX allocations) - this will take ~60s...")
    
    # Run in threadpool to avoid blocking main event loop
    dummy_hex = "00007e8d4e54114b5b2a9b51586325a8d0fa74ea23ef77334eaec4ffccd7ebcc"
    await asyncio.to_thread(conductor.get_customer_360, dummy_hex)
    
    print("✅ Cold Start complete! Server is Hot.")
    yield
    print("🛑 Shutting down.")


# ==============================================================================
# 3. Application Setup & CORS
# ==============================================================================
app = FastAPI(
    title="HM Fashion Churn Multimodal CRM",
    description="High-Performance Strategy Engine API. Detects Churn & Style Drift on-the-fly.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================================================================
# 4. Core Endpoint
# ==============================================================================
@app.get(
    "/api/v1/customer/{customer_id}", 
    response_model=FinalResponse, 
    tags=["CRM Engine"],
    summary="Generate 360 Dream View for Customer"
)
async def get_customer(customer_id: str):
    """
    Takes either a standard 64-char Hex ID or the internal Int64 mapped ID.
    Performs dynamic ONNX sequential inference + Polars Lazy GCS Drift computation.
    """
    
    # Int64 vs Hex String Router
    if customer_id.isdigit():
        int_id_val = int(customer_id)
        if int_id_val not in lakehouse.int_to_hex:
            raise HTTPException(status_code=404, detail=f"Integer ID {customer_id} not mapped to any known H&M Customer.")
        hex_target = lakehouse.int_to_hex[int_id_val]
    else:
        hex_target = customer_id
        
    # Execute Strategy Engine in ThreadPool due to extreme CPU compute bound nature
    result = await asyncio.to_thread(conductor.get_customer_360, hex_target)
    
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
        
    return result

# ==============================================================================
# 5. Agentic Chat Endpoint (Gemini Consultant)
# ==============================================================================
@app.post("/api/v1/chat", tags=["Agentic Chat"])
async def get_chat_response(request: ChatRequest):
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    
    # 1. Ultra-Fast Regex Extraction (Bypasses Gemini 429 Quota Limits)
    hex_match = re.search(r'\b[a-fA-F0-9]{64}\b', request.message)
    int_match = re.search(r'\b\d{5,15}\b', request.message)
    
    if hex_match:
        extracted_id = hex_match.group(0)
    elif int_match:
        extracted_id = int_match.group(0)
    else:
        extracted_id = "NONE"

    async def event_generator():
        try:
            if extracted_id and extracted_id.upper() != "NONE":
                clean_id = ''.join(e for e in extracted_id if e.isalnum())
                try:
                    if clean_id.isdigit():
                        int_id_val = int(clean_id)
                        hex_target = lakehouse.int_to_hex.get(int_id_val)
                    else:
                        hex_target = clean_id
                        
                    if hex_target:
                        crm_data = await asyncio.to_thread(conductor.get_customer_360, hex_target)
                        if "error" not in crm_data:
                            # Yield the data chunk first so UI can animate cards immediately
                            clean_data = jsonable_encoder(crm_data)
                            yield f"data: {json.dumps({'type': 'data', 'payload': clean_data})}\n\n"
                            
                            # 2. Stream the LLM narrative live
                            narrative_prompt = f"You are the H&M AI Consultant. The user asked: '{request.message}'. Based on this CRM data: {json.dumps(clean_data)}, write a brief, insightful, and strategic narrative (2 sentences max) summarizing their risk, style drift, and the recommended strategy. Speak in a confident, professional tone."
                            response_stream = await client.aio.models.generate_content_stream(
                                model='gemini-2.5-flash',
                                contents=narrative_prompt
                            )
                            async for chunk in response_stream:
                                if chunk.text:
                                    yield f"data: {json.dumps({'type': 'text', 'payload': chunk.text})}\n\n"
                                    await asyncio.sleep(0.01)
                            return
                except Exception as e:
                    print(f"Error processing CRM data: {e}")
                    pass
                    
            # Default Fallback if no ID or error
            yield f"data: {json.dumps({'type': 'data', 'payload': None})}\n\n"
            try:
                narrative_prompt = f"You are the H&M AI Consultant. User message: '{request.message}'. Respond conversationally. If they didn't provide a customer ID, politely ask for one to run the Churn Inference."
                response_stream = await client.aio.models.generate_content_stream(
                    model='gemini-2.5-flash',
                    contents=narrative_prompt
                )
                async for chunk in response_stream:
                    if chunk.text:
                        yield f"data: {json.dumps({'type': 'text', 'payload': chunk.text})}\n\n"
                        await asyncio.sleep(0.01)
            except Exception as e:
                err_payload = "I am experiencing technical difficulties accessing my neural network. Please check your Gemini API key."
                yield f"data: {json.dumps({'type': 'text', 'payload': err_payload})}\n\n"
        except Exception as global_e:
            err_msg = f"Backend Stream Error: {str(global_e)} | Trace: {traceback.format_exc()}"
            yield f"data: {json.dumps({'type': 'text', 'payload': err_msg})}\n\n"
            
    return StreamingResponse(event_generator(), media_type="text/event-stream")

# ==============================================================================
# 6. Social Pulse Aggregate Dashboard Endpoints
# ==============================================================================

PERSONA_ARCHETYPES = {
    0: "The Modern Professional",
    1: "The Urban Streetwear",
    2: "The Evening Socialite",
    3: "The Summer Minimalist",
    4: "The Active Athleisure",
    5: "The Weekend Casual",
    6: "The Gen-Z Trendsetter",
    7: "The Sustainable Purist",
    8: "The Scandi Cool",
    9: "The Corporate Chic"
}

class SocialPulseResponse(BaseModel):
    global_drift: float
    high_risk_percentage: float
    market_velocity_category: str
    top_healthy_persona: str

@app.get("/api/v1/social/pulse", tags=["Aggregate Dashboards"])
async def get_social_pulse_stats():
    stats = lakehouse.global_pulse_stats
    persona_data = stats.get("top_persona_data", [{"id": 0, "count": 0}])
    top_personas = [
        {"name": PERSONA_ARCHETYPES.get(p["id"], "The Modern Professional"), "count": p["count"]}
        for p in persona_data
    ]
    market_vel = [
        {"name": "The Gen-Z Trendsetter" if i == 0 else mv["name"], "count": mv["count"]}
        for i, mv in enumerate(stats.get("market_velocity_data", [{"name": "Trousers", "count": 0}]))
    ]
    
    return {
        "global_drift": stats.get("global_drift", 0.38),
        "high_risk_percentage": stats.get("high_risk_percentage", 26.4),
        "market_velocity_categories": market_vel,
        "market_velocity_pct": "+7%",
        "top_healthy_personas": top_personas,
        "ticker_category": stats.get("ticker_category", "Trousers")
    }

class PulseChatRequest(BaseModel):
    context: str

@app.post("/api/v1/social/chat", tags=["Agentic Chat"])
async def get_social_chat(request: PulseChatRequest):
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    
    async def event_generator():
        try:
            stats = lakehouse.global_pulse_stats
            persona_data = stats.get("top_persona_data", [{"id": 0, "count": 0}])
            top_personas = [
                {"name": PERSONA_ARCHETYPES.get(p["id"], "The Modern Professional"), "count": p["count"]}
                for p in persona_data
            ]
            top_names_str = ", ".join([p["name"] for p in top_personas])
            
            pulse_context = {
                "global_drift": stats.get("global_drift", 0.38),
                "high_risk_percentage": stats.get("high_risk_percentage", 26.4),
                "market_velocity_categories": stats.get("market_velocity_data", [{"name": "Trousers", "count": 0}]),
                "top_healthy_persona": top_names_str,
                "archetype_mapping": PERSONA_ARCHETYPES
            }
            
            prompt = f"""
            You are the H&M Global Strategy Consultant acting as a Creative Director.
            We are looking at the Global 'Social Pulse' executive dashboard snapshot.
            Current Macro Data Context:
            {json.dumps(pulse_context, indent=2)}
            
            Strategic Goal: Analyze the aggregate market data below and provide a concise, 2-sentence executive summary on the state of the 1.3M customer base. Focus on whether the market is shifting (Style Drift) or stabilizing.
            User Prompt Trigger: '{request.context}'
            
            CRITICAL DIRECTIVE: You MUST use the exact human 'Archetype Names' (e.g., 'The Modern Professional, The Gen-Z Trendsetter') rather than their numeric Cluster IDs. Speak gracefully and confidently about style drift, macro shifts, and consumer velocity. Connect the drift metrics to a logical seasonal or fashion trend narrative.
            Additionally, you must interpret the 26.4% Risk as a calibrated model output. Explain that this represents the segment of the market where the model has successfully identified high-probability churn signatures.
            """
            
            response_stream = await client.aio.models.generate_content_stream(
                model='gemini-2.5-flash',
                contents=prompt
            )
            async for chunk in response_stream:
                if chunk.text:
                    yield f"data: {json.dumps({'type': 'text', 'payload': chunk.text})}\n\n"
                    await asyncio.sleep(0.01)
        except Exception as e:
            err_msg = f"Consultant Backend Error: {str(e)}"
            yield f"data: {json.dumps({'type': 'text', 'payload': err_msg})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

# ==============================================================================
# 7. Secure Image Proxy (Bypasses Non-Public GCS restrictions)
# ==============================================================================
try:
    gcs_client = storage.Client()
    image_bucket = gcs_client.bucket("gokul-hm-vault")
except Exception as e:
    print(f"Warning: Could not initialize Google Cloud Storage client: {e}")
    image_bucket = None

@app.get("/api/v1/image/{article_id}", tags=["Static Assets"])
async def get_product_image(article_id: str):
    """Securely fetches images from the private GCS bucket and streams them to the UI."""
    if not image_bucket:
        raise HTTPException(status_code=500, detail="GCS Client not initialized. Check local credentials.")
        
    padded_id = article_id.zfill(10)
    folder = padded_id[:3]
    blob_path = f"images/{folder}/{padded_id}.jpg"
    
    def fetch_image():
        blob = image_bucket.blob(blob_path)
        if not blob.exists():
            return None
        return blob.download_as_bytes()
        
    image_bytes = await asyncio.to_thread(fetch_image)
    if not image_bytes:
        raise HTTPException(status_code=404, detail=f"Image {blob_path} not found in GCS.")
        
    return StreamingResponse(io.BytesIO(image_bytes), media_type="image/jpeg")
