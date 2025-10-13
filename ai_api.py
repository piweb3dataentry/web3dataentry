# ai_api.py
from fastapi import FastAPI
from pydantic import BaseModel
import torch
from ai_model import SimpleVerifier, predict

app = FastAPI()

# Load model
model = SimpleVerifier(input_dim=100, hidden_dim=64, output_dim=1)
model.load_state_dict(torch.load("models/ai_model.pth"))
model.eval()

# Request model
class InputData(BaseModel):
    features: list

@app.post("/predict")
def make_prediction(data: InputData):
    import torch
    input_tensor = torch.tensor([data.features], dtype=torch.float32)
    result = predict(model, input_tensor)
    return {"prediction": float(result[0][0])}
  
