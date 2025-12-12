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
                # Initialize variables
                current_price = 0.0
                previous_close = 0.0
                open_price = 0.0
                day_high = 0.0
                day_low = 0.0
                
                # 1. Try fast_info (Primary Source - Speed)
                try:
                    fast_info = ticker_obj.fast_info
                    current_price = fast_info.last_price
                    previous_close = fast_info.previous_close
                    open_price = fast_info.open
                    day_high = fast_info.day_high
                    day_low = fast_info.day_low
                except:
                    pass

                # 2. Fallback to .info (Secondary Source - Completeness)
                # Only if critical data is missing (price or prev_close)
                if not current_price or not previous_close:
                    try:
                        info = ticker_obj.info
                        if not current_price:
                            current_price = info.get('currentPrice') or info.get('regularMarketPrice') or info.get('ask') or 0
                        if not previous_close:
                            previous_close = info.get('previousClose') or info.get('regularMarketPreviousClose') or current_price
                        
                        # Fill gaps in others if needed
                        if not open_price: open_price = info.get('open') or info.get('regularMarketOpen')
                        if not day_high: day_high = info.get('dayHigh') or info.get('regularMarketDayHigh')
                        if not day_low: day_low = info.get('dayLow') or info.get('regularMarketDayLow')
                    except:
                        pass
                
                # 3. Calculate Change (Safety Check)
                if previous_close and previous_close > 0 and current_price:
                    change = current_price - previous_close
                    change_percent = (change / previous_close * 100)
                else:
                    change = 0.0
                    change_percent = 0.0
                
                # If we still have 0 price, skip this symbol (invalid data)
                if not current_price:
                    continue

                mapped_results.append({
                    'symbol': symbol,
                    'currentPrice': current_price,
                    'previousClose': previous_close,
                    'open': open_price,
                    'dayHigh': day_high,
                    'dayLow': day_low,
                    'change': change,
                    'changePercent': change_percent
                })
            except Exception as e:
                print(f"Error processing {symbol}: {e}")
                continue
        
        if not mapped_results:
             return jsonify({'error': 'No data found for symbols'}), 404
        
        flask_res = jsonify({'results': mapped_results})
        # Disable caching to force real-time usage
        flask_res.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return flask_res

@app.route('/api/search', methods=['GET'])
def search_stocks():
     return jsonify({'message': 'Search functionality not implemented'})

if __name__ == '__main__':
    app.run(debug=True, port=3001)
