import torch
import torch.nn as nn
import pickle
import pandas as pd
import numpy as np

# -----------------------------
# Device
# -----------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# -----------------------------
# LSTM Model Definition
# -----------------------------
class LSTMModel(nn.Module):
    def __init__(self, input_size, hidden_size1=64, hidden_size2=32):
        super(LSTMModel, self).__init__()
        self.lstm1 = nn.LSTM(input_size, hidden_size1, batch_first=True)
        self.lstm2 = nn.LSTM(hidden_size1, hidden_size2, batch_first=True)
        self.fc = nn.Linear(hidden_size2, 1)
    
    def forward(self, x):
        out, _ = self.lstm1(x)
        out, _ = self.lstm2(out)
        out = out[:, -1, :]  # take last timestep
        out = self.fc(out)
        return out

# -----------------------------
# Load trained model
# -----------------------------
model = LSTMModel(input_size=10)  # 10 features
model.load_state_dict(torch.load("second_model_lstm.pth", map_location=device))
model.to(device)
model.eval()

# -----------------------------
# Load scaler and encoder
# -----------------------------
with open("second_model_scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

with open("second_model_encoder.pkl", "rb") as f:
    encoder = pickle.load(f)

# -----------------------------
# Load dataset
# -----------------------------
df_all = pd.read_csv("all_stocks.csv", parse_dates=['Date'])

# -----------------------------
# Prepare input for LSTM
# -----------------------------
def prepare_input(df_last30, ticker, scaler, encoder):
    df = df_last30.copy()
    
    # Encode ticker
    df['Ticker_encoded'] = encoder.transform(df['Ticker'])
    
    # Ensure Date is datetime
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
    
    # Cyclical date features
    df['month_sin'] = np.sin(2 * np.pi * df['Date'].dt.month / 12)
    df['month_cos'] = np.cos(2 * np.pi * df['Date'].dt.month / 12)
    df['dow_sin'] = np.sin(2 * np.pi * df['Date'].dt.dayofweek / 7)
    df['dow_cos'] = np.cos(2 * np.pi * df['Date'].dt.dayofweek / 7)
    
    # Scaled numeric features
    num_cols = ['Open','High','Low','Close','Volume']
    X_scaled = scaler.transform(df[num_cols])
    
    # Non-scaled features (encoded + cyclical)
    X_non_scaled = df[['Ticker_encoded','month_sin','month_cos','dow_sin','dow_cos']].values
    
    # Combine features
    X_final = np.hstack([X_scaled, X_non_scaled])
    
    # Convert to tensor: shape (1 sample, 30 timesteps, 10 features)
    X_tensor = torch.tensor(X_final.reshape(1, 30, 10), dtype=torch.float32).to(device)
    
    return X_tensor

# -----------------------------
# Predict next Close
# -----------------------------
def predict_next_close(model, X_tensor, scaler):
    model.eval()
    with torch.no_grad():
        pred_scaled = model(X_tensor).cpu().numpy().flatten()[0]
    
    # Inverse-transform to original price
    dummy = np.zeros((1, 5))  # 5 numeric features in scaler
    dummy[0,3] = pred_scaled   # Close is index 3
    pred_original = scaler.inverse_transform(dummy)[0,3]
    
    return pred_original

# -----------------------------
# Get last 30 days for a ticker
# -----------------------------
def get_last_30_days(ticker):
    df_ticker = df_all[df_all['Ticker'] == ticker].copy()
    df_ticker = df_ticker.sort_values(by='Date')
    df_last30 = df_ticker.tail(30).reset_index(drop=True)
    return df_last30

# -----------------------------
# Predict for tickers
# -----------------------------
tickers = ['IBM','GOOG','MSFT','AAPL']
predictions = {}

for ticker in tickers:
    df_last30 = get_last_30_days(ticker)
    X_tensor = prepare_input(df_last30, ticker, scaler, encoder)
    
    # Prediction
    pred_close = predict_next_close(model, X_tensor, scaler)
    predictions[ticker] = pred_close

# -----------------------------
# Print results
# -----------------------------
print("Predicted Close prices for next day:")
for t, p in predictions.items():
    print(f"{t}: {p:.2f}")
