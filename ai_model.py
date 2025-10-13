# ai_model.py
import torch
import torch.nn as nn
import torch.optim as optim

# Simple example model (text verification)
class SimpleVerifier(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super(SimpleVerifier, self).__init__()
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_dim, output_dim)
        self.sigmoid = nn.Sigmoid()
    
    def forward(self, x):
        out = self.fc1(x)
        out = self.relu(out)
        out = self.fc2(out)
        out = self.sigmoid(out)
        return out

def train_model(train_data, train_labels):
    model = SimpleVerifier(input_dim=100, hidden_dim=64, output_dim=1)
    criterion = nn.BCELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    for epoch in range(10):
        outputs = model(train_data)
        loss = criterion(outputs, train_labels)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        print(f"Epoch [{epoch+1}/10], Loss: {loss.item():.4f}")
    
    torch.save(model.state_dict(), "models/ai_model.pth")
    return model

def predict(model, input_data):
    with torch.no_grad():
        return model(input_data)
      
