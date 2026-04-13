from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data_loader import load_data, get_engine_summary
from model import train_model, load_model, predict_rul
import pandas as pd
import os

app = FastAPI(title="Aviation Predictive Maintenance API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data and model on startup
df = load_data()
model, scaler, model_metrics = train_model(df)

@app.get("/")
def root():
    return {"message": "Aviation Dashboard API running"}

@app.get("/api/summary")
def get_summary():
    summary = get_engine_summary(df)
    return summary.to_dict(orient="records")

@app.get("/api/engine/{engine_id}")
def get_engine(engine_id: int):
    engine_df = df[df['engine_id'] == engine_id].copy()
    if engine_df.empty:
        return {"error": "Engine not found"}

    predictions = predict_rul(engine_df, model, scaler)
    engine_df['predicted_RUL'] = predictions.round(1)

    sensor_cols = [f'sensor_{i}' for i in [2, 3, 4, 7, 11, 12, 15]]
    result = engine_df[['cycle', 'RUL', 'predicted_RUL'] + sensor_cols].tail(30)
    return result.to_dict(orient="records")

@app.get("/api/metrics")
def get_metrics():
    total = df['engine_id'].nunique()
    summary = get_engine_summary(df)
    critical = len(summary[summary['status'] == 'Critical'])
    warning = len(summary[summary['status'] == 'Warning'])
    healthy = len(summary[summary['status'] == 'Healthy'])
    return {
        "total_engines": total,
        "critical": critical,
        "warning": warning,
        "healthy": healthy,
        "model_mae": model_metrics["mae"],
        "model_r2": model_metrics["r2"]
    }

@app.get("/api/retrain")
def retrain():
    global model, scaler, model_metrics
    model, scaler, model_metrics = train_model(df)
    return {"message": "Model retrained!", "metrics": model_metrics}