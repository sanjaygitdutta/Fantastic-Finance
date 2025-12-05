import { useState } from 'react';
import { Trophy, Crown, Target, Zap, TrendingUp, ChevronRight, Award, Flame, Star, Lock, Play } from 'lucide-react';

export default function Gamification() {
    const [activeGame, setActiveGame] = useState<string | null>(null);
    const [userPoints, setUserPoints] = useState(15420);
    const [userRank, setUserRank] = useState(42);
    const [streak, setStreak] = useState(7);

    // Trading Games
    const games = [
        {
            id: 'price-prediction',
            name: 'Price Prediction Challenge',
            description: 'Predict if NIFTY will go up or down in the next 5 minutes',
            icon: TrendingUp,
            color: 'blue',
            points: 100,
            players: 2847,
            difficulty: 'Easy'
        },
        {
            id: 'speed-quiz',
            name: 'Speed Trading Quiz',
            description: 'Answer 10 trading questions as fast as you can',
            icon: Zap,
            color: 'yellow',
            points: 200,
            players: 1523,
            difficulty: 'Medium'
        },
        {
            id: 'pattern-master',
            name: 'Chart Pattern Master',
            description: 'Identify candlestick patterns from real charts',
            icon: Target,
            color: 'purple',
            points: 300,
            players: 892,
            difficulty: 'Hard'
        }
    ];

    // Leaderboard
    const leaderboard = [
        { rank: 1, name: 'TradeKing_88', points: 45280, avatar: '👑', streak: 28, badge: 'legend' },
        { rank: 2, name: 'BullRunner23', points: 42150, avatar: '🐂', streak: 21, badge: 'master' },
        { rank: 3, name: 'OptionGuru', points: 38920, avatar: '🎯', streak: 19, badge: 'master' },
        { rank: 4, name: 'NiftyNinja', points: 35640, avatar: '🥷', streak: 15, badge: 'expert' },
        { rank: 5, name: 'ChartWizard', points: 32100, avatar: '🧙', streak: 12, badge: 'expert' },
        { rank: 42, name: 'You', points: userPoints, avatar: '😎', streak: streak, badge: 'rising' }
    ];

    // Achievements/Badges
    const achievements = [
        {
            id: 1,
            name: 'First Win',
            description: 'Win your first game',
            icon: '🎯',
            unlocked: true,
            rarity: 'common',
            points: 50
        },
        {
            id: 2,
            name: 'Hot Streak',
            description: 'Win 7 days in a row',
            icon: '🔥',
            unlocked: true,
            rarity: 'rare',
            points: 500
        },
        {
            id: 3,
            name: 'Pattern Pro',
            description: 'Identify 50 chart patterns correctly',
            icon: '📊',
            unlocked: true,
            rarity: 'rare',
            points: 1000
        },
        {
            id: 4,
            name: 'Speed Demon',
            description: 'Complete quiz in under 30 seconds',
            icon: '⚡',
            unlocked: false,
            rarity: 'epic',
            points: 2000
        },
        {
            id: 5,
            name: 'Market Oracle',
            description: 'Predict price movement 20 times correctly',
            icon: '🔮',
            unlocked: false,
            rarity: 'epic',
            points: 3000
        },
        {
            id: 6,
            name: 'Diamond Hands',
            description: 'Maintain 30-day streak',
            icon: '💎',
            unlocked: false,
            rarity: 'legendary',
            points: 10000
        }
    ];

    // Mini Price Prediction Game (simplified)
    const [predictionGame, setPredictionGame] = useState({
        active: false,
        price: 22450,
        prediction: null as 'up' | 'down' | null,
        result: null as 'win' | 'loss' | null
    });

    const startPredictionGame = () => {
        setPredictionGame({
            active: true,
            price: 22450 + Math.floor(Math.random() * 200) - 100,
            prediction: null,
            result: null
        });
    };

    const makePrediction = (direction: 'up' | 'down') => {
        const newPrice = predictionGame.price + (Math.random() > 0.5 ? 50 : -50);
        const actualDirection = newPrice > predictionGame.price ? 'up' : 'down';
        const won = direction === actualDirection;

        setPredictionGame({
            ...predictionGame,
            prediction: direction,
            result: won ? 'win' : 'loss'
        });

        if (won) {
            setUserPoints(userPoints + 100);
        }
    };

    const getRarityColor = (rarity: string) => {
        const colors: any = {
            common: 'text-slate-600 bg-slate-100',
            rare: 'text-blue-600 bg-blue-100',
            epic: 'text-purple-600 bg-purple-100',
            legendary: 'text-yellow-600 bg-yellow-100'
        };
        return colors[rarity] || 'text-slate-600 bg-slate-100';
    };

    return (
        <div className="space-y-6">
            {/* Header with User Stats */}
            <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 p-8 rounded-3xl text-white shadow-2xl">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <Trophy className="w-8 h-8 text-yellow-300" />
                            Trading Arena
                        </h1>
                        <p className="text-purple-100 mb-6">Compete, earn points, unlock badges!</p>
                    </div>
                    <div className="text-right">
                        <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl">
                            <p className="text-sm text-purple-100 mb-1">Your Rank</p>
                            <p className="text-4xl font-bold">#{userRank}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-purple-100 text-sm">Total Points</span>
                            <Star className="w-5 h-5 text-yellow-300" />
                        </div>
                        <p className="text-3xl font-bold">{userPoints.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-purple-100 text-sm">Win Streak</span>
                            <Flame className="w-5 h-5 text-orange-400" />
                        </div>
                        <p className="text-3xl font-bold">{streak} Days</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-purple-100 text-sm">Achievements</span>
                            <Award className="w-5 h-5 text-green-400" />
                        </div>
                        <p className="text-3xl font-bold">{achievements.filter(a => a.unlocked).length}/{achievements.length}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Games */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Trading Games */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h2 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
                            <Play className="w-6 h-6 text-green-600" />
                            Trading Games
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {games.map((game) => (
                                <div
                                    key={game.id}
                                    onClick={() => setActiveGame(game.id)}
                                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${activeGame === game.id
                                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                                            : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-${game.color}-100 flex items-center justify-center mb-3`}>
                                        <game.icon className={`w-6 h-6 text-${game.color}-600`} />
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-2">{game.name}</h3>
                                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{game.description}</p>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                            +{game.points} pts
                                        </span>
                                        <span className="text-slate-400">{game.players} playing</span>
                                    </div>
                                    <div className="mt-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${game.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                                game.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {game.difficulty}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Game: Price Prediction */}
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg">
                        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                            <Target className="w-6 h-6" />
                            Quick Play: Price Prediction
                        </h3>

                        {!predictionGame.active ? (
                            <div className="text-center py-8">
                                <p className="text-green-100 mb-4">Predict NIFTY 50 movement and earn points!</p>
                                <button
                                    onClick={startPredictionGame}
                                    className="px-8 py-3 bg-white text-green-600 rounded-xl font-bold hover:bg-green-50 transition shadow-lg"
                                >
                                    Start Game
                                </button>
                            </div>
                        ) : predictionGame.result ? (
                            <div className="text-center py-8">
                                <div className={`text-6xl mb-4 ${predictionGame.result === 'win' ? '🎉' : '😢'}`}>
                                    {predictionGame.result === 'win' ? '🎉' : '😢'}
                                </div>
                                <h4 className="text-2xl font-bold mb-2">
                                    {predictionGame.result === 'win' ? 'You Won!' : 'Better Luck Next Time!'}
                                </h4>
                                <p className="text-green-100 mb-4">
                                    {predictionGame.result === 'win' ? '+100 points earned' : 'Keep practicing!'}
                                </p>
                                <button
                                    onClick={startPredictionGame}
                                    className="px-6 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition"
                                >
                                    Play Again
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl mb-4 text-center">
                                    <p className="text-sm text-green-100 mb-2">Current NIFTY Price</p>
                                    <p className="text-5xl font-bold">{predictionGame.price}</p>
                                </div>
                                <p className="text-center text-green-100 mb-4 font-medium">
                                    Will it go UP or DOWN in the next 5 minutes?
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => makePrediction('up')}
                                        className="py-4 bg-white text-green-600 rounded-xl font-bold hover:bg-green-50 transition shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <TrendingUp className="w-5 h-5" /> UP
                                    </button>
                                    <button
                                        onClick={() => makePrediction('down')}
                                        className="py-4 bg-white text-red-600 rounded-xl font-bold hover:bg-red-50 transition shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <TrendingUp className="w-5 h-5 rotate-180" /> DOWN
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Achievements */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h2 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
                            <Award className="w-6 h-6 text-yellow-600" />
                            Achievements & Badges
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {achievements.map((achievement) => (
                                <div
                                    key={achievement.id}
                                    className={`p-4 rounded-xl border-2 transition-all ${achievement.unlocked
                                            ? 'border-yellow-300 bg-yellow-50 shadow-md'
                                            : 'border-slate-200 bg-slate-50 opacity-60'
                                        }`}
                                >
                                    <div className="text-center mb-3">
                                        <div className="text-4xl mb-2 relative">
                                            {achievement.icon}
                                            {!achievement.unlocked && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Lock className="w-6 h-6 text-slate-400" />
                                                </div>
                                            )}
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getRarityColor(achievement.rarity)}`}>
                                            {achievement.rarity.toUpperCase()}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-sm text-slate-800 text-center mb-1">
                                        {achievement.name}
                                    </h4>
                                    <p className="text-xs text-slate-500 text-center mb-2 line-clamp-2">
                                        {achievement.description}
                                    </p>
                                    <div className="text-center">
                                        <span className="text-xs font-medium text-green-600">
                                            +{achievement.points} pts
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Leaderboard */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit sticky top-6">
                    <h2 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-600" />
                        Leaderboard
                    </h2>
                    <div className="space-y-3">
                        {leaderboard.map((player, idx) => (
                            <div
                                key={player.rank}
                                className={`flex items-center gap-4 p-3 rounded-xl transition-all ${player.name === 'You'
                                        ? 'bg-blue-50 border-2 border-blue-500 shadow-md'
                                        : idx < 3
                                            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200'
                                            : 'bg-slate-50 border border-slate-200'
                                    }`}
                            >
                                <div className="flex-shrink-0 w-10 text-center">
                                    {idx === 0 ? (
                                        <Crown className="w-6 h-6 text-yellow-500 mx-auto" />
                                    ) : idx === 1 ? (
                                        <Crown className="w-6 h-6 text-slate-400 mx-auto" />
                                    ) : idx === 2 ? (
                                        <Crown className="w-6 h-6 text-amber-700 mx-auto" />
                                    ) : (
                                        <span className="font-bold text-slate-600">#{player.rank}</span>
                                    )}
                                </div>
                                <div className="text-2xl">{player.avatar}</div>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-bold truncate ${player.name === 'You' ? 'text-blue-600' : 'text-slate-800'}`}>
                                        {player.name}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span>{player.points.toLocaleString()} pts</span>
                                        <span className="flex items-center gap-1">
                                            <Flame className="w-3 h-3 text-orange-500" /> {player.streak}
                                        </span>
                                    </div>
                                </div>
                                {idx < 5 && (
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                )}
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-4 py-2 border-2 border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-slate-50 transition">
                        View Full Rankings
                    </button>
                </div>
            </div>
        </div>
    );
}
