# Strategy Engine API (Backend)

The backend drives the **Retention-Sync** CRM dashboard. It provides a lightweight, stateless, asynchronous FastAPI interface optimized to integrate with the Deep Learning pipeline and interact with the **Gemini 2.5 Flash Lite** model for generative customer insights.

## Architecture
- **Framework**: `FastAPI` + `Uvicorn`
- **Generative AI Link**: `google-genai`
- **Data Serialization**: `pydantic`
- **CORS Setup**: Fully permissive for local development (`localhost:5173`) but strictly configurable for production deployments.

## Cloud Run Optimization
This service has been meticulously architected to strictly adhere to stateless patterns to allow scaling from 0 to thousands of concurrent CRM requests on GCP Cloud Run. 
All AI context windows are injected dynamically per-sequence to guarantee memory isolation.

### Deployment Process (Vercel / Cloud Run)
Use the included `Dockerfile` to instantly containerize this microservice for any enterprise Kubernetes or Serverless container environment.
```bash
docker build -t hm-strategy-backend .
docker run -p 8080:8080 hm-strategy-backend
```
