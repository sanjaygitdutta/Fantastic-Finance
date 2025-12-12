from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import concurrent.futures
import pandas as pd

app = Flask(__name__)
CORS(app)

def fetch_symbol_history(symbol):
    """
    Fetch price data using history() which is robust for indices and crypto.
    Returns dict with price, change, etc.
    """
    try:
        ticker = yf.Ticker(symbol)
        # Fetch 5 days to ensure we have at least 2 valid trading days (handle weekends/holidays)
        hist = ticker.history(period="5d", interval="1d")
        
        if hist.empty or len(hist) < 1:
            return None

        # Last row is 'Current' (Live/Today)
        current_row = hist.iloc[-1]
        current_price = float(current_row['Close'])
        
        # Second to last is 'Previous Close'
        if len(hist) >= 2:
            prev_row = hist.iloc[-2]
            previous_close = float(prev_row['Close'])
        else:
            # Fallback if only 1 day of data exists (e.g. new listing)
            previous_close = float(current_row['Open']) # Use Open as proxy

        # Calculate Change
        change = current_price - previous_close
        if previous_close != 0:
            change_percent = (change / previous_close) * 100
        else:
            change_percent = 0.0

        return {
            'symbol': symbol,
            'currentPrice': current_price,
            'previousClose': previous_close,
            'open': float(current_row['Open']),
            'dayHigh': float(current_row['High']),
            'dayLow': float(current_row['Low']),
            'change': change,
            'changePercent': change_percent
        }
    except Exception as e:
        print(f"Error fetching {symbol}: {e}")
        return None

@app.route('/api/stock', methods=['GET'])
def get_stock():
    symbols_param = request.args.get('symbol') or request.args.get('symbols')
    if not symbols_param:
        return jsonify({'error': 'Symbol(s) required'}), 400

    # Handle comma/space
    clean_symbols = symbols_param.replace(',', ' ').split()
    
    mapped_results = []
    
    # Parallel Fetching
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        future_to_symbol = {executor.submit(fetch_symbol_history, sym): sym for sym in clean_symbols}
        
        for future in concurrent.futures.as_completed(future_to_symbol):
            try:
                data = future.result()
                if data:
                    mapped_results.append(data)
            except Exception as exc:
                print(f"Exception for symbol: {exc}")

    if not mapped_results:
         return jsonify({'error': 'No data found'}), 404

    flask_res = jsonify({'results': mapped_results})
    flask_res.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    return flask_res

@app.route('/api/search', methods=['GET'])
def search_stocks():
     return jsonify({'message': 'Search functionality not implemented'})

if __name__ == '__main__':
    app.run(debug=True, port=3001)
