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

## 📂 Repository Structure

```text
├── backend/          # FastAPI Python Server (Gemini inference, stateless API endpoints)
├── frontend/         # React + Vite SaaS Dashboard (Tailwind CSS, Framer Motion)
├── notebooks/        # Jupyter Notebooks (EDA, DL Modeling, MLflow logs)
└── README.md         # You are here
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
