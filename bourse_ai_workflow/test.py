import yfinance as yf
import pandas as pd

tickers = ["AAPL", "MSFT", "GOOG", "IBM"]  # add hundreds or thousands of tickers
all_data = []

for ticker in tickers:
    data = yf.Ticker(ticker).history(period="max")  # all historical data
    data['Ticker'] = ticker
    all_data.append(data.reset_index())

big_df = pd.concat(all_data)
big_df.to_csv("all_stocks.csv", index=False)
print("Saved big CSV with all tickers!")
