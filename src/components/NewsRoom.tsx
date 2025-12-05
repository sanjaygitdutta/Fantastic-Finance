import { useState, useEffect } from 'react';
import { Newspaper, TrendingUp, Globe, Calendar, ExternalLink, RefreshCw, Search, AlertCircle, Tag, TrendingDown, Clock, Zap, DollarSign, Bitcoin } from 'lucide-react';
import { InFeedAd } from './AdSense';

interface NewsArticle {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    source: {
        name: string;
    };
    sentiment?: 'bullish' | 'bearish' | 'neutral';
    relatedSymbols?: string[];
    category?: string;
    isBreaking?: boolean;
}

type Category = 'latest' | 'stocks' | 'forex' | 'commodities' | 'crypto' | 'economy';

export default function NewsRoom() {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeCategory, setActiveCategory] = useState<Category>('latest');
    const [searchQuery, setSearchQuery] = useState('');
    const [displayCount, setDisplayCount] = useState(12);

    const categories = [
        { id: 'latest' as Category, name: 'Latest', icon: Zap },
        { id: 'stocks' as Category, name: 'Stocks', icon: TrendingUp },
        { id: 'forex' as Category, name: 'Forex', icon: DollarSign },
        { id: 'commodities' as Category, name: 'Commodities', icon: Globe },
        { id: 'crypto' as Category, name: 'Crypto', icon: Bitcoin },
        { id: 'economy' as Category, name: 'Economy', icon: TrendingDown }
    ];

    const fetchNews = async (category: Category) => {
        setLoading(true);
        setError('');

        const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;

        try {
            if (!apiKey || apiKey === 'demo') {
                console.log('No API key found, using mock data');
                setNews(getMockNews(category));
                setLoading(false);
                return;
            }

            let topics = 'economy_macro,financial_markets';
            if (category === 'stocks') topics = 'equity,earnings';
            if (category === 'forex') topics = 'forex';
            if (category === 'commodities') topics = 'energy,manufacturing';
            if (category === 'crypto') topics = 'blockchain,cryptocurrency';
            if (category === 'economy') topics = 'economy_macro,economy_fiscal';

            const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=${topics}&sort=LATEST&limit=50&apikey=${apiKey}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.feed) {
                const articles: NewsArticle[] = data.feed.map((item: any) => {
                    // Determine sentiment
                    let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
                    if (item.overall_sentiment_score > 0.15) sentiment = 'bullish';
                    if (item.overall_sentiment_score < -0.15) sentiment = 'bearish';

                    // Extract related symbols
                    const relatedSymbols = item.ticker_sentiment?.slice(0, 3).map((t: any) => t.ticker) || [];

                    return {
                        title: item.title,
                        description: item.summary,
                        url: item.url,
                        urlToImage: item.banner_image || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
                        publishedAt: item.time_published ?
                            `${item.time_published.slice(0, 4)}-${item.time_published.slice(4, 6)}-${item.time_published.slice(6, 8)}T${item.time_published.slice(9, 11)}:${item.time_published.slice(11, 13)}:${item.time_published.slice(13, 15)}Z`
                            : new Date().toISOString(),
                        source: {
                            name: item.source || 'Alpha Vantage'
                        },
                        sentiment,
                        relatedSymbols,
                        category: item.category_within_source || category,
                        isBreaking: new Date().getTime() - new Date(item.time_published).getTime() < 3600000 // Less than 1 hour
                    };
                });
                setNews(articles);
            } else {
                console.warn('Alpha Vantage API limit or error:', data);
                setNews(getMockNews(category));
            }
        } catch (err) {
            console.error('Error fetching news:', err);
            setNews(getMockNews(category));
        } finally {
            setLoading(false);
        }
    };

    const getMockNews = (category: Category): NewsArticle[] => {
        const baseNews = [
            {
                title: 'Global Markets Rally on Positive Economic Data',
                description: 'Stock markets worldwide surge as economic indicators show strong growth potential across major economies.',
                url: '#',
                urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
                publishedAt: new Date().toISOString(),
                source: { name: 'Financial Times' },
                sentiment: 'bullish' as const,
                relatedSymbols: ['SPY', 'QQQ', 'DIA'],
                category: 'stocks',
                isBreaking: true
            },
            {
                title: 'Federal Reserve Signals Potential Rate Changes',
                description: 'Central bank officials hint at policy adjustments in upcoming meetings, impacting currency markets.',
                url: '#',
                urlToImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400',
                publishedAt: new Date(Date.now() - 3600000).toISOString(),
                source: { name: 'Bloomberg' },
                sentiment: 'neutral' as const,
                relatedSymbols: ['DXY', 'EUR/USD'],
                category: 'forex'
            },
            {
                title: 'Gold Prices Surge to New Highs Amid Uncertainty',
                description: 'Safe-haven assets gain traction as investors seek protection from market volatility.',
                url: '#',
                urlToImage: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400',
                publishedAt: new Date(Date.now() - 7200000).toISOString(),
                source: { name: 'Reuters' },
                sentiment: 'bullish' as const,
                relatedSymbols: ['GLD', 'GOLD'],
                category: 'commodities'
            },
            {
                title: 'Bitcoin Reaches New All-Time High',
                description: 'Cryptocurrency markets see massive gains as institutional adoption accelerates globally.',
                url: '#',
                urlToImage: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400',
                publishedAt: new Date(Date.now() - 10800000).toISOString(),
                source: { name: 'CoinDesk' },
                sentiment: 'bullish' as const,
                relatedSymbols: ['BTC', 'ETH'],
                category: 'crypto'
            },
            {
                title: 'Tech Sector Faces Regulatory Challenges',
                description: 'Major technology companies under scrutiny as governments propose new regulations.',
                url: '#',
                urlToImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
                publishedAt: new Date(Date.now() - 14400000).toISOString(),
                source: { name: 'Wall Street Journal' },
                sentiment: 'bearish' as const,
                relatedSymbols: ['AAPL', 'GOOGL', 'META'],
                category: 'stocks'
            },
            {
                title: 'GDP Growth Exceeds Expectations in Q4',
                description: 'Economic data shows robust expansion, signaling strong fundamentals for the coming year.',
                url: '#',
                urlToImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400',
                publishedAt: new Date(Date.now() - 18000000).toISOString(),
                source: { name: 'Economic Times' },
                sentiment: 'bullish' as const,
                relatedSymbols: ['NIFTY', 'SENSEX'],
                category: 'economy'
            }
        ];

        if (category === 'latest') return baseNews;
        return baseNews.filter(n => n.category === category);
    };

    useEffect(() => {
        fetchNews(activeCategory);
    }, [activeCategory]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const filteredNews = news.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displayedNews = filteredNews.slice(0, displayCount);
    const breakingNews = news.filter(n => n.isBreaking);
    const featuredArticle = filteredNews[0];
    const trendingNews = [...news].sort(() => Math.random() - 0.5).slice(0, 5);

    const getSentimentBadge = (sentiment?: string) => {
        if (sentiment === 'bullish') return { text: 'Bullish', class: 'bg-green-100 text-green-800 border-green-200' };
        if (sentiment === 'bearish') return { text: 'Bearish', class: 'bg-red-100 text-red-800 border-red-200' };
        return { text: 'Neutral', class: 'bg-slate-100 text-slate-800 border-slate-200' };
    };

    return (
        <div className="space-y-6">
            {/* Breaking News Banner */}
            {breakingNews.length > 0 && (
                <div className="bg-red-600 text-white p-3 rounded-lg flex items-center gap-3 animate-pulse">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 overflow-hidden">
                        <p className="font-bold text-sm">BREAKING NEWS:</p>
                        <p className="text-sm truncate">{breakingNews[0].title}</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-2xl text-white shadow-lg">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <Newspaper className="w-8 h-8" />
                            Financial News Room
                        </h1>
                        <p className="text-purple-100">Real-time market news, analysis, and insights</p>
                    </div>
                    <button
                        onClick={() => fetchNews(activeCategory)}
                        className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition"
                        title="Refresh news"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search news articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(cat => {
                    const Icon = cat.icon;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${activeCategory === cat.id
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-purple-300'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {cat.name}
                        </button>
                    );
                })}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
                            <div className="bg-slate-200 h-48 rounded-lg mb-4"></div>
                            <div className="bg-slate-200 h-4 rounded mb-2"></div>
                            <div className="bg-slate-200 h-4 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Featured Article */}
                        {featuredArticle && (
                            <a
                                href={featuredArticle.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block bg-white rounded-2xl border-2 border-purple-200 overflow-hidden hover:shadow-2xl transition group"
                            >
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="h-64 md:h-auto overflow-hidden bg-slate-100">
                                        <img
                                            src={featuredArticle.urlToImage}
                                            alt={featuredArticle.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                        />
                                    </div>
                                    <div className="p-6 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-xs font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                                                FEATURED
                                            </span>
                                            {featuredArticle.sentiment && (
                                                <span className={`text-xs font-semibold px-2 py-1 rounded border ${getSentimentBadge(featuredArticle.sentiment).class}`}>
                                                    {getSentimentBadge(featuredArticle.sentiment).text}
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition">
                                            {featuredArticle.title}
                                        </h2>
                                        <p className="text-slate-600 mb-4 line-clamp-3">
                                            {featuredArticle.description}
                                        </p>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500">{featuredArticle.source.name}</span>
                                            <span className="text-slate-500 flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {formatDate(featuredArticle.publishedAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        )}

                        {/* News Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {displayedNews.slice(1).map((article, index) => {
                                const sentiment = getSentimentBadge(article.sentiment);
                                return (
                                    <a
                                        key={index}
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition group"
                                    >
                                        <div className="h-48 overflow-hidden bg-slate-100">
                                            <img
                                                src={article.urlToImage}
                                                alt={article.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400';
                                                }}
                                            />
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">
                                                    {article.source.name}
                                                </span>
                                                {article.sentiment && (
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded border ${sentiment.class}`}>
                                                        {sentiment.text}
                                                    </span>
                                                )}
                                                <span className="text-xs text-slate-500 flex items-center gap-1 ml-auto">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(article.publishedAt)}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition">
                                                {article.title}
                                            </h3>
                                            <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                                                {article.description}
                                            </p>
                                            {article.relatedSymbols && article.relatedSymbols.length > 0 && (
                                                <div className="flex items-center gap-1 mb-3 flex-wrap">
                                                    <Tag className="w-3 h-3 text-slate-400" />
                                                    {article.relatedSymbols.map(symbol => (
                                                        <span key={symbol} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                                                            {symbol}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-purple-600 text-sm font-medium">
                                                Read more
                                                <ExternalLink className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>

                        {/* Load More */}
                        {displayCount < filteredNews.length && (
                            <div className="text-center">
                                <button
                                    onClick={() => setDisplayCount(prev => prev + 12)}
                                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                                >
                                    Load More Articles
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Trending */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-orange-600" />
                                Trending Now
                            </h3>
                            <div className="space-y-3">
                                {trendingNews.map((article, i) => (
                                    <a
                                        key={i}
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-3 hover:bg-slate-50 rounded-lg transition group"
                                    >
                                        <p className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-purple-600 mb-1">
                                            {article.title}
                                        </p>
                                        <p className="text-xs text-slate-500">{formatDate(article.publishedAt)}</p>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* AdSense In-Feed Ad */}
                        <InFeedAd adSlot="1234567891" className="my-6" />
                    </div>
                </div>
            )}
        </div>
    );
}
