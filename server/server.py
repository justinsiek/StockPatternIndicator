from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf

app = Flask(__name__)
CORS(app)

@app.route('/api/getsi', methods=['GET'])
def get_stock_info():
    symbol = request.args.get('symbol', default='0', type=str)
    ticker = yf.Ticker(symbol)
    info = ticker.history(period='1y')
    formatted_data = []
    for date, row in info.iterrows():
        data_point = {
            'x': int(date.timestamp() * 1000),
            'y': [
                round(row['Open'], 2),
                round(row['High'], 2),
                round(row['Low'], 2),
                round(row['Close'], 2)
            ]
        }
        formatted_data.append(data_point)
    return jsonify(formatted_data)

if __name__ == '__main__':
    app.run(debug=True, port=8080)