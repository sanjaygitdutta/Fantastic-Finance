from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import random

app = Flask(__name__)
CORS(app)

# List of user agents to rotate to avoid simple blocking
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
]

@app.route('/api/stock', methods=['GET'])
def get_stock():
    symbol = request.args.get('symbol')
    if not symbol:
        return jsonify({'error': 'Symbol is required'}), 400

    try:
        # Use Yahoo Finance Chart API (Lightweight, JSON)
        # This endpoint often works without complex auth for basic data
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=1d"
        
        headers = {
            'User-Agent': random.choice(USER_AGENTS),
            'Accept': '*/*'
        }

        response = requests.get(url, headers=headers, timeout=5)
        
        if response.status_code != 200:
             # Try failover to query2
            url = f"https://query2.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=1d"
            response = requests.get(url, headers=headers, timeout=5)
            
        if response.status_code != 200:
            return jsonify({'error': f'Upstream error: {response.status_code}'}), response.status_code

        data = response.json()
        result = data.get('chart', {}).get('result', [])
        
        if not result:
            return jsonify({'error': 'No data found'}), 404

        meta = result[0].get('meta', {})
        
        # Map Yahoo Finance fields to our API format
        api_data = {
            'symbol': symbol,
            'currentPrice': meta.get('regularMarketPrice'),
            'previousClose': meta.get('previousClose'),
            'open': meta.get('regularMarketOpen'),
            'dayHigh': meta.get('regularMarketDayHigh'),
            'dayLow': meta.get('regularMarketDayLow'),
            'volume': meta.get('regularMarketVolume'),
            'marketCap': meta.get('marketCap'), # Note: Chart API doesn't always have marketCap
            'shortName': meta.get('shortName') or meta.get('symbol'),
            'longName': meta.get('longName') or meta.get('exchangeName'),
            'currency': meta.get('currency'),
            'exchange': meta.get('exchangeName')
        }
        
        flask_res = jsonify(api_data)
        # Cache for 10 seconds to reduce load/rate-limiting
        flask_res.headers['Cache-Control'] = 'public, max-age=10, s-maxage=10'
        return flask_res

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/search', methods=['GET'])
def search_stocks():
    return jsonify({'message': 'Search functionality not implemented in lightweight mode'})

# For local testing
if __name__ == '__main__':
    app.run(debug=True)
