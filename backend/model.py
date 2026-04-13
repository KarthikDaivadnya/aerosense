import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, r2_score
import pickle
import os

FEATURE_COLS = [f'sensor_{i}' for i in range(1, 22)] + \
               [f'op_setting_{i}' for i in range(1, 4)]

def train_model(df):
    X = df[FEATURE_COLS]
    y = df['RUL'].clip(upper=125)  # Cap RUL at 125 cycles

    scaler = MinMaxScaler()
    X_scaled = scaler.fit_transform(X)

    model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X_scaled, y)

    y_pred = model.predict(X_scaled)
    mae = mean_absolute_error(y, y_pred)
    r2 = r2_score(y, y_pred)

    print(f"Model trained — MAE: {mae:.2f}, R²: {r2:.3f}")

    os.makedirs("models", exist_ok=True)
    with open("models/rul_model.pkl", "wb") as f:
        pickle.dump((model, scaler), f)

    return model, scaler, {"mae": round(mae, 2), "r2": round(r2, 3)}

def load_model():
    with open("models/rul_model.pkl", "rb") as f:
        model, scaler = pickle.load(f)
    return model, scaler

def predict_rul(engine_data: pd.DataFrame, model, scaler):
    X = engine_data[FEATURE_COLS]
    X_scaled = scaler.transform(X)
    predictions = model.predict(X_scaled)
    return predictions