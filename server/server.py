from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
from bull_flags import find_bull_flags
from bear_flags import find_bear_flags
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.route('/api/getsi', methods=['GET'])
def get_stock_info():
    symbol = request.args.get('symbol', default='0', type=str)
    ticker = yf.Ticker(symbol)
    info = ticker.history(period='1d', interval='1m')
    data = info[-120:]
    formatted_data = []
    bull_flags = find_bull_flags(info['Close'][-120:].values, 7)
    bear_flags = find_bear_flags(info['Close'][-120:].values, 7)
    bull_flag_dates = []
    bear_flag_dates = []
    for i, (date, row) in enumerate(data.iterrows()):
        if i in bull_flags:
            bull_flag_dates.append(date.timestamp() * 1000)
        if i in bear_flags:
            bear_flag_dates.append(date.timestamp() * 1000)
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

    return jsonify([formatted_data, bull_flag_dates, bear_flag_dates])

@app.route('/api/getallalerts', methods=['GET'])
def get_all_alerts():
    symbols = request.args.get('symbols', default='0', type=str).split(',')
    alerts = []
    for symbol in symbols:
        ticker = yf.Ticker(symbol)
        info = ticker.history(period='1d', interval='1m')
        data = info[-120:]
        bull_flags = find_bull_flags(info['Close'][-120:].values, 7)
        bear_flags = find_bear_flags(info['Close'][-120:].values, 7)
        for i in range(len(data)):
            if i in bull_flags:
                alerts.append({
                    'symbol': symbol,
                    'pattern': 'Bull Flag',
                    'date': data['Close'].index[i].timestamp() * 1000,
                    'color': 'green'
                })
            if i in bear_flags:
                alerts.append({
                    'symbol': symbol,
                    'pattern': 'Bear Flag',
                    'date': data['Close'].index[i].timestamp() * 1000,
                    'color': 'red'
                })
    return jsonify(alerts)

if __name__ == '__main__':
    app.run(debug=True, port=8080)