import requests
import random

symbols = "^NSEI,^NSEBANK,RELIANCE.NS"
url = f"https://query2.finance.yahoo.com/v7/finance/quote?symbols={symbols}"

USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
]

headers = {
    'User-Agent': random.choice(USER_AGENTS),
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'max-age=0'
}

try:
    print(f"Requesting: {url}")
    response = requests.get(url, headers=headers, timeout=5)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        results = data.get('quoteResponse', {}).get('result', [])
        for item in results:
            print(f"{item['symbol']}: {item.get('regularMarketPrice')} (Change: {item.get('regularMarketChange')})")
    else:
        print(f"Response: {response.text}")

except Exception as e:
    print(f"Error: {e}")
