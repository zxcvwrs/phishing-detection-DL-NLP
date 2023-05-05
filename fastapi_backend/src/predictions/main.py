from fastapi import FastAPI
from processing.preprocessing_main import run_preprocessing
from models_ml.models_main import run_model_pipeline
from typing import List
app = FastAPI()

@app.post('/predict/single_email')
def predict_endpoint(email_body):
    df = run_preprocessing(email_body)
    prediction = run_model_pipeline(df)
    print(prediction)
    return {'prediction': float(prediction[0][0])}