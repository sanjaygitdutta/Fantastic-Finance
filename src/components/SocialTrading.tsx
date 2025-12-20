import { useState } from 'react';
import { Users, TrendingUp, Star, MessageSquare, Share2, Award, Zap, BarChart3, Target } from 'lucide-react';
import AdSlot from './AdSlot';

interface Trader {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    totalReturn: number;
    winRate: number;
    followers: number;
    tradesCount: number;
    sharpeRatio: number;
    specialty: string;
    bio: string;
}

const topTraders: Trader[] = [
    {
        id: '1',
        name: 'Rakesh Kumar',
        avatar: '👨‍💼',
        verified: true,
        totalReturn: 145.3,
        winRate: 72.5,
        followers: 15420,
        tradesCount: 387,
        sharpeRatio: 2.4,
        specialty: 'Options Trading',
        bio: 'Professional options trader with 10+ years experience in NIFTY derivatives'
    },
    {
        id: '2',
        name: 'Priya Sharma',
        avatar: '👩‍💼',
        verified: true,
        totalReturn: 132.8,
        winRate: 68.2,
        followers: 12350,
        tradesCount: 542,
        sharpeRatio: 2.1,
        specialty: 'Swing Trading',
        bio: 'Swing trader focusing on large-cap stocks and breakout strategies'
    },
    {
        id: '3',
        name: 'Amit Patel',
        avatar: '🧑‍💻',
        verified: true,
        totalReturn: 118.5,
        winRate: 65.8,
        followers: 9840,
        tradesCount: 298,
        sharpeRatio: 1.9,
        specialty: 'Day Trading',
        bio: 'Intraday momentum trader specializing in BANKNIFTY futures'
    },
    {
        id: '4',
        name: 'Sneha Reddy',
        avatar: '👩‍🎓',
        verified: false,
        totalReturn: 95.2,
        winRate: 61.4,
        followers: 5620,
        tradesCount: 176,
        sharpeRatio: 1.6,
        specialty: 'Value Investing',
        bio: 'Long-term value investor with focus on fundamentally strong stocks'
    }
];

const recentTrades = [
    { trader: 'Rakesh Kumar', symbol: 'NSE:RELIANCE', action: 'BUY', quantity: 50, price: 2980, time: '2 hours ago' },
    { trader: 'Priya Sharma', symbol: 'NSE:TCS', action: 'SELL', quantity: 25, price: 4125, time: '3 hours ago' },
    { trader: 'Amit Patel', symbol: 'NSE:HDFCBANK', action: 'BUY', quantity: 100, price: 1650, time: '4 hours ago' }
];

