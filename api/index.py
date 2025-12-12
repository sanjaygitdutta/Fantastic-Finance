from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import concurrent.futures

app = Flask(__name__)
# Allow CORS for all domains
CORS(app)

def fetch_symbol_data(symbol, ticker_object):
    """
    Helper function to fetch data for a single symbol.
    Prioritizes .info for accuracy, falls back to fast_info for speed/resilience.
    """
    try:
        # Try .info first for the official "Market Change" values
        # This is slower but accurate. We rely on threading to make it fast enough.
        info = ticker_object.info
        if info:
            current_price = info.get('currentPrice') or info.get('regularMarketPrice') or info.get('ask') or 0.0
            previous_close = info.get('previousClose') or info.get('regularMarketPreviousClose') 
            
            # Use official change if available, else calculate
            change = info.get('regularMarketChange')
            change_percent = info.get('regularMarketChangePercent')
            
            # Fallback calculation if explicit keys missing
            if (change is None or change_percent is None) and previous_close and current_price:
                change = current_price - previous_close
                if previous_close != 0:
                    change_percent = (change / previous_close) * 100
                else:
                    change_percent = 0.0

            # Normalize missing values
            if change is None: change = 0.0
            if change_percent is None: change_percent = 0.0
            if previous_close is None: previous_close = current_price # Fallback

            return {
                'symbol': symbol,
                'currentPrice': current_price,
                'previousClose': previous_close,
                'open': info.get('open') or info.get('regularMarketOpen'),
                'dayHigh': info.get('dayHigh') or info.get('regularMarketDayHigh'),
                'dayLow': info.get('dayLow') or info.get('regularMarketDayLow'),
                'change': change,
                'changePercent': change_percent
            }
    except Exception as e:
        # print(f"Info fetch failed for {symbol}: {e}")
        pass

    # Fallback to fast_info if .info failed
    try:
        fast_info = ticker_object.fast_info
        current_price = fast_info.last_price
        previous_close = fast_info.previous_close
        
        if previous_close and previous_close > 0:
            change = current_price - previous_close
            change_percent = (change / previous_close * 100)
        else:
            change = 0.0
            change_percent = 0.0

        return {
            'symbol': symbol,
            'currentPrice': current_price,
            'previousClose': previous_close,
            'open': fast_info.open,
            'dayHigh': fast_info.day_high,
            'dayLow': fast_info.day_low,
            'change': change,
            'changePercent': change_percent
        }
    except Exception as e:
        print(f"All fetch methods failed for {symbol}: {e}")
        return None

@app.route('/api/stock', methods=['GET'])
def get_stock():
    symbols_param = request.args.get('symbol') or request.args.get('symbols')
    if not symbols_param:
        return jsonify({'error': 'Symbol(s) required'}), 400

    try:
        clean_symbols = symbols_param.replace(',', ' ')
        tickers = yf.Tickers(clean_symbols)
        
        mapped_results = []
        
        # Use ThreadPoolExecutor to fetch in parallel
        # Max workers = number of symbols or a reasonable limit (e.g., 20)
        # Limiting to 10 workers to avoid overwhelming the server/source
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            future_to_symbol = {
                executor.submit(fetch_symbol_data, symbol, ticker): symbol 
                for symbol, ticker in tickers.tickers.items()
            }
            
            for future in concurrent.futures.as_completed(future_to_symbol):
                symbol = future_to_symbol[future]
                try:
                    data = future.result()
                    if data:
                        mapped_results.append(data)
                except Exception as exc:
                    print(f'{symbol} generated an exception: {exc}')

        if not mapped_results:
             return jsonify({'error': 'No data found for symbols'}), 404
        
        flask_res = jsonify({'results': mapped_results})
        flask_res.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return flask_res

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/search', methods=['GET'])
def search_stocks():
     return jsonify({'message': 'Search functionality not implemented'})

if __name__ == '__main__':
    app.run(debug=True, port=3001)
