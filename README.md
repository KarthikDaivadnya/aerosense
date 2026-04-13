# ✈️ AeroSense — Aviation Predictive Maintenance Dashboard

> AI-powered turbofan engine health monitoring system built with React, FastAPI, and Machine Learning trained on NASA CMAPSS dataset.

![Python](https://img.shields.io/badge/Python-3.14-blue?style=flat-square&logo=python)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi)
![ML](https://img.shields.io/badge/ML-Gradient%20Boosting-orange?style=flat-square)
![Dataset](https://img.shields.io/badge/Dataset-NASA%20CMAPSS-red?style=flat-square)

---

## 📸 Screenshots

(screenshots/Dashboard1.png to Dashboard4.png) 
(screenshots/Notebook1.png to Notebook12.png)

---

## 📌 Problem Statement

Aircraft engine failures are costly and dangerous. Predictive maintenance using sensor data can help engineers identify engines likely to fail before they do — reducing downtime, improving safety, and saving millions in repair costs.

This project predicts the **Remaining Useful Life (RUL)** of turbofan engines using real NASA sensor data, and visualizes fleet health in a real-time dashboard.

---

## 🎯 Objectives

- Predict how many cycles an engine has left before failure
- Compare multiple ML models to find the best predictor
- Visualize fleet-wide engine health in a real-time dashboard
- Identify the most critical sensor readings affecting engine life

---

## 🗂️ Dataset

**NASA CMAPSS Turbofan Engine Degradation Dataset (FD001)**

| Property | Details |
|----------|---------|
| Source | NASA Prognostics Data Repository |
| Engines | 100 turbofan engines |
| Sensors | 21 sensor measurements per cycle |
| Operational Settings | 3 settings |
| Target | Remaining Useful Life (RUL) in cycles |

Each engine starts healthy and degrades over time until failure. The goal is to predict how many cycles remain before failure using sensor readings.

---

## 🏗️ Project Structure

```
aviation-dashboard/
├── backend/
│   ├── main.py                # FastAPI REST API
│   ├── model.py               # ML model training & prediction
│   ├── data_loader.py         # Data loading & preprocessing
│   ├── data/                  # NASA CMAPSS dataset
│   │   └── train_FD001.txt
│   └── models/                # Saved trained models
│       └── rul_model.pkl
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Dashboard.jsx      # Main layout
│       │   ├── MetricCard.jsx     # KPI cards
│       │   ├── EngineTable.jsx    # Fleet overview table
│       │   └── EngineDetail.jsx   # Engine charts & analysis
│       ├── api.js                 # Axios API calls
│       └── App.jsx
│
└── AeroSense_Analysis.ipynb    # Full ML analysis notebook
```

---

## 🧠 Methodology

### 1. Data Preprocessing
- Loaded raw sensor time-series data for 100 engines
- Calculated **Remaining Useful Life (RUL)** per engine per cycle
- Capped RUL at 125 cycles (standard CMAPSS practice)
- Normalized features using MinMaxScaler

### 2. Exploratory Data Analysis
- Engine lifecycle distribution analysis
- Sensor correlation heatmap with RUL
- Top sensor trend visualization per engine
- RUL health category distribution (Critical / Warning / Moderate / Healthy)

### 3. Model Training & Comparison

Trained and compared **4 machine learning models**:

| Model | MAE | RMSE | R² Score |
|-------|-----|------|----------|
| Linear Regression | 17.62 | 21.68 | 0.7229 |
| Random Forest | 13.61 | 18.83 | 0.7910 |
| Gradient Boosting | 13.55 | 18.77 | 0.7923 |
| XGBoost | 13.91 | 19.61 | 0.7733 |

> **Best Model: Gradient Boosting** — selected automatically based on highest R² score and lower MAE & RMSE

### 4. Feature Importance
- Identified top sensors most predictive of RUL
- Sensor 11, 4, 12 consistently ranked highest
- Operational settings had lower but non-negligible importance

---

## 📊 Key Results

<!-- Update these with your actual numbers -->
- ✅ **Best Model:** Gradient Boosting
- ✅ **R² Score:** 0.7923 (variance explained)
- ✅ **MAE:** 13.55 cycles
- ✅ **Top Predictive Sensor:** sensor_11 — 0.3575
---

## 🖥️ Dashboard Features

- **Fleet Overview** — health score, status and RUL for all 100 engines
- **Engine Inspection** — click any engine to view detailed analysis
- **RUL Chart** — actual vs predicted RUL over last 30 cycles
- **Sensor Telemetry** — 5 key sensor trends per engine
- **Live Model Metrics** — MAE and R² displayed in navbar
- **Critical Alerts** — pulsing alert for engines needing immediate attention

---

## 🚀 How to Run

### Prerequisites
- Python 3.x
- Node.js 18+

### 1. Clone the repository
```bash
git clone https://github.com/KarthikDaivadnya/aerosense.git
cd aerosense
```

### 2. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install fastapi uvicorn pandas numpy scikit-learn xgboost
uvicorn main:app --reload
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Jupyter Notebook
```bash
cd backend
jupyter notebook
# Open AeroSense_Analysis.ipynb
```

- Dashboard → **http://localhost:5173**
- API Docs → **http://localhost:8000/docs**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, Recharts |
| Backend | Python, FastAPI, Uvicorn |
| Machine Learning | Scikit-learn, XGBoost, Pandas, NumPy |
| Analysis | Jupyter Notebook, Matplotlib, Seaborn |
| Dataset | NASA CMAPSS FD001 |

---

## 🔮 Future Improvements

- Add LSTM deep learning model for sequential sensor data
- Support remaining 3 CMAPSS datasets (FD002, FD003, FD004)
- Add email/SMS alerts for critical engines
- Deploy to cloud (AWS / Azure)
- Add real-time sensor data streaming

---

## 👨‍💻 Author

**Karthik Daivadnya**
- 📧 karthikdaivanya27@gmail.com
- 💼 [LinkedIn](http://www.linkedin.com/in/karthik-daivadnya)
- 🐙 [GitHub](https://github.com/KarthikDaivadnya)

---

## 📄 Reference

> A. Saxena and K. Goebel (2008). "Turbofan Engine Degradation Simulation Data Set",
> NASA Ames Prognostics Data Repository, NASA Ames Research Center, Moffett Field, CA

---



> **Note:** The trained model file is not included in this repo due to size limits.
> Run `uvicorn main:app --reload` — the model will auto-train on first startup.