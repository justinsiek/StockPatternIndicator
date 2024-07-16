from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
#import psycopg2

app = Flask(__name__)
CORS(app)

@app.route('/api/getsi', methods=['GET'])
def get_stock_info():
    symbol = request.args.get('symbol', default='0', type=str)
    ticker = yf.Ticker(symbol)
    info = ticker.history(period='1mo')
    formatted_data = []
    for date, row in info.iterrows():
        timestamp = int(date.timestamp() * 1000)
        tohlc = [
            timestamp, 
            float(round(row['Open'], 2)), 
            float(round(row['High'], 2)), 
            float(round(row['Low'], 2)), 
            float(round(row['Close'], 2))
        ]
        formatted_data.append(tohlc)
    print(formatted_data)
    return jsonify(formatted_data)



if __name__ == '__main__':
    app.run(debug=True, port=8080)