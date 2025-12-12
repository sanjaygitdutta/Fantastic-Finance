from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import random

app = Flask(__name__)
CORS(app)

# Rotating user agents to avoid blocking
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
]

@app.route('/api/stock', methods=['GET'])
def get_stock():
    symbols_param = request.args.get('symbol') or request.args.get('symbols')
    if not symbols_param:
        return jsonify({'error': 'Symbol(s) required'}), 400

    # Handle comma or space separated
    clean_symbols = symbols_param.replace(' ', ',')
    
    url = f"https://query2.finance.yahoo.com/v7/finance/quote?symbols={clean_symbols}"
    
    headers = {
        'User-Agent': random.choice(USER_AGENTS),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
    }

    try:
        # Timeout is crucial for real-time endpoints
        response = requests.get(url, headers=headers, timeout=5)
        
        if response.status_code != 200:
            print(f"Yahoo API Error: {response.status_code}")
            return jsonify({'error': 'Failed to fetch data from Yahoo'}), response.status_code

        data = response.json()
        quote_results = data.get('quoteResponse', {}).get('result', [])
        
        mapped_results = []
        for item in quote_results:
            # Trusted fields from the Quote API
            # These are pre-calculated by Yahoo (e.g. Official Day Change)
            price = item.get('regularMarketPrice', 0.0)
            previous_close = item.get('regularMarketPreviousClose', 0.0)
            
            # Use official stats if available, else derive safely
            change = item.get('regularMarketChange')
            change_percent = item.get('regularMarketChangePercent')
            
            # Robust fallbacks for pre-market/post-market states if 'regular' is missing
            if change is None or change_percent is None:
                if previous_close and price:
                    change = price - previous_close
                    change_percent = (change / previous_close) * 100
                else:
                    change = 0.0
                    change_percent = 0.0

            mapped_results.append({
                'symbol': item.get('symbol'),
                'currentPrice': price,
                'previousClose': previous_close,
                'open': item.get('regularMarketOpen'),
                'dayHigh': item.get('regularMarketDayHigh'),
                'dayLow': item.get('regularMarketDayLow'),
                'change': change,
                'changePercent': change_percent,
                'shortName': item.get('shortName'),
                'exchange': item.get('exchange')
            })

        if not mapped_results:
             return jsonify({'error': 'No data found'}), 404

        flask_res = jsonify({'results': mapped_results})
        # IMPORTANT: Disable caching for real-time updates
        flask_res.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return flask_res

    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        print(f"API Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/search', methods=['GET'])
def search_stocks():
     return jsonify({'message': 'Search functionality not implemented'})

if __name__ == '__main__':
    app.run(debug=True, port=3001)
