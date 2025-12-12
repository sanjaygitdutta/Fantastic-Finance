from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf

app = Flask(__name__)
# Allow CORS for all domains
CORS(app)

@app.route('/api/stock', methods=['GET'])
def get_stock():
    symbols_param = request.args.get('symbol') or request.args.get('symbols')
    if not symbols_param:
        return jsonify({'error': 'Symbol(s) required'}), 400

    try:
        # Use yfinance library for robust fetching
        # yfinance handles cookies, crumbs, and user-agents automatically
        tickers = yf.Tickers(symbols_param)
        
        mapped_results = []
        
        # Iterate through the requested symbols
        # tickers.tickers is a dict: {'AAPL': Ticker object, ...}
        for symbol, ticker_obj in tickers.tickers.items():
            try:
                # fast_info is faster for real-time price but has less metadata
                # info has everything but is slower. 
                # Let's try info first for compatibility, or mix.
                info = ticker_obj.info
                
                # If info is empty, it might be a bad symbol or failure
                if not info:
                    continue

                # Map data
                # specific handling for potentially missing keys
                current_price = info.get('currentPrice') or info.get('regularMarketPrice') or info.get('ask') or 0
                previous_close = info.get('previousClose') or info.get('regularMarketPreviousClose') or current_price
                
                change = current_price - previous_close
                change_percent = (change / previous_close * 100) if previous_close else 0

                mapped_results.append({
                    'symbol': symbol, # correct symbol from iteration keys (might differ from input case)
                    'currentPrice': current_price,
                    'previousClose': previous_close,
                    'open': info.get('open') or info.get('regularMarketOpen'),
                    'dayHigh': info.get('dayHigh') or info.get('regularMarketDayHigh'),
                    'dayLow': info.get('dayLow') or info.get('regularMarketDayLow'),
                    'volume': info.get('volume') or info.get('regularMarketVolume'),
                    'marketCap': info.get('marketCap'),
                    'shortName': info.get('shortName'),
                    'longName': info.get('longName'),
                    'currency': info.get('currency'),
                    'exchange': info.get('exchange'),
                    'change': change,
                    'changePercent': change_percent
                })
            except Exception as e:
                print(f"Error fetching {symbol}: {e}")
                continue
        
        if not mapped_results:
             return jsonify({'error': 'No data found for symbols'}), 404
        
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
