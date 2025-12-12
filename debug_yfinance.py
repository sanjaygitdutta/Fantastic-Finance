import yfinance as yf

symbols = [
    # World
    "^IXIC", "^DJI", "^GSPC", "^GDAXI", "^FTSE",
    # Indian
    "RELIANCE.NS", "TCS.NS", "^NSEI", "^NSEBANK",
    # Crypto
    "BTC-USD", "ETH-USD"
]

print(f"Fetching data for: {symbols}")
tickers = yf.Tickers(" ".join(symbols))

for symbol, ticker in tickers.tickers.items():
    print(f"\n--- {symbol} ---")
    try:
        fast = ticker.fast_info
        print(f"last_price: {fast.last_price}")
        print(f"previous_close: {fast.previous_close}")
        print(f"open: {fast.open}")
        
        # Calculate change
        if fast.previous_close:
            change = fast.last_price - fast.previous_close
            pct = (change / fast.previous_close) * 100
            print(f"CALC Change: {change:.2f}")
            print(f"CALC Change%: {pct:.2f}%")
        else:
            print("CALC Change: N/A (No prev close)")

    except Exception as e:
        print(f"Error accessing fast_info: {e}")
        try:
             print("Fallback to .info:")
             info = ticker.info
             print(f"currentPrice: {info.get('currentPrice')}")
             print(f"regularMarketPrice: {info.get('regularMarketPrice')}")
        except Exception as e2:
             print(f"Error accessing .info: {e2}")
