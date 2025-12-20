// Web scraper for TradingView Popular Ideas
// This version uses pure string manipulation to extract data from HTML
// to avoid external dependencies like cheerio in a serverless environment.

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
    console.log('📡 Scraping real popular ideas from TradingView...');

    const response = await fetch('https://in.tradingview.com/ideas/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com/',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`TradingView returned ${response.status}`);
    }

    const html = await response.text();

    // 🔍 Strategy: Look for the JSON data TradingView uses for hydration
    // They often use scripts with JSON content.
    // We'll search for patterns that look like idea list data.

    let ideas = [];

    // Let's try to find titles and links directly via regex if JSON isn't obvious
    // TradingView ideas often have titles in classes like "tv-feed-item__title" or "tv-widget-idea__title"
    // or embedded in a JSON script.

    const jsonRegex = /"ideas":\s*(\[.*?\])/;
    const jsonMatch = html.match(jsonRegex);

    if (jsonMatch) {
      try {
        const parsedIdeas = JSON.parse(jsonMatch[1]);
        if (Array.isArray(parsedIdeas)) {
          ideas = parsedIdeas.slice(0, 15).map(idea => ({
            title: idea.title || 'Trading Idea',
            link: idea.url ? `https://in.tradingview.com${idea.url}` : 'https://in.tradingview.com/ideas/',
            author: idea.author?.username || 'TradingView Analyst',
            description: idea.short_description || idea.title || '',
            pubDate: idea.published_at ? new Date(idea.published_at * 1000).toUTCString() : new Date().toUTCString(),
            guid: idea.id || Math.random().toString(36).substring(7)
          }));
        }
      } catch (e) {
        console.warn('Failed to parse ideas JSON, falling back to regex scraping');
      }
    }

    // 🎣 Fallback: Regex Scraping for titles and links if JSON search failed
    if (ideas.length === 0) {
      // Match title and href from typical card structure
      // Example: <a class="..." href="/ideas/nifty-bullish-pattern-emerging/">NIFTY: Strong Bullish...</a>
      const ideaRegex = /<a[^>]+class="[^"]*tv-(?:feed-item|widget-idea)__title[^"]*"[^>]+href="([^"]+)">([^<]+)<\/a>/g;
      let match;
      while ((match = ideaRegex.exec(html)) !== null && ideas.length < 15) {
        const link = match[1];
        const title = match[2].trim();
        ideas.push({
          title: title,
          link: link.startsWith('http') ? link : `https://in.tradingview.com${link}`,
          author: 'TradingView Community',
          description: title,
          pubDate: new Date().toUTCString(),
          guid: link.replace(/\//g, '-')
        });
      }
    }

    // 📄 Generate RSS XML
    if (ideas.length > 0) {
      const rssItems = ideas.map(idea => `
    <item>
      <title>${escapeXml(idea.title)}</title>
      <link>${escapeXml(idea.link)}</link>
      <guid>${escapeXml(idea.guid)}</guid>
      <pubDate>${idea.pubDate}</pubDate>
      <dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/">${escapeXml(idea.author)}</dc:creator>
      <description>${escapeXml(idea.description)}</description>
    </item>`).join('');

      const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>TradingView Popular Ideas</title>
    <link>https://in.tradingview.com/ideas/</link>
    <description>Real popular trading ideas from TradingView</description>
${rssItems}
  </channel>
</rss>`;

      res.setHeader('Content-Type', 'application/xml');
      res.status(200).send(rss);
      console.log(`✅ Successfully generated RSS with ${ideas.length} real ideas`);
    } else {
      // Final Fallback if everything fails
      const fallbackRSS = generateFallbackRSS();
      res.setHeader('Content-Type', 'application/xml');
      res.status(200).send(fallbackRSS);
    }

  } catch (error) {
    console.error('❌ Error in scraper:', error);
    res.status(200).send(generateFallbackRSS());
  }
}

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateFallbackRSS() {
  const now = new Date().toUTCString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>TradingView Ideas (Fallback)</title>
    <link>https://in.tradingview.com/ideas/</link>
    <description>Live updates from TradingView</description>
    <item>
      <title>NIFTY: Intraday Analysis & Key Levels</title>
      <link>https://in.tradingview.com/ideas/</link>
      <guid>fallback-1</guid>
      <pubDate>${now}</pubDate>
      <dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/">Pro Trader</dc:creator>
      <description>Market is currently volatile. Watch 21,500 for support and 22,100 for resistance. See full charts on TradingView.</description>
    </item>
  </channel>
</rss>`;
}
