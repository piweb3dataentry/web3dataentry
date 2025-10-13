# ai_api.py
from fastapi import FastAPI
from pydantic import BaseModel
import torch
from ai_model import TextVerifier, TaskRecommender, predict_verifier, predict_recommender

app = FastAPI()

# Load models
checkpoint = torch.load("models/ai_model.pth")
verifier = TextVerifier()
verifier.load_state_dict(checkpoint['verifier'])
verifier.eval()

recommender = TaskRecommender()
recommender.load_state_dict(checkpoint['recommender'])
recommender.eval()

# Request models
class TextInput(BaseModel):
    features: list

class TaskInput(BaseModel):
    features: list

@app.post("/verify")
def verify_text(data: TextInput):
    tensor = torch.tensor([data.features], dtype=torch.float32)
    result = predict_verifier(verifier, tensor)
    return {"verification_score": float(result[0][0])}

@app.post("/suggest_task")
def suggest_task(data: TaskInput):
    tensor = torch.tensor([data.features], dtype=torch.float32)
    result = predict_recommender(recommender, tensor)
    return {"suggested_task_vector": result[0].tolist()}

@app.get("/health")
def health_check():
    return {"status": "AI server running ✅"}
