import { BookOpen, ExternalLink, Play, CheckCircle, Award, TrendingUp, Target, Download } from 'lucide-react';
import { useState } from 'react';

export default function Learning() {
    const [completedModules, setCompletedModules] = useState<string[]>([]);

    // Zerodha Varsity Modules (Real chapters from Varsity)
    const varsityModules = [
        {
            id: 'intro-stock-markets',
            title: 'Introduction to Stock Markets',
            chapters: 15,
            duration: '3-4 hours',
            level: 'Beginner',
            url: 'https://zerodha.com/varsity/module/introduction-to-stock-markets/',
            description: 'Learn the basics of stock markets, IPOs, and how exchanges work',
            color: 'blue'
        },
        {
            id: 'technical-analysis',
            title: 'Technical Analysis',
            chapters: 24,
            duration: '8-10 hours',
            level: 'Intermediate',
            url: 'https://zerodha.com/varsity/module/technical-analysis/',
            description: 'Master candlesticks, charts, indicators like RSI, MACD, and patterns',
            color: 'purple'
        },
        {
            id: 'fundamental-analysis',
            title: 'Fundamental Analysis',
            chapters: 18,
            duration: '6-8 hours',
            level: 'Intermediate',
            url: 'https://zerodha.com/varsity/module/fundamental-analysis/',
            description: 'Understand P/E ratios, balance sheets, cash flows, and valuations',
            color: 'green'
        },
        {
            id: 'futures-trading',
            title: 'Futures Trading',
            chapters: 12,
            duration: '4-5 hours',
            level: 'Advanced',
            url: 'https://zerodha.com/varsity/module/futures-trading/',
            description: 'Deep dive into futures contracts, margins, and hedging strategies',
            color: 'orange'
        },
        {
            id: 'options-theory',
            title: 'Options Theory for Professional Trading',
            chapters: 20,
            duration: '10-12 hours',
            level: 'Advanced',
            url: 'https://zerodha.com/varsity/module/option-theory/',
            description: 'Comprehensive guide to options - Greeks, strategies, and risk management',
            color: 'red'
        },
        {
            id: 'option-strategies',
            title: 'Option Strategies',
            chapters: 14,
            duration: '6-7 hours',
            level: 'Advanced',
            url: 'https://zerodha.com/varsity/module/option-strategies/',
            description: 'Bull spreads, Bear spreads, Iron Condor, Straddles, and more',
            color: 'pink'
        },
        {
            id: 'markets-macro',
            title: 'Markets and Taxation',
            chapters: 10,
            duration: '3-4 hours',
            level: 'Intermediate',
            url: 'https://zerodha.com/varsity/module/markets-and-taxation/',
            description: 'Tax implications of trading, LTCG, STCG, and compliance',
            color: 'yellow'
        },
        {
            id: 'currency-commodity',
            title: 'Currency, Commodity & Govt Securities',
            chapters: 12,
            duration: '5-6 hours',
            level: 'Advanced',
            url: 'https://zerodha.com/varsity/module/currency-commodity-and-government-securities/',
            description: 'Trading in forex, gold, silver, and government bonds',
            color: 'indigo'
        }
    ];

    const quickLinks = [
        { name: 'Trading Q&A', url: 'https://tradingqna.com/', icon: BookOpen },
        { name: 'Market Depths (Blog)', url: 'https://zerodha.com/z-connect/category/market-depths', icon: TrendingUp },
        { name: 'Varsity Mobile App', url: 'https://play.google.com/store/apps/details?id=com.zerodha.varsity', icon: Download }
    ];

    const toggleModule = (id: string) => {
        if (completedModules.includes(id)) {
            setCompletedModules(completedModules.filter(m => m !== id));
        } else {
            setCompletedModules([...completedModules, id]);
        }
    };

    const getColorClasses = (color: string) => {
        const colors: any = {
            blue: 'from-blue-500 to-blue-600',
            purple: 'from-purple-500 to-purple-600',
            green: 'from-green-500 to-green-600',
            orange: 'from-orange-500 to-orange-600',
            red: 'from-red-500 to-red-600',
            pink: 'from-pink-500 to-pink-600',
            yellow: 'from-yellow-500 to-yellow-600',
            indigo: 'from-indigo-500 to-indigo-600'
        };
        return colors[color] || 'from-blue-500 to-blue-600';
    };

    const progressPercentage = (completedModules.length / varsityModules.length) * 100;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl text-white shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Trading Academy</h1>
                        <p className="text-blue-100 mb-4">Powered by Zerodha Varsity - India's largest free stock market education platform</p>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://zerodha.com/varsity/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg"
                            >
                                Visit Zerodha Varsity <ExternalLink className="w-4 h-4" />
                            </a>
                            <a
                                href="https://zerodha.com/varsity/download/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/20 transition"
                            >
                                <Download className="w-4 h-4" /> Download PDFs
                            </a>
                        </div>
                    </div>
                    <div className="hidden lg:block">
                        <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <BookOpen className="w-16 h-16" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Tracker */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Award className="w-5 h-5 text-yellow-500" />
                            Your Learning Progress
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            {completedModules.length} of {varsityModules.length} modules completed
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-blue-600">{progressPercentage.toFixed(0)}%</p>
                    </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Varsity Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {varsityModules.map((module) => {
                    const isCompleted = completedModules.includes(module.id);
                    return (
                        <div
                            key={module.id}
                            className={`bg-white rounded-2xl border-2 overflow-hidden shadow-sm hover:shadow-lg transition-all ${isCompleted ? 'border-green-500' : 'border-slate-200 hover:border-blue-500'
                                }`}
                        >
                            {/* Module Header */}
                            <div className={`bg-gradient-to-r ${getColorClasses(module.color)} p-6 text-white relative`}>
                                {isCompleted && (
                                    <div className="absolute top-3 right-3 bg-green-500 rounded-full p-1">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                )}
                                <h3 className="font-bold text-xl mb-2">{module.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-white/90">
                                    <span className="flex items-center gap-1">
                                        <BookOpen className="w-4 h-4" /> {module.chapters} Chapters
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Play className="w-4 h-4" /> {module.duration}
                                    </span>
                                </div>
                            </div>

                            {/* Module Body */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${module.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                                            module.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {module.level}
                                    </span>
                                </div>
                                <p className="text-slate-600 text-sm mb-4">{module.description}</p>

                                <div className="flex gap-3">
                                    <a
                                        href={module.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                                    >
                                        Start Learning <ExternalLink className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={() => toggleModule(module.id)}
                                        className={`px-4 py-2.5 rounded-lg font-medium text-sm transition ${isCompleted
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {isCompleted ? 'Completed' : 'Mark Done'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Links */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Additional Resources
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition group"
                        >
                            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-600 transition">
                                <link.icon className="w-5 h-5 text-blue-600 group-hover:text-white transition" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-slate-800 group-hover:text-blue-600 transition">{link.name}</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                        </a>
                    ))}
                </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Zerodha Varsity is an external educational platform. All content belongs to Zerodha.
                    We're simply linking to their excellent free resources for your convenience.
                </p>
            </div>
        </div>
    );
}
