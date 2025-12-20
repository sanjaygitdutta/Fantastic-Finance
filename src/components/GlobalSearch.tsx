import { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
    name: string;
    path: string;
    description: string;
    category: string;
    keywords: string[];
}

const searchDatabase: SearchResult[] = [
    // Markets (7)
    { name: 'Dashboard', path: '/dashboard', description: 'Overview of your portfolio and market data', category: 'Markets', keywords: ['home', 'overview', 'stats', 'portfolio'] },
    { name: 'Markets', path: '/markets', description: 'Live market data and indices', category: 'Markets', keywords: ['stocks', 'nifty', 'sensex', 'indices'] },
    { name: 'Wall Street', path: '/wallstreet', description: 'US stock market and global indices', category: 'Markets', keywords: ['us', 'dow', 'nasdaq', 's&p', 'international'] },
    { name: 'News', path: '/news', description: 'Latest financial news and updates', category: 'Markets', keywords: ['newsroom', 'articles', 'updates', 'headlines'] },
    { name: 'IPO', path: '/ipo', description: 'Initial Public Offerings tracker', category: 'Markets', keywords: ['upcoming', 'current', 'public offerings'] },
    { name: 'Calendar', path: '/calendar', description: 'Economic calendar and events', category: 'Markets', keywords: ['events', 'economic', 'schedule', 'earnings'] },
    { name: 'Crypto Market', path: '/crypto', description: 'Cryptocurrency market data', category: 'Markets', keywords: ['bitcoin', 'ethereum', 'altcoins', 'crypto'] },

    // Analysis (8)
    { name: 'Analytics', path: '/analytics', description: 'Advanced market analytics and charts', category: 'Analysis', keywords: ['charts', 'graphs', 'data', 'analysis'] },
    { name: 'Technical Analysis', path: '/technical', description: 'Technical indicators and patterns', category: 'Analysis', keywords: ['indicators', 'patterns', 'ta', 'signals'] },
    { name: 'Option Chain', path: '/options', description: 'Live options chain analysis', category: 'Analysis', keywords: ['options', 'calls', 'puts', 'greeks'] },
    { name: 'IV Analysis', path: '/iv-analysis', description: 'Implied Volatility analysis tools', category: 'Analysis', keywords: ['volatility', 'iv', 'skew'] },
    { name: 'Advanced Charts', path: '/charts', description: 'Advanced charting with TradingView', category: 'Analysis', keywords: ['tradingview', 'charts', 'technical'] },
    { name: 'Straddle Chart', path: '/straddle', description: 'Options straddle visualization', category: 'Analysis', keywords: ['options', 'straddle', 'strategy'] },
    { name: 'Options Scanner', path: '/scanner', description: 'Scan market for options opportunities', category: 'Analysis', keywords: ['scanner', 'screener', 'opportunities'] },
    { name: 'Strategy Screener', path: '/strategy-screener', description: 'Screen and backtest strategies', category: 'Analysis', keywords: ['backtest', 'screen', 'strategies'] },

    // Trading (4)
    { name: 'Strategy Builder', path: '/strategy', description: 'Build custom options strategies', category: 'Trading', keywords: ['builder', 'options', 'payoff', 'strategies'] },
    { name: 'Strategy Wizard', path: '/wizard', description: 'Guided strategy creation', category: 'Trading', keywords: ['wizard', 'guided', 'templates'] },
    { name: 'Portfolio', path: '/portfolio', description: 'Your paper trading portfolio', category: 'Trading', keywords: ['positions', 'holdings', 'pnl', 'paper'] },
    { name: 'Watchlist', path: '/watchlist', description: 'Track your favorite stocks', category: 'Trading', keywords: ['favorites', 'watch', 'track', 'monitor'] },

    // Niche Markets (4)
    { name: 'Currency', path: '/currency', description: 'Forex and currency markets', category: 'Niche Markets', keywords: ['forex', 'fx', 'currency', 'exchange'] },
    { name: 'Commodity', path: '/commodity', description: 'Commodity markets and prices', category: 'Niche Markets', keywords: ['gold', 'silver', 'crude', 'commodities'] },
    { name: 'Bonds', path: '/bond', description: 'Government and corporate bonds', category: 'Niche Markets', keywords: ['bonds', 'fixed income', 'yields', 'debt'] },
    { name: 'ETFs', path: '/etf', description: 'Exchange Traded Funds tracker', category: 'Niche Markets', keywords: ['etf', 'funds', 'index'] },

    // Tools (7)
    { name: 'Calculator Hub', path: '/calculators', description: 'Financial calculators collection', category: 'Tools', keywords: ['calc', 'calculate', 'tools'] },
    { name: 'Black-Scholes Calculator', path: '/black-scholes', description: 'Options pricing calculator', category: 'Tools', keywords: ['black scholes', 'pricing', 'greeks', 'calculator'] },
    { name: 'Margin Calculator', path: '/margin-calculator', description: 'Calculate trading margins', category: 'Tools', keywords: ['margin', 'leverage', 'requirements'] },
    { name: 'Stock Screener', path: '/screener', description: 'Screen stocks by criteria', category: 'Tools', keywords: ['screener', 'filter', 'fundamentals'] },
    { name: 'Daily Quiz', path: '/daily-quiz', description: 'Test your trading knowledge', category: 'Tools', keywords: ['quiz', 'test', 'learning', 'knowledge'] },
    { name: 'Important Links', path: '/links', description: 'Essential trading resources', category: 'Tools', keywords: ['links', 'resources', 'websites', 'tools'] },
    { name: 'Alerts Center', path: '/alerts', description: 'Manage price alerts', category: 'Tools', keywords: ['alerts', 'notifications', 'price'] },

    // Community (3)
    { name: 'Community', path: '/community', description: 'Trading community and discussions', category: 'Community', keywords: ['forum', 'chat', 'social', 'traders'] },
    { name: 'Academy', path: '/academy', description: 'Learn trading and investing', category: 'Community', keywords: ['learn', 'courses', 'education', 'tutorials'] },
    { name: 'Brokers Review', path: '/brokers', description: 'Compare brokers and platforms', category: 'Community', keywords: ['brokers', 'comparison', 'reviews', 'platforms'] },

    // Account (2)
    { name: 'Profile', path: '/profile', description: 'Your account settings', category: 'Account', keywords: ['account', 'user', 'settings', 'preferences'] },
    { name: 'Settings', path: '/settings', description: 'Application preferences', category: 'Account', keywords: ['config', 'preferences', 'theme'] }
];

