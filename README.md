# Retention-Sync: Multi-Modal Churn and Recommendation Intelligence at Scale

**🔴 [Live Demo (Vercel)](https://gokul-hm-intelligence.vercel.app/)**  

![H&M Banner](https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg)

> **"Real-world AI shouldn't just live on a laptop and die. It belongs in the Cloud."**
> A strategic intelligence layer bridging the gap between Deep Learning research and real-world business profitability for the retail economy.

---

### The Scale
- **31.7M** Transactions Modeled
- **1.3M** Global Customers Authenticated
- **0.88** Churn Prediction Recall Achieved

---

## 📖 The Narrative: Research Meets ROI
The retail industry often treats Machine Learning as an academic exercise—optimizing models for isolated benchmarks rather than aggregate business lift. **Retention-Sync** was engineered to answer a critical business question: *How do we predictably identify exactly when a customer is outgrowing our brand's aesthetic, and how do we intervene mathematically?*

To do this, we moved beyond legacy "spray-and-pray" CRM rules and static SQL queries. This intelligence engine fuses **visual DNA** (CNN embeddings of clothing articles) with **sequential velocity** (the cadence of user transactions) to identify early-stage *Style Drift*. The result is a cloud-native, real-time diagnostic engine capable of delivering a 360° "Style Dossier" to leadership in milliseconds.

🔗 **[Read the Full Technical Deep-Dive on Medium](https://medium.com/@gokulkumar0639/the-architecture-of-aesthetic-intelligence-engineering-a-two-tower-multi-modal-churn-engine-b9bf97a5a35c)**
🔗 **[View MLflow Experiment Logs on DagsHub](https://dagshub.com/gokulkumar1014/hm-fashion-churn-multimodal.mlflow/#/experiments/0/runs?searchFilter=&orderByKey=attributes.start_time&orderByAsc=false&startTime=ALL&lifecycleFilter=Active&modelVersionFilter=All+Runs&datasetsFilter=W10%3D&compareRunsMode=CHART)**

---

## 🏗️ Technical Deep-Dive

### 1. Two-Tower Architecture
Traditional Recommender systems struggle to map visual aesthetics to user taste over time. We implemented a **Two-Tower Neural Network architecture**:
- **Article Tower**: Ingests ResNet-50 style embeddings (extracting visual features directly from product images) alongside categorical metadata.
- **User Tower**: Processes the temporal sequence of a user's past purchases to decode "velocity" and engagement fatigue.
These towers coalesce to predict not just *what* a user might buy next, but *whether* they intend to engage at all, catching churn signatures early.

### 2. The Index Bridge (Memory Optimization)
Handling 30+ GB of raw image vectors and 31.7M transaction rows would normally obliterate local memory constraints. We engineered a proprietary **Index Bridge**:
- Using **Polars** for out-of-core execution and high-concurrency joins.
- Implementing an orchestration pipeline that maps complex visual data into ultra-lightweight identifier indices.
This allowed the deployment environment to infer results locally and synchronously on standard enterprise hardware without requiring 64GB+ RAM instances.

### 3. Aesthetic Drift Analysis
Instead of hardcoding "tags" like "Blue Shirt" or "Summer Dress," the model analyzes the Euclidean distance between a user's historical purchases and their recent visual vectors. If the distance expands rapidly, the system flags a high-probability "Aesthetic Drift", enabling targeted CRM interventions before the customer formally abandons the brand.

---

## ☁️ Cloud-Native Data Architecture: From Laptop to Production

### The Problem
During local development, everything was straightforward—Parquet files were read directly from disk, GCS buckets were accessed through local credentials, and 30+ GB of visual embeddings lived comfortably in memory. **But deploying this to Google Cloud Run changed everything.**

Cloud Run is serverless. Containers have constrained memory, limited disk, cold-start penalties, and no persistent filesystem. Naively bundling all assets into the Docker image would:
- Blow past the **container image size limit**
- Exhaust **RAM** trying to load massive embedding matrices
- Cause **cold-start timeouts** as the container tried to hydrate gigabytes of data

### The Solution: Hybrid DuckDB Lakehouse

We re-architected the data layer into a **split-tier system** powered by [DuckDB](https://duckdb.org/)—an in-process analytical SQL engine written in C++. DuckDB acts as a **unified query interface** across both local and remote data, without requiring a database server.

```
┌─────────────────────────────────────────────────────────────────┐
│                     DuckDB C++ Engine                           │
│                  (In-Process, Zero-Copy)                        │
│                                                                 │
│   ┌──────────────────────┐      ┌────────────────────────────┐  │
│   │   LOCAL PARQUET       │      │   REMOTE GCS PARQUET        │  │
│   │   (Docker Image)      │      │   (HTTPFS Extension)        │  │
│   │                       │      │                              │  │
│   │  customer_id_bridge   │      │  customer_style_profiles     │  │
│   │  customer_bio         │      │  behavioral_sequences        │  │
│   │  customer_stats       │      │  hm_style_encyclopedia       │  │
│   │  history_narrative    │      │                              │  │
│   │  article_legend       │      │  30+ GB queried on-demand    │  │
│   │  similarity_index     │      │  via predicate pushdown      │  │
│   │  persona_best_sellers │      │                              │  │
│   └──────────────────────┘      └────────────────────────────┘  │
│                                                                 │
│              Unified SQL Interface (Single Connection)          │
└─────────────────────────────────────────────────────────────────┘
```

### Tier 1: Local Assets (Bundled in Docker Image ~250MB)

Small, frequently accessed lookup tables ship inside the Cloud Run container. DuckDB creates **SQL views** that point directly to the Parquet files on disk—no data is loaded into memory until a query hits a specific row group.

| Asset | Size | Purpose |
|---|---|---|
| `customer_id_bridge.parquet` | ~50 MB | Hex ↔ Int ID translation layer |
| `customer_bio.parquet` | ~48 MB | Age, club membership, fashion preferences |
| `customer_stats.parquet` | ~57 MB | LTV, purchase frequency, date ranges |
| `history_narrative.parquet` | ~94 MB | Full purchase history with timestamps |
| `article_legend.parquet` | ~2.3 MB | Product metadata (name, color, type) |
| `similarity_index.parquet` | ~2.2 MB | Article-to-article visual similarity map |
| `persona_best_sellers.parquet` | ~1.5 KB | Top-selling articles per style persona |
| `visionary_champion_quantized.onnx` | ~2.5 MB | Quantized Two-Tower ONNX churn model |

### Tier 2: Remote Assets (GCS, Queried Over Network)

Large ML artifacts (8+ GB) stay in Google Cloud Storage. DuckDB's **HTTPFS extension** reads them natively in C++ using HTTP range requests—only the specific row groups matching our query predicates are downloaded, not the entire file.

| Asset | Location | Purpose |
|---|---|---|
| `customer_style_profiles_final.parquet` | `gs://gokul-hm-vault/` | 2048-dim Style DNA vectors + persona cluster |
| `behavioral_sequences.parquet` | `gs://gokul-hm-vault/` | 27-step LSTM input tensors (26 features each) |
| `hm_style_encyclopedia.parquet` | `gs://gokul-hm-vault/` | ResNet-50 visual embeddings per article |

### Authentication: Cloud Run → GCS

On Cloud Run, the container's **native IAM service account** provides OAuth2 credentials. These are captured at startup and injected directly into DuckDB's C++ engine as a bearer token secret. A background refresh mechanism re-authenticates every 45 minutes before the token expires.

```python
credentials, _ = google.auth.default(scopes=['https://www.googleapis.com/auth/cloud-platform'])
credentials.refresh(google.auth.transport.requests.Request())
duckdb_conn.execute(f"CREATE OR REPLACE SECRET (TYPE GCS, bearer_token '{credentials.token}');")
```

### The Query Flow

When a customer hex ID enters the system, data is fetched across both tiers in a single orchestrated pipeline:

```
User sends 64-char Hex ID
        │
        ▼
  ┌─────────────────────────┐
  │ LOCAL: customer_id_bridge│ ─── hex_id → int_id translation
  └───────────┬─────────────┘
              │ int_id
     ┌────────┴────────┐
     ▼                 ▼
  LOCAL               GCS (Remote)
  ┌──────────┐        ┌───────────────────────┐
  │ bio      │        │ style_profiles        │ → Style DNA (2048-dim)
  │ stats    │        │ behavioral_sequences  │ → LSTM tensor (27×26)
  │ history  │        │ hm_style_encyclopedia │ → Article embeddings
  └────┬─────┘        └───────────┬───────────┘
       │                          │
       └────────┬─────────────────┘
                ▼
       ┌─────────────────┐
       │  ONNX Inference  │ ── behavioral_tensor + vision_tensor
       │  (CPU, In-Proc)  │ ── → sigmoid → churn_probability %
       └────────┬─────────┘
                ▼
       ┌─────────────────┐
       │ Strategy Engine  │ ── LTV tier + churn risk + drift score
       │                  │ ── → strategy + voucher + recommendations
       └────────┬─────────┘
                ▼
         CRM 360° JSON Response
```

> **Why this matters**: This architecture allows a serverless container with 1GB RAM to serve real-time ML inference across 1.3M customers and 30+ GB of visual data—something that would traditionally require dedicated GPU instances or heavyweight data warehouses.

---

## 📂 Repository Structure

```text
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI endpoints, Gemini agentic chat, SSE streaming
│   │   ├── database.py           # DuckDB Hybrid Lakehouse (local + GCS), ONNX loader
│   │   └── services.py           # Strategy Engine (churn → LTV → voucher logic)
│   ├── assets/                   # Local Parquet data files + ONNX model
│   ├── tests/                    # Backend test suite
│   ├── Dockerfile                # Cloud Run container definition
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/           # Hero landing, AnalystResponse cards
│   │   ├── pages/                # Playground (CRM Engine), SocialPulse, Blueprint
│   │   └── hooks/                # useChat (SSE stream consumer)
│   ├── vercel.json               # Vercel deployment config
│   └── package.json
├── notebooks/
│   ├── H&M_Phase1_Behavioral.ipynb   # EDA, sequence building, behavioral churn model
│   └── HM_Churn_Phase2_Vision.ipynb  # Visual embeddings, Two-Tower fusion, ONNX export
├── docker-compose.yml
└── README.md
```

---

## 🚀 Installation & Local Development

To run the full Intelligence Engine locally, you will need two terminal windows.

### 1. Backend API (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: .\venv\Scripts\activate
pip install -r requirements.txt

# Create a .env file with your GEMINI_API_KEY
echo "GEMINI_API_KEY=your_key_here" > .env

# Start the server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend SaaS Dashboard (React / Vite)
```bash
cd frontend
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:5173` to interact with the CRM Tactical Diagnostic Dashboard.

> **Note**: Local development reads parquet files directly from `backend/assets/` and accesses GCS using local `gcloud` credentials. The DuckDB hybrid architecture described above is what enables the same codebase to run identically on Cloud Run without modification.
