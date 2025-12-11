import { useState, useEffect } from 'react';
import { TrendingUp, Award, Flame, Zap } from 'lucide-react';

interface WelcomeHeroProps {
    userName?: string;
}

export default function WelcomeHero({ userName = 'Trader' }: WelcomeHeroProps) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000); // Update every second
        return () => clearInterval(timer);
    }, []);

    // Time-based greeting
    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return { text: 'Good Morning', emoji: '🌅', gradient: 'from-orange-400 to-pink-500' };
        if (hour < 17) return { text: 'Good Afternoon', emoji: '☀️', gradient: 'from-blue-400 to-cyan-500' };
        return { text: 'Good Evening', emoji: '🌙', gradient: 'from-indigo-500 to-purple-600' };
    };

    const greeting = getGreeting();

    // Format time for IST (already in IST since running in India)
    const istTime = currentTime.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
    });

    // Format time for EST
    const estTime = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'America/New_York'
    });

    // Mock data - in real app, fetch from user profile/API
    const userStats = {
        tradingStreak: 15, // Days
        level: 4,
        levelProgress: 65, // Percentage to next level
        todaysPnL: 2450.50,
        todaysPnLPercent: 1.8,
        marketStatus: 'Open', // Open, Closed, Pre-Market
        niftyChange: 0.34,
        activePositions: 3
    };

    const getLevelTitle = (level: number) => {
        if (level <= 2) return 'Novice Trader';
        if (level <= 5) return 'Active Trader';
        if (level <= 8) return 'Expert Trader';
        return 'Master Trader';
    };

    return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${greeting.gradient} p-8 text-white shadow-2xl mb-6`}>
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 20px 20px, white 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Greeting Section */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-4xl">{greeting.emoji}</span>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold flex flex-wrap items-center gap-2">
                                    <span>{greeting.text}, {userName}!</span>
                                    <div className="flex items-center gap-2 text-base md:text-lg font-medium bg-white/20 px-3 py-1 rounded-full">
                                        <span className="flex items-center gap-1">
                                            🇮🇳 <span className="font-mono">{istTime}</span>
                                        </span>
                                        <span className="opacity-60">|</span>
                                        <span className="flex items-center gap-1">
                                            🇺🇸 <span className="font-mono">{estTime}</span>
                                        </span>
                                    </div>
                                </h1>
                                <p className="text-white/90 text-sm mt-1">
                                    {userStats.marketStatus === 'Open' ? (
                                        <>
                                            Markets are <span className="font-semibold">LIVE</span> • NIFTY{' '}
                                            <span className={userStats.niftyChange >= 0 ? 'text-green-300' : 'text-red-300'}>
                                                {userStats.niftyChange > 0 ? '+' : ''}{userStats.niftyChange}%
                                            </span>
                                        </>
                                    ) : (
                                        'Markets are closed • See you tomorrow!'
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Today's Performance */}
                        {userStats.todaysPnL !== 0 && (
                            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                <TrendingUp className={`w-4 h-4 ${userStats.todaysPnL >= 0 ? 'text-green-300' : 'text-red-300'}`} />
                                <span className="font-semibold">
                                    Today: {userStats.todaysPnL >= 0 ? '+' : ''}₹{Math.abs(userStats.todaysPnL).toLocaleString()}
                                </span>
                                <span className={`text-sm ${userStats.todaysPnL >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                                    ({userStats.todaysPnLPercent >= 0 ? '+' : ''}{userStats.todaysPnLPercent}%)
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Stats Cards */}
                    <div className="flex gap-4">
                        {/* Trading Streak */}
                        <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 min-w-[120px] border border-white/30">
                            <div className="flex items-center gap-2 mb-2">
                                <Flame className="w-5 h-5 text-orange-300" />
                                <span className="text-sm font-medium text-white/90">Streak</span>
                            </div>
                            <div className="text-3xl font-bold">{userStats.tradingStreak}</div>
                            <div className="text-xs text-white/80">days active</div>
                        </div>

                        {/* Level Progress */}
                        <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 min-w-[140px] border border-white/30">
                            <div className="flex items-center gap-2 mb-2">
                                <Award className="w-5 h-5 text-yellow-300" />
                                <span className="text-sm font-medium text-white/90">Level {userStats.level}</span>
                            </div>
                            <div className="text-sm font-semibold mb-2">{getLevelTitle(userStats.level)}</div>
                            {/* Progress bar */}
                            <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-yellow-300 to-yellow-500 h-full transition-all duration-500 rounded-full"
                                    style={{ width: `${userStats.levelProgress}%` }}
                                ></div>
                            </div>
                            <div className="text-xs text-white/80 mt-1">{userStats.levelProgress}% to Level {userStats.level + 1}</div>
                        </div>

                        {/* Active Positions */}
                        {userStats.activePositions > 0 && (
                            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 min-w-[100px] border border-white/30">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="w-5 h-5 text-cyan-300" />
                                    <span className="text-sm font-medium text-white/90">Active</span>
                                </div>
                                <div className="text-3xl font-bold">{userStats.activePositions}</div>
                                <div className="text-xs text-white/80">positions</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
        </div>
    );
}