interface GlobalSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setSearchQuery('');
            setResults([]);
            setSelectedIndex(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = searchDatabase.filter(item => {
            const matchName = item.name.toLowerCase().includes(query);
            const matchDesc = item.description.toLowerCase().includes(query);
            const matchKeywords = item.keywords.some(k => k.toLowerCase().includes(query));
            const matchCategory = item.category.toLowerCase().includes(query);

            return matchName || matchDesc || matchKeywords || matchCategory;
        });

        setResults(filtered.slice(0, 10));
        setSelectedIndex(0);
    }, [searchQuery]);

    const handleNavigate = (path: string) => {
        navigate(path);
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            handleNavigate(results[selectedIndex].path);
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            'Markets': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            'Analysis': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
            'Trading': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            'Niche Markets': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
            'Tools': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
            'Community': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
            'Account': 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
        };
        return colors[category] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            {/* Search Modal */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-700">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search pages, tools, and features..."
                        className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 outline-none text-lg"
                    />
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto">
                    {results.length === 0 && searchQuery && (
                        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>No results found for "{searchQuery}"</p>
                        </div>
                    )}

                    {results.length === 0 && !searchQuery && (
                        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">Start typing to search across all pages...</p>
                            <p className="text-xs mt-2 opacity-70">Press <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">Ctrl+K</kbd> to open</p>
                        </div>
                    )}

                    {results.map((result, index) => (
                        <button
                            key={result.path}
                            onClick={() => handleNavigate(result.path)}
                            className={`w-full text-left p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition ${index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-slate-900 dark:text-white">{result.name}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryColor(result.category)}`}>
                                            {result.category}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{result.description}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer Hint */}
                {results.length > 0 && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                        <span>Use ↑↓ to navigate, Enter to select</span>
                        <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
