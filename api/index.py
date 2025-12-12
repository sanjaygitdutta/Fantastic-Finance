from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf

app = Flask(__name__)
CORS(app)

@app.route('/api/stock', methods=['GET'])
def get_stock():
    symbol = request.args.get('symbol')
    if not symbol:
        return jsonify({'error': 'Symbol is required'}), 400

    try:
        # Fetch data using yfinance
        stock = yf.Ticker(symbol)
        
        # Get basic info
        info = stock.info
        
        # Get fast info for real-time price if available
        # fast_info is often more up-to-date for price
        current_price = info.get('currentPrice') or info.get('regularMarketPrice') or \
                       stock.fast_info.last_price if hasattr(stock, 'fast_info') else None
        
        previous_close = info.get('previousClose') or info.get('regularMarketPreviousClose') or \
                        stock.fast_info.previous_close if hasattr(stock, 'fast_info') else None
        
        data = {
            'symbol': symbol,
            'currentPrice': current_price,
            'previousClose': previous_close,
            'open': info.get('open'),
            'dayHigh': info.get('dayHigh'),
            'dayLow': info.get('dayLow'),
            'volume': info.get('volume'),
            'marketCap': info.get('marketCap'),
            'shortName': info.get('shortName'),
            'longName': info.get('longName'),
            'currency': info.get('currency'),
            'exchange': info.get('exchange')
        }
        
        response = jsonify(data)
        # Cache for 5 seconds on Vercel Edge Network, 5 seconds in browser
        response.headers['Cache-Control'] = 'public, max-age=5, s-maxage=5'
        return response
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/search', methods=['GET'])
def search_stocks():
    query = request.args.get('q')
    if not query:
        return jsonify({'error': 'Query is required'}), 400
        
    try:
        # yfinance doesn't have a direct search API that is robust, 
        # but we can try basic validation or just return structure for frontend to use
        # For now, we will return a simple echo or basic lookup if specific symbols are passed
        # A full search requires a database or a different API usually.
        # We can implement a basic lookup for exact matches.
        
        return jsonify({'message': 'Search functionality limited in this version', 'query': query})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# For local testing
if __name__ == '__main__':
    app.run(debug=True)
