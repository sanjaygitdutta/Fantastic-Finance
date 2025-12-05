import { Trophy, Medal, Star, Flame, Award, Target, TrendingUp, Zap } from 'lucide-react';

interface Badge {
    id: string;
    name: string;
    description: string;
    icon: any;
    earned: boolean;
    progress?: number;
    maxProgress?: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    gradient: string;
}

interface LeaderboardEntry {
    rank: number;
    name: string;
    points: number;
    level: number;
    avatar: string;
}

export default function AchievementBadges() {
    // Mock user achievements
    const badges: Badge[] = [
        {
            id: '1',
            name: 'First Trade',
            description: 'Complete your first trade',
            icon: Star,
            earned: true,
            rarity: 'common',
            gradient: 'from-gray-400 to-gray-600'
        },
        {
            id: '2',
            name: 'Profit Maker',
            description: 'Make ₹10,000 in profit',
            icon: TrendingUp,
            earned: true,
            rarity: 'rare',
            gradient: 'from-blue-400 to-blue-600'
        },
        {
            id: '3',
            name: 'Risk Manager',
            description: 'Close 10 positions with stop loss',
            icon: Target,
            earned: true,
            progress: 10,
            maxProgress: 10,
            rarity: 'rare',
            gradient: 'from-green-400 to-green-600'
        },
        {
            id: '4',
            name: 'Streak Master',
            description: '30 days trading streak',
            icon: Flame,
            earned: false,
            progress: 15,
            maxProgress: 30,
            rarity: 'epic',
            gradient: 'from-orange-400 to-red-600'
        },
        {
            id: '5',
            name: 'Strategy Expert',
            description: 'Deploy 50 strategies',
            icon: Zap,
            earned: false,
            progress: 27,
            maxProgress: 50,
            rarity: 'epic',
            gradient: 'from-purple-400 to-purple-600'
        },
        {
            id: '6',
            name: 'Market Legend',
            description: 'Reach Level 10',
            icon: Trophy,
            earned: false,
            progress: 4,
            maxProgress: 10,
            rarity: 'legendary',
            gradient: 'from-yellow-400 to-orange-500'
        }
    ];

    // Mock leaderboard
    const leaderboard: LeaderboardEntry[] = [
        { rank: 1, name: 'TradeMaster', points: 15420, level: 8, avatar: '👑' },
        { rank: 2, name: 'OptionGuru', points: 12850, level: 7, avatar: '🎯' },
        { rank: 3, name: 'BullRunner', points: 10230, level: 7, avatar: '🐂' },
        { rank: 4, name: 'You', points: 8540, level: 4, avatar: '⭐' },
        { rank: 5, name: 'StrikeKing', points: 7650, level: 6, avatar: '👊' }
    ];

    const getRarityStyle = (rarity: string) => {
        switch (rarity) {
            case 'legendary': return 'ring-2 ring-yellow-400 shadow-yellow-400/50';
            case 'epic': return 'ring-2 ring-purple-400 shadow-purple-400/50';
            case 'rare': return 'ring-2 ring-blue-400 shadow-blue-400/50';
            default: return 'ring-1 ring-gray-300';
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg">
                    <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Achievements</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {badges.filter(b => b.earned).length}/{badges.length} unlocked
                    </p>
                </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {badges.map((badge) => {
                    const Icon = badge.icon;
                    return (
                        <div
                            key={badge.id}
                            className={`relative group cursor-pointer transition-all duration-300 ${badge.earned ? 'hover:scale-105' : 'opacity-60 grayscale hover:grayscale-0 hover:opacity-80'
                                }`}
                        >
                            <div
                                className={`p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-700/30 border-2 ${badge.earned ? getRarityStyle(badge.rarity) + ' shadow-lg' : 'border-slate-200 dark:border-slate-600'
                                    }`}
                            >
                                {/* Icon */}
                                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${badge.gradient} mb-3 ${badge.earned ? 'animate-pulse-slow' : ''
                                    }`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>

                                {/* Badge Name */}
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                                    {badge.name}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                    {badge.description}
                                </p>

                                {/* Progress Bar (if not earned) */}
                                {!badge.earned && badge.progress !== undefined && badge.maxProgress !== undefined && (
                                    <div className="mt-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-slate-600 dark:text-slate-400">
                                                {badge.progress}/{badge.maxProgress}
                                            </span>
                                            <span className="text-xs font-semibold text-blue-600">
                                                {Math.round((badge.progress / badge.maxProgress) * 100)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1.5">
                                            <div
                                                className={`bg-gradient-to-r ${badge.gradient} h-1.5 rounded-full transition-all duration-500`}
                                                style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Earned checkmark */}
                                {badge.earned && (
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Leaderboard */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                    <Medal className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-slate-900 dark:text-white">Top Traders</h4>
                </div>

                <div className="space-y-2">
                    {leaderboard.map((entry) => {
                        const isCurrentUser = entry.name === 'You';
                        return (
                            <div
                                key={entry.rank}
                                className={`flex items-center gap-4 p-3 rounded-lg transition-all ${isCurrentUser
                                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 ring-2 ring-blue-300 dark:ring-blue-600'
                                        : 'bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                            >
                                {/* Rank */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${entry.rank === 1
                                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                                        : entry.rank === 2
                                            ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white'
                                            : entry.rank === 3
                                                ? 'bg-gradient-to-br from-orange-300 to-orange-600 text-white'
                                                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                                    }`}>
                                    {entry.rank}
                                </div>

                                {/* Avatar */}
                                <div className="text-2xl">{entry.avatar}</div>

                                {/* Name & Level */}
                                <div className="flex-1">
                                    <div className={`font-semibold ${isCurrentUser ? 'text-blue-700 dark:text-blue-300' : 'text-slate-900 dark:text-white'}`}>
                                        {entry.name}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Level {entry.level}</div>
                                </div>

                                {/* Points */}
                                <div className="text-right">
                                    <div className="font-bold text-slate-900 dark:text-white">
                                        {entry.points.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">points</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button className="mt-4 w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium text-sm hover:from-blue-700 hover:to-purple-700 transition">
                    View Full Leaderboard
                </button>
            </div>
        </div>
    );
}
