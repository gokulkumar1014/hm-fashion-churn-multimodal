from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any
import asyncio

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
