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
        # Handle both comma and space separated
        clean_symbols = symbols_param.replace(',', ' ')
        
        tickers = yf.Tickers(clean_symbols)
        
        mapped_results = []
        
        # ... (processing) ...
        
        # Iterate through the requested symbols
        for symbol, ticker_obj in tickers.tickers.items():
             try:
                # Use fast_info for critical price data (much faster than .info)
                fast_info = ticker_obj.fast_info
                
                # Retrieve price from fast_info
                # fast_info attributes: last_price, previous_close, open, day_high, day_low, etc.
                try:
                    current_price = fast_info.last_price
                    previous_close = fast_info.previous_close
                    
                    # If market is closed, last_price might be "yesterday's close" or "current pre-market"? 
                    # fast_info usually gives the most relevant "last traded price"
                    
                    if previous_close:
                        change = current_price - previous_close
                        change_percent = (change / previous_close * 100)
                    else:
                        change = 0
                        change_percent = 0
                    
                    mapped_results.append({
                        'symbol': symbol,
                        'currentPrice': current_price,
                        'previousClose': previous_close,
                        'open': fast_info.open,
                        'dayHigh': fast_info.day_high,
                        'dayLow': fast_info.day_low,
                        # Skip 'volume', 'marketCap', 'longName' to avoid slow .info calls
                        # The frontend mostly needs Price + Change% for the ticker.
                        'change': change,
                        'changePercent': change_percent
                    })
                except Exception as inner_e:
                     print(f"Fast info error for {symbol}: {inner_e}")
                     # Fallback to simple history fetch (1 day) if fast_info fails? 
                     # Or just skip. .info is too slow for 20+ symbols in a loop.
                     continue

             except Exception as e:
                print(f"Error fetching {symbol}: {e}")
                continue
        
        if not mapped_results:
             return jsonify({'error': 'No data found for symbols'}), 404
        
        flask_res = jsonify({'results': mapped_results})
        # Disable caching to force real-time usage
        flask_res.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return flask_res

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/search', methods=['GET'])
def search_stocks():
     return jsonify({'message': 'Search functionality not implemented'})

if __name__ == '__main__':
    app.run(debug=True, port=3001)
