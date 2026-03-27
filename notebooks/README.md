# Analytics & Deep Learning Notebooks

This directory contains the foundational Machine Learning pipeline that powers the **Retention-Sync** Intelligence Engine. 

It acts as the core "brain" of the project where raw H&M data was ingested, cleaned, visualized, modelled, and tracked securely into our MLOps ecosystem. This folder holds the two source notebooks used to build the complete churn Strategy Engine from the ground up.

## Files
- `H&M_Phase1_Behavioral.ipynb` — Covers data cleaning, sequence building (27-step tensors), and training the behavioral churn model on transactions.
- `HM_Churn_Phase2_Vision.ipynb` — Adds visual embeddings (ResNet-50) and fuses them with behavioral features; includes quantization and export of the final ONNX model (`visionary_champion_quantized.onnx`) placed under `backend/assets/`.

## Expected Inputs
- **Parquet datasets in GCS**: `customer_style_profiles_final.parquet`, `hm_style_encyclopedia.parquet`, `behavioral_sequences.parquet` (see `backend/app/database.py`).
- **Local parquet assets**: Located under `backend/assets/` (article metadata, customer stats, similarity index, personas, history, etc.).
- **Image Corpus**: The raw article image corpus stored in the `gokul-hm-vault` GCP bucket used for visual embedding generation.

It acts as the core "brain" of the project where raw H&M data was ingested, cleaned, visualized, modelled, and tracked securely into our MLOps ecosystem.

## Contents
1. **Exploratory Data Analysis (EDA)**: Comprehensive visualization and distribution analysis of 31.7M transactions and 105k fashion articles.
2. **Data Pipeline & Cleaning**: Execution of the 'Index Bridge' technique in Polars to optimize 30GB+ of visual data into lightweight mapping indices.
3. **Deep Learning Modeling**: Implementation of the **Two-Tower Neural Network** using TensorFlow/Keras to calculate Aesthetic Drift and predict temporal churn.
4. **Evaluation & MLOps**: End-to-end model evaluation scripts with integration into our centralized tracking server.

## MLOps Integrity (MLflow)
Every single deep learning experiment, hyperparameter iteration, and validation metric (loss, precision, recall) was rigidly versioned and tracked using **MLflow**.

🔗 **[View our official DagsHub MLflow Server here](https://dagshub.com/gokulkumar1014/hm-fashion-churn-multimodal.mlflow/#/experiments/0/runs?searchFilter=&orderByKey=attributes.start_time&orderByAsc=false&startTime=ALL&lifecycleFilter=Active&modelVersionFilter=All+Runs&datasetsFilter=W10%3D&compareRunsMode=CHART)**

## Medium Technical Publication
To read a deep-dive on the thought process, architectural constraints, and the evolution of the Two-Tower model we built here, please read the official architecture publication:

🔗 **[The Architecture of Aesthetic Intelligence: Engineering a Two-Tower Multi-Modal Churn Engine](https://medium.com/@gokulkumar0639/the-architecture-of-aesthetic-intelligence-engineering-a-two-tower-multi-modal-churn-engine-b9bf97a5a35c)**
