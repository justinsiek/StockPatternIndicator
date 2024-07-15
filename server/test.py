import json
import yfinance as yf

def get_stock_info():
    ticker = yf.Ticker('MSFT')
    # Assuming 'info' contains daily stock data
    info = ticker.history(period='1mo')
    
    formatted_data = []
    for date, row in info.iterrows():
        # Convert the date to a timestamp (milliseconds)
        timestamp = int(date.timestamp() * 1000)
        # Extract Open, High, Low, Close prices
        ohlc = [row['Open'], row['High'], row['Low'], row['Close']]
        formatted_data.append({'x': timestamp, 'y': ohlc})
    
    return formatted_data

# Assuming you will somehow transfer this data to your React component
print(json.dumps(get_stock_info()))