export default function SocialTrading() {
    const [following, setFollowing] = useState<string[]>(['1']);
    const [autoCopyEnabled, setAutoCopyEnabled] = useState<{ [key: string]: boolean }>({ '1': true });

    const toggleFollow = (traderId: string) => {
        if (following.includes(traderId)) {
            setFollowing(following.filter(id => id !== traderId));
            setAutoCopyEnabled(prev => {
                const newState = { ...prev };
                delete newState[traderId];
                return newState;
            });
        } else {
            setFollowing([...following, traderId]);
        }
    };

    const toggleAutoCopy = (traderId: string) => {
        setAutoCopyEnabled(prev => ({
            ...prev,
            [traderId]: !prev[traderId]
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 rounded-3xl text-white shadow-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <Users className="w-8 h-8" />
                            Social Trading
                        </h1>
                        <p className="text-purple-100 mb-4">Follow and copy strategies from top-performing traders</p>
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                                <p className="text-xs text-purple-100 mb-1">Following</p>
                                <p className="text-2xl font-bold">{following.length}</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                                <p className="text-xs text-purple-100 mb-1">Auto-Copy Active</p>
                                <p className="text-2xl font-bold">{Object.values(autoCopyEnabled).filter(Boolean).length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:block">
                        <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <Copy className="w-16 h-16" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Traders */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h2 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
                            <Award className="w-6 h-6 text-yellow-600" />
                            Top Traders This Month
                        </h2>
                        <div className="space-y-4">
                            {topTraders.map((trader, idx) => (
                                <div key={trader.id} className="p-5 rounded-xl border-2 border-slate-200 hover:border-purple-300 transition-all hover:shadow-md">
                                    <div className="flex items-start gap-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl">
                                                {trader.avatar}
                                            </div>
                                            {trader.verified && (
                                                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                                                    <Star className="w-3 h-3 text-white fill-current" />
                                                </div>
                                            )}
                                            {idx < 3 && (
                                                <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${idx === 0 ? 'bg-yellow-400 text-yellow-900' :
                                                    idx === 1 ? 'bg-slate-300 text-slate-700' :
                                                        'bg-orange-400 text-orange-900'
                                                    }`}>
                                                    #{idx + 1}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                                        {trader.name}
                                                        {trader.verified && <span className="text-blue-500">✓</span>}
                                                    </h3>
                                                    <p className="text-sm text-slate-500">{trader.specialty}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-green-600">+{trader.totalReturn}%</p>
                                                    <p className="text-xs text-slate-500">Total Return</p>
                                                </div>
                                            </div>

                                            <p className="text-sm text-slate-600 mb-3">{trader.bio}</p>

                                            <div className="grid grid-cols-4 gap-3 mb-3">
                                                <div className="text-center p-2 bg-slate-50 rounded-lg">
                                                    <p className="text-xs text-slate-500">Win Rate</p>
                                                    <p className="font-bold text-sm text-slate-800">{trader.winRate}%</p>
                                                </div>
                                                <div className="text-center p-2 bg-slate-50 rounded-lg">
                                                    <p className="text-xs text-slate-500">Followers</p>
                                                    <p className="font-bold text-sm text-slate-800">{(trader.followers / 1000).toFixed(1)}K</p>
                                                </div>
                                                <div className="text-center p-2 bg-slate-50 rounded-lg">
                                                    <p className="text-xs text-slate-500">Trades</p>
                                                    <p className="font-bold text-sm text-slate-800">{trader.tradesCount}</p>
                                                </div>
                                                <div className="text-center p-2 bg-slate-50 rounded-lg">
                                                    <p className="text-xs text-slate-500">Sharpe</p>
                                                    <p className="font-bold text-sm text-slate-800">{trader.sharpeRatio}</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => toggleFollow(trader.id)}
                                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${following.includes(trader.id)
                                                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                                        : 'bg-purple-600 text-white hover:bg-purple-700'
                                                        }`}
                                                >
                                                    {following.includes(trader.id) ? (
                                                        <>
                                                            <UserPlus className="w-4 h-4" /> Following
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserPlus className="w-4 h-4" /> Follow
                                                        </>
                                                    )}
                                                </button>

                                                {following.includes(trader.id) && (
                                                    <button
                                                        onClick={() => toggleAutoCopy(trader.id)}
                                                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${autoCopyEnabled[trader.id]
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                            }`}
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                        {autoCopyEnabled[trader.id] ? 'Auto-Copy ON' : 'Auto-Copy OFF'}
                                                    </button>
                                                )}

                                                <button className="px-4 py-2 border-2 border-slate-200 rounded-lg text-slate-600 hover:border-purple-300 hover:text-purple-600 transition font-medium flex items-center gap-2">
                                                    <Eye className="w-4 h-4" /> Profile
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                            Recent Trades
                        </h3>
                        <div className="space-y-3">
                            {recentTrades.map((trade, idx) => (
                                <div key={idx} className="p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-medium text-sm text-slate-800">{trade.trader}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${trade.action === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {trade.action}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-1">{trade.symbol}</p>
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>{trade.quantity} @ ₹{trade.price}</span>
                                        <span>{trade.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-2xl text-white shadow-lg">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Your Social Stats
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center pb-3 border-b border-white/20">
                                <span className="text-blue-100 text-sm">Copied Trades</span>
                                <span className="font-bold text-lg">24</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-white/20">
                                <span className="text-blue-100 text-sm">Avg Return on Copies</span>
                                <span className="font-bold text-lg text-green-300">+12.5%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-blue-100 text-sm">Success Rate</span>
                                <span className="font-bold text-lg">68%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* AdSense Display Ad */}
            <AdSlot slot="social-trading-bottom" format="horizontal" className="mt-8" />
        </div>
    );
}
