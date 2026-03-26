# Notebooks

This folder holds the two source notebooks used to build the churn Strategy Engine.

## Files
- `H&M_Phase1_Behavioral.ipynb` — Covers data cleaning, sequence building (27-step tensors), and training the behavioral churn model on transactions.
- `HM_Churn_Phase2_Vision.ipynb` — Adds visual embeddings (ResNet-50) and fuses them with behavioral features; should include quantization/export of the final ONNX `visionary_champion_quantized.onnx` placed under `backend/assets/`.

## Expected Inputs
- Parquet datasets in GCS: `customer_style_profiles_final.parquet`, `hm_style_encyclopedia.parquet`, `behavioral_sequences.parquet` (see `backend/app/database.py`).
- Local parquet assets under `backend/assets/` (article metadata, customer stats, similarity index, personas, history, etc.).
- Image corpus in the `gokul-hm-vault` bucket for visual embedding generation.

## Expected Outputs
- Trained model weights exported to ONNX (`backend/assets/visionary_champion_quantized.onnx`).
- Style DNA/persona centroids and similarity indices (parquet files already referenced by the backend).
- Any experiment logs or metrics (optionally log to MLflow/Dagshub if configured).

## How to Run
1) Activate the project venv: `cd backend && ..\\venv\\Scripts\\activate` (Windows).
2) Ensure environment variables for GCP and Gemini are set (e.g., `GOOGLE_APPLICATION_CREDENTIALS`, `GEMINI_API_KEY`).
3) Open the notebook in Jupyter/VS Code with the repo root as working dir.
4) Verify paths match backend expectations; update and re-export the ONNX model if you retrain.

## Version Control Tips
- Keep raw data out of git; commit notebooks, configs, and the lightweight ONNX model only.
- If notebooks reference secrets/paths, switch to environment variables before pushing.

