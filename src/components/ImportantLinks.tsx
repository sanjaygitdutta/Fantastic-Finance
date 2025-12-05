import { Link as LinkIcon, ExternalLink, Globe, FileText, TrendingUp, BarChart3, BookOpen, Shield } from 'lucide-react';
import { DisplayAd } from './AdSense';

interface LinkItem {
    id: number;
    title: string;
    description: string;
    url: string;
    category: 'regulatory' | 'market' | 'research' | 'tools' | 'education';
    icon: any;
}

export default function ImportantLinks() {
    const links: LinkItem[] = [
        {
            id: 1,
            title: 'NSE India',
            description: 'National Stock Exchange of India - Live market data, quotes, and trading information',
            url: 'https://www.nseindia.com',
            category: 'market',
            icon: TrendingUp
        },
        {
            id: 2,
            title: 'BSE India',
            description: 'Bombay Stock Exchange - Asia\'s oldest stock exchange with comprehensive market data',
            url: 'https://www.bseindia.com',
            category: 'market',
            icon: BarChart3
        },
        {
            id: 3,
            title: 'SEBI',
            description: 'Securities and Exchange Board of India - Market regulator and investor protection',
            url: 'https://www.sebi.gov.in',
            category: 'regulatory',
            icon: Shield
        },
        {
            id: 4,
            title: 'MoneyControl',
            description: 'India\'s leading financial information source - News, analysis, and portfolio tools',
            url: 'https://www.moneycontrol.com',
            category: 'research',
            icon: Globe
        },
        {
            id: 5,
            title: 'Economic Times Markets',
            description: 'Economic Times Markets - Latest stock market news, analysis, and live updates',
            url: 'https://economictimes.indiatimes.com/markets',
            category: 'research',
            icon: FileText
        },
        {
            id: 6,
            title: 'Investing.com India',
            description: 'Real-time quotes, charts, and financial tools for Indian markets',
            url: 'https://in.investing.com',
            category: 'tools',
            icon: BarChart3
        },
        {
            id: 7,
            title: 'TradingView',
            description: 'Advanced charting platform with technical analysis tools',
            url: 'https://www.tradingview.com',
            category: 'tools',
            icon: BarChart3
        },
        {
            id: 8,
            title: 'Varsity by Zerodha',
            description: 'Free stock market education and trading tutorials',
            url: 'https://zerodha.com/varsity',
            category: 'education',
            icon: BookOpen
        },
        {
            id: 9,
            title: 'Screener.in',
            description: 'Stock screening and fundamental analysis tool for Indian stocks',
            url: 'https://www.screener.in',
            category: 'tools',
            icon: BarChart3
        },
        {
            id: 10,
            title: 'RBI',
            description: 'Reserve Bank of India - Monetary policy, economic data, and banking regulations',
            url: 'https://www.rbi.org.in',
            category: 'regulatory',
            icon: Shield
        }
    ];

    const categories = [
        { key: 'all', label: 'All Links', color: 'blue' },
        { key: 'market', label: 'Market Data', color: 'green' },
        { key: 'regulatory', label: 'Regulatory', color: 'red' },
        { key: 'research', label: 'Research', color: 'purple' },
        { key: 'tools', label: 'Tools', color: 'orange' },
        { key: 'education', label: 'Education', color: 'indigo' }
    ];

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'market': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'regulatory': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'research': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            case 'tools': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
            case 'education': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <LinkIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Important Links</h1>
                            <p className="text-slate-500 dark:text-slate-400">Quick access to essential trading resources</p>
                        </div>
                    </div>
                </div>

                {/* Categories Legend */}
                <div className="mb-6 flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <span
                            key={cat.key}
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${cat.key === 'all'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                : getCategoryColor(cat.key)}`}
                        >
                            {cat.label}
                        </span>
                    ))}
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {links.map((link) => {
                        const Icon = link.icon;
                        return (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-lg ${getCategoryColor(link.category)}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                                    {link.title}
                                </h3>

                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                    {link.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${getCategoryColor(link.category)}`}>
                                        {link.category}
                                    </span>
                                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
                                        Visit →
                                    </span>
                                </div>
                            </a>
                        );
                    })}
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">External Resources</h4>
                            <p className="text-sm text-purple-800 dark:text-purple-400">
                                These are external links to trusted financial platforms and resources. All links open in a new tab for your convenience.
                                Always verify the URL before entering any sensitive information.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* AdSense Display Ad */}
            <DisplayAd adSlot="1234567906" className="mt-6" />
        </div>
    );
}
