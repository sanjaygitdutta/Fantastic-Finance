// Vercel Serverless Function to fetch TradingView RSS feed
// This runs server-side, so NO CORS issues!

export default async function handler(req, res) {
    // Enable CORS for your domain
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('📡 Fetching TradingView RSS feed...');

        // Fetch directly from TradingView - no CORS on server-side!
        const response = await fetch('https://in.tradingview.com/ideas/feed/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/rss+xml, application/xml, text/xml, */*'
            }
        });

        if (!response.ok) {
            throw new Error(`TradingView returned ${response.status}`);
        }

        const xmlText = await response.text();

        // Return raw XML to frontend
        res.setHeader('Content-Type', 'application/xml');
        res.status(200).send(xmlText);

        console.log('✅ Successfully fetched TradingView RSS feed');
    } catch (error) {
        console.error('❌ Error fetching TradingView feed:', error);
        res.status(500).json({
            error: 'Failed to fetch TradingView feed',
            message: error.message
        });
    }
}
