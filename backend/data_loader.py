import pandas as pd
import numpy as np
import os

def load_data():
    filepath = "data/train_FD001.txt"

    if not os.path.exists(filepath):
        raise FileNotFoundError("Please download the dataset and place train_FD001.txt in the data/ folder.")

    columns = ['engine_id', 'cycle'] + \
              [f'op_setting_{i}' for i in range(1, 4)] + \
              [f'sensor_{i}' for i in range(1, 22)]

    df = pd.read_csv(filepath, sep=r'\s+', header=None, names=columns)

    max_cycles = df.groupby('engine_id')['cycle'].max().reset_index()
    max_cycles.columns = ['engine_id', 'max_cycle']
    df = df.merge(max_cycles, on='engine_id')
    df['RUL'] = df['max_cycle'] - df['cycle']
    df.drop('max_cycle', axis=1, inplace=True)

    return df

def get_engine_summary(df):
    summary = df.groupby('engine_id').agg(
        max_cycle=('cycle', 'max'),
        current_RUL=('RUL', 'min'),
    ).reset_index()

    summary['health_score'] = (summary['current_RUL'] / summary['max_cycle'] * 100).clip(0, 100).round(1)
    summary['status'] = summary['health_score'].apply(
        lambda x: 'Critical' if x < 20 else ('Warning' if x < 50 else 'Healthy')
    )
    return summary