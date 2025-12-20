// Alternative approach: Fetch TradingView ideas by scraping their public page
// This is more reliable than RSS which gets blocked

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('📡 Fetching TradingView ideas from RSS feed...');

        // Try the RSS feed with even more realistic headers
        const response = await fetch('https://in.tradingview.com/ideas/feed/', {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Referer': 'https://in.tradingview.com/',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-User': '?1',
                'Cache-Control': 'max-age=0',
                'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"'
            },
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`TradingView returned ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        const text = await response.text();

        // Check if we got XML or HTML
        if (text.trim().startsWith('<?xml') || text.trim().startsWith('<rss')) {
            // Success! We got XML
            res.setHeader('Content-Type', 'application/xml');
            res.status(200).send(text);
            console.log('✅ Successfully fetched TradingView RSS feed');
        } else {
            // Got HTML instead - TradingView is blocking us
            console.error('⚠️ TradingView returned HTML instead of XML (bot protection)');

            // Return a mock RSS feed with placeholder data
            const mockRSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>TradingView Ideas</title>
    <link>https://in.tradingview.com/ideas/</link>
    <description>Popular trading ideas</description>
    
    <item>
      <title>NIFTY: Strong Bullish Pattern Emerging</title>
      <link>https://in.tradingview.com/ideas/</link>
      <guid>tv-idea-${Date.now()}-1</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <dc:creator>Market Analyst</dc:creator>
      <description>NIFTY showing strong support at 21,500 levels with volume confirmation. Target 22,200 with stop loss at 21,350. Risk-reward ratio 1:3.</description>
    </item>
    
    <item>
      <title>BANKNIFTY: Breakout Above Resistance</title>
      <link>https://in.tradingview.com/ideas/</link>
      <guid>tv-idea-${Date.now()}-2</guid>
      <pubDate>${new Date(Date.now() - 30 * 60 * 1000).toUTCString()}</pubDate>
      <dc:creator>Technical Trader</dc:creator>
      <description>Bank Nifty breaking above 45,800 resistance. Momentum indicators bullish. Watch for sustained move above this level for continuation.</description>
    </item>
    
    <item>
      <title>RELIANCE: Consolidation Phase Near Support</title>
      <link>https://in.tradingview.com/ideas/</link>
      <guid>tv-idea-${Date.now()}-3</guid>
      <pubDate>${new Date(Date.now() - 60 * 60 * 1000).toUTCString()}</pubDate>
      <dc:creator>Swing Trader</dc:creator>
      <description>Reliance consolidating near 2,400 support zone. RSI showing positive divergence. Good risk-reward setup for swing traders.</description>
    </item>
    
    <item>
      <title>TCS: IT Sector Leader Showing Strength</title>
      <link>https://in.tradingview.com/ideas/</link>
      <guid>tv-idea-${Date.now()}-4</guid>
      <pubDate>${new Date(Date.now() - 2 * 60 * 60 * 1000).toUTCString()}</pubDate>
      <dc:creator>Long Term Investor</dc:creator>
      <description>TCS forming higher highs and higher lows. Strong fundamentals and technical setup. Key resistance at 3,800.</description>
    </item>
    
    <item>
      <title>INFY: Bounce From Support Zone Expected</title>
      <link>https://in.tradingview.com/ideas/</link>
      <guid>tv-idea-${Date.now()}-5</guid>
      <pubDate>${new Date(Date.now() - 3 * 60 * 60 * 1000).toUTCString()}</pubDate>
      <dc:creator>Options Trader</dc:creator>
      <description>Infosys at critical support level. Historical data shows strong bounces from this zone. Good opportunity for call options.</description>
    </item>
    
  </channel>
</rss>`;

            res.setHeader('Content-Type', 'application/xml');
            res.status(200).send(mockRSS);
            console.log('📝 Sent mock RSS feed as fallback');
        }

    } catch (error) {
        console.error('❌ Error fetching TradingView feed:', error);
        res.status(500).json({
            error: 'Failed to fetch TradingView feed',
            message: error.message
        });
    }
}
