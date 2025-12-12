from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import random

app = Flask(__name__)
# Allow CORS for all domains
CORS(app)

# List of user agents to rotate
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
]

@app.route('/api/stock', methods=['GET'])
def get_stock():
    symbols_param = request.args.get('symbol') or request.args.get('symbols')
    if not symbols_param:
        return jsonify({'error': 'Symbol(s) required'}), 400

    try:
        # Use Yahoo Finance Quote API (Batch support)
        # https://query1.finance.yahoo.com/v7/finance/quote?symbols=AAPL,GOOG
        url = f"https://query1.finance.yahoo.com/v7/finance/quote?symbols={symbols_param}"
        
        headers = {
            'User-Agent': random.choice(USER_AGENTS),
            'Accept': '*/*'
        }

        # Timeout increased slightly for batch
        response = requests.get(url, headers=headers, timeout=8)
        
        # Failover to query2 if query1 fails
        if response.status_code != 200:
            url = f"https://query2.finance.yahoo.com/v7/finance/quote?symbols={symbols_param}"
            response = requests.get(url, headers=headers, timeout=8)
            
        if response.status_code != 200:
            return jsonify({'error': f'Upstream error: {response.status_code}'}), response.status_code

        data = response.json()
        results = data.get('quoteResponse', {}).get('result', [])
        
        if not results:
             return jsonify({'error': 'No data found', 'raw': data}), 404

        # Response list
        mapped_results = []
        
        for item in results:
             mapped_results.append({
                'symbol': item.get('symbol'),
                'currentPrice': item.get('regularMarketPrice'),
                'previousClose': item.get('regularMarketPreviousClose'),
                'open': item.get('regularMarketOpen'),
                'dayHigh': item.get('regularMarketDayHigh'),
                'dayLow': item.get('regularMarketDayLow'),
                'volume': item.get('regularMarketVolume'),
                'marketCap': item.get('marketCap'),
                'shortName': item.get('shortName'),
                'longName': item.get('longName'),
                'currency': item.get('currency'),
                'exchange': item.get('exchange'),
                'change': item.get('regularMarketChange'),
                'changePercent': item.get('regularMarketChangePercent')
            })
        
        # If single symbol was requested but returned as list, structure it to match old API if needed?
        # But better to just always return a list or let frontend handle it. 
        # For compatibility with potential existing single-fetch calls, if mapped_results len is 1, maybe return object? 
        # The frontend logic I'm writing will handle a list.
        
        flask_res = jsonify({'results': mapped_results})
        # Cache for 10 seconds
        flask_res.headers['Cache-Control'] = 'public, max-age=10, s-maxage=10'
        return flask_res

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/search', methods=['GET'])
def search_stocks():
     return jsonify({'message': 'Search functionality not implemented'})

if __name__ == '__main__':
    app.run(debug=True, port=3001)
