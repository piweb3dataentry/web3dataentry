# ai_model.py
import torch
import torch.nn as nn
import torch.optim as optim

# 1. Text Verification Model
class TextVerifier(nn.Module):
    def __init__(self, input_dim=100, hidden_dim=64):
        super(TextVerifier, self).__init__()
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_dim, 1)
        self.sigmoid = nn.Sigmoid()
    
    def forward(self, x):
        return self.sigmoid(self.fc2(self.relu(self.fc1(x))))

# 2. Task Suggestion Model (Collaborative Filtering-like)
class TaskRecommender(nn.Module):
    def __init__(self, input_dim=50, hidden_dim=32):
        super(TaskRecommender, self).__init__()
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_dim, input_dim)
    
    def forward(self, x):
        return self.fc2(self.relu(self.fc1(x)))

# 3. Combined All-in-one AI Trainer
def train_all_models(text_data, text_labels, task_data):
    # Text verification
    verifier = TextVerifier()
    criterion = nn.BCELoss()
    optimizer = optim.Adam(verifier.parameters(), lr=0.001)
    
    for epoch in range(5):
        outputs = verifier(text_data)
        loss = criterion(outputs, text_labels)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
    
    # Task recommendation
    recommender = TaskRecommender()
    optimizer_r = optim.Adam(recommender.parameters(), lr=0.001)
    for epoch in range(5):
        outputs_r = recommender(task_data)
        loss_r = ((outputs_r - task_data)**2).mean()
        optimizer_r.zero_grad()
        loss_r.backward()
        optimizer_r.step()
    
    torch.save({
        'verifier': verifier.state_dict(),
        'recommender': recommender.state_dict()
    }, "models/ai_model.pth")
    
    return verifier, recommender

# Prediction functions
def predict_verifier(model, input_tensor):
    with torch.no_grad():
        return model(input_tensor)

def predict_recommender(model, input_tensor):
    with torch.no_grad():
        return model(input_tensor)
