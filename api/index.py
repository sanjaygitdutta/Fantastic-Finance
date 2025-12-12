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
             # ... (existing mapping logic) ...
             try:
                # Use fast_info for critical price data (much faster than .info)
                # Fallback to .info if fast_info missing
                fast_info = ticker_obj.fast_info
                
                # Retrieve price from fast_info if possible
                try:
                    current_price = fast_info.last_price
                    previous_close = fast_info.previous_close
                    open_price = fast_info.open
                    day_high = fast_info.day_high
                    day_low = fast_info.day_low
                except:
                     # Fallback to .info
                     info = ticker_obj.info
                     current_price = info.get('currentPrice') or info.get('regularMarketPrice') or 0
                     previous_close = info.get('previousClose') or info.get('regularMarketPreviousClose') or current_price
                     open_price = info.get('open') or info.get('regularMarketOpen')
                     day_high = info.get('dayHigh') or info.get('regularMarketDayHigh')
                     day_low = info.get('dayLow') or info.get('regularMarketDayLow')

                change = current_price - previous_close
                change_percent = (change / previous_close * 100) if previous_close else 0

                mapped_results.append({
                    'symbol': symbol,
                    'currentPrice': current_price,
                    'previousClose': previous_close,
                    'open': open_price,
                    'dayHigh': day_high,
                    'dayLow': day_low,
                    # fast_info doesn't have volume/name easily, fetch from info if needed or skip for speed
                    # For ticker, we mainly need Price + Change.
                    # Let's keep using .info selectively or lazily if we need full data?
                    # For now, let's stick to .info but wrap it carefully as it initiates network calls per attribute sometimes
                    'change': change,
                    'changePercent': change_percent
                })
             except Exception as e:
                # If fast_info fails, try standard info path one last time completely
                try:
                    info = ticker_obj.info
                    current_price = info.get('currentPrice') or info.get('regularMarketPrice') or 0
                    previous_close = info.get('previousClose') or info.get('regularMarketPreviousClose') or current_price
                    change = current_price - previous_close
                    change_percent = (change / previous_close * 100) if previous_close else 0
                    
                    mapped_results.append({
                        'symbol': symbol,
                        'currentPrice': current_price,
                        'change': change,
                        'changePercent': change_percent
                    })
                except:
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
