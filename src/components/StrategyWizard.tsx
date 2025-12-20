import { useState } from 'react';
import { Search, Filter, Play, CheckCircle2, ChevronRight, Wand2, Target, Zap, TrendingUp, TrendingDown, Minus, Activity, Check, ArrowRight, Clock, Shield, LineChart } from 'lucide-react';
import AdSlot from './AdSlot';
import { Link, useNavigate } from 'react-router-dom';

type Outlook = 'bullish' | 'bearish' | 'neutral' | 'volatile' | 'rangebound';
type TimeHorizon = 'short' | 'medium' | 'long';
type RiskLevel = 'conservative' | 'moderate' | 'aggressive';

interface Strategy {
    name: string;
    description: string;
    maxProfit: string;
    maxLoss: string;
    breakeven: string;
    winProbability: number;
    complexity: 'Easy' | 'Medium' | 'Advanced';
    riskReward: string;
    idealFor: string;
}

export default function StrategyWizard() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [outlook, setOutlook] = useState<Outlook>('bullish');
    const [currentPrice, setCurrentPrice] = useState(19500);
    const [targetPrice, setTargetPrice] = useState(20000);
    const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('medium');
    const [riskLevel, setRiskLevel] = useState<RiskLevel>('moderate');

    const outlooks = [
        { id: 'bullish' as Outlook, label: 'Bullish', icon: TrendingUp, color: 'green', desc: 'Market will go up' },
        { id: 'bearish' as Outlook, label: 'Bearish', icon: TrendingDown, color: 'red', desc: 'Market will go down' },
        { id: 'neutral' as Outlook, label: 'Neutral', icon: Minus, color: 'gray', desc: 'Market will stay flat' },
        { id: 'volatile' as Outlook, label: 'Volatile', icon: Activity, color: 'purple', desc: 'Big move expected' },
        { id: 'rangebound' as Outlook, label: 'Range-bound', icon: Zap, color: 'blue', desc: 'Market in a range' }
    ];

    const getRecommendedStrategies = (): Strategy[] => {
        const strategies: Strategy[] = [];

        // Strategy logic based on outlook and risk
        if (outlook === 'bullish') {
            if (riskLevel === 'conservative') {
                strategies.push({
                    name: 'Bull Call Spread',
                    description: 'Buy ATM call, sell OTM call. Limited risk and reward.',
                    maxProfit: '₹5,250',
                    maxLoss: '₹2,750',
                    breakeven: '19,550',
                    winProbability: 65,
                    complexity: 'Easy',
                    riskReward: '1:1.9',
                    idealFor: 'Moderate upward move with limited risk'
                });
                strategies.push({
                    name: 'Covered Call',
                    description: 'Own stock + sell call. Generate income with downside protection.',
                    maxProfit: '₹3,500',
                    maxLoss: 'Unlimited (if stock falls)',
                    breakeven: currentPrice.toString(),
                    winProbability: 70,
                    complexity: 'Easy',
                    riskReward: '1:1.5',
                    idealFor: 'Slow upward move or sideways market'
                });
            } else if (riskLevel === 'aggressive') {
                strategies.push({
                    name: 'Long Call',
                    description: 'Buy call option. Unlimited upside, limited downside.',
                    maxProfit: 'Unlimited',
                    maxLoss: '₹3,000 (premium paid)',
                    breakeven: '19,530',
                    winProbability: 45,
                    complexity: 'Easy',
                    riskReward: '1:10+',
                    idealFor: 'Strong bullish conviction'
                });
                strategies.push({
                    name: 'Call Ratio Spread',
                    description: 'Buy 1 ATM call, sell 2 OTM calls. High profit if target hit.',
                    maxProfit: '₹8,500',
                    maxLoss: 'Unlimited (if moves too high)',
                    breakeven: '19,540 / 20,460',
                    winProbability: 55,
                    complexity: 'Advanced',
                    riskReward: '1:3.5',
                    idealFor: 'Bullish but not explosive move'
                });
            } else {
                strategies.push({
                    name: 'Bull Call Spread',
                    description: 'Buy ATM call, sell OTM call. Balanced risk-reward.',
                    maxProfit: '₹5,250',
                    maxLoss: '₹2,750',
                    breakeven: '19,550',
                    winProbability: 65,
                    complexity: 'Easy',
                    riskReward: '1:1.9',
                    idealFor: 'Moderate bullish outlook'
                });
            }
        }

        if (outlook === 'bearish') {
            if (riskLevel === 'conservative') {
                strategies.push({
                    name: 'Bear Put Spread',
                    description: 'Buy ATM put, sell OTM put. Limited risk and reward.',
                    maxProfit: '₹4,800',
                    maxLoss: '₹2,200',
                    breakeven: '19,450',
                    winProbability: 62,
                    complexity: 'Easy',
                    riskReward: '1:2.2',
                    idealFor: 'Moderate downward move'
                });
            } else {
                strategies.push({
                    name: 'Long Put',
                    description: 'Buy put option. Profit from downward move.',
                    maxProfit: 'Substantial (if stock falls)',
                    maxLoss: '₹2,800 (premium paid)',
                    breakeven: '19,472',
                    winProbability: 48,
                    complexity: 'Easy',
                    riskReward: '1:8+',
                    idealFor: 'Strong bearish conviction'
                });
            }
        }

        if (outlook === 'neutral') {
            strategies.push({
                name: 'Iron Condor',
                description: 'Sell OTM call & put, buy further OTM call & put. Profit from low volatility.',
                maxProfit: '₹3,200',
                maxLoss: '₹6,800',
                breakeven: '19,320 / 19,680',
                winProbability: 72,
                complexity: 'Medium',
                riskReward: '1:2.1',
                idealFor: 'Range-bound market with low volatility'
            });
            strategies.push({
                name: 'Short Straddle',
                description: 'Sell ATM call and put. High reward if stays flat.',
                maxProfit: '₹5,600',
                maxLoss: 'Unlimited',
                breakeven: '19,444 / 19,556',
                winProbability: 45,
                complexity: 'Advanced',
                riskReward: '1:∞',
                idealFor: 'High volatility expected to decrease'
            });
        }

        if (outlook === 'volatile') {
            strategies.push({
                name: 'Long Straddle',
                description: 'Buy ATM call and put. Profit from big move in either direction.',
                maxProfit: 'Unlimited',
                maxLoss: '₹5,400 (both premiums)',
                breakeven: '19,446 / 19,554',
                winProbability: 38,
                complexity: 'Medium',
                riskReward: '1:10+',
                idealFor: 'Major event or earnings expected'
            });
            strategies.push({
                name: 'Long Strangle',
                description: 'Buy OTM call and put. Cheaper than straddle.',
                maxProfit: 'Unlimited',
                maxLoss: '₹3,800',
                breakeven: '19,420 / 19,580',
                winProbability: 42,
                complexity: 'Medium',
                riskReward: '1:12+',
                idealFor: 'Expecting large move but uncertain direction'
            });
        }

        if (outlook === 'rangebound') {
            strategies.push({
                name: 'Iron Condor',
                description: 'Perfect for range-bound markets. Defined risk.',
                maxProfit: '₹3,200',
                maxLoss: '₹6,800',
                breakeven: '19,320 / 19,680',
                winProbability: 75,
                complexity: 'Medium',
                riskReward: '1:2.1',
                idealFor: 'Market trading in tight range'
            });
            strategies.push({
                name: 'Iron Butterfly',
                description: 'Tighter range than condor. Higher probability.',
                maxProfit: '₹4,100',
                maxLoss: '₹5,900',
                breakeven: '19,459 / 19,541',
                winProbability: 68,
                complexity: 'Medium',
                riskReward: '1:1.4',
                idealFor: 'Very narrow trading range expected'
            });
        }

        return strategies.slice(0, 3); // Return top 3
    };

    const strategies = getRecommendedStrategies();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        🧙‍♂️ Strategy Wizard
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Answer a few questions and we'll recommend the best option strategies for your market view
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${step >= s
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                                }`}>
                                {step > s ? <Check className="w-5 h-5" /> : s}
                            </div>
                            {s < 4 && <div className={`w-16 h-1 ${step > s ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}></div>}
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
                    {/* Step 1: Market Outlook */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">What's your market outlook?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {outlooks.map((o) => (
                                    <button
                                        key={o.id}
                                        onClick={() => setOutlook(o.id)}
                                        className={`p-6 rounded-xl border-2 transition text-left ${outlook === o.id
                                            ? `border-${o.color}-500 bg-${o.color}-50 dark:bg-${o.color}-900/20`
                                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                            }`}
                                    >
                                        <o.icon className={`w-8 h-8 text-${o.color}-600 mb-3`} />
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{o.label}</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{o.desc}</p>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setStep(2)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                            >
                                Next <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Step 2: Target Price */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Target className="w-6 h-6" /> Set Your Target
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Current Price (NIFTY)
                                    </label>
                                    <input
                                        type="number"
                                        value={currentPrice}
                                        onChange={(e) => setCurrentPrice(Number(e.target.value))}
                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Target Price
                                    </label>
                                    <input
                                        type="number"
                                        value={targetPrice}
                                        onChange={(e) => setTargetPrice(Number(e.target.value))}
                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                                    />
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                        Expected move: {((targetPrice - currentPrice) / currentPrice * 100).toFixed(2)}%
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 py-3 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                                >
                                    Next <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Time & Risk */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                                    <Clock className="w-6 h-6" /> Time Horizon
                                </h2>
                                <div className="grid grid-cols-3 gap-3">
                                    {['short', 'medium', 'long'].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTimeHorizon(t as TimeHorizon)}
                                            className={`p-4 rounded-lg border-2 transition ${timeHorizon === t
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-slate-200 dark:border-slate-700'
                                                }`}
                                        >
                                            <div className="font-bold text-slate-900 dark:text-white capitalize">{t}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                {t === 'short' && '0-7 days'}
                                                {t === 'medium' && '1-4 weeks'}
                                                {t === 'long' && '1-3 months'}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                                    <Shield className="w-6 h-6" /> Risk Appetite
                                </h2>
                                <div className="grid grid-cols-3 gap-3">
                                    {['conservative', 'moderate', 'aggressive'].map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => setRiskLevel(r as RiskLevel)}
                                            className={`p-4 rounded-lg border-2 transition ${riskLevel === r
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-slate-200 dark:border-slate-700'
                                                }`}
                                        >
                                            <div className="font-bold text-slate-900 dark:text-white capitalize">{r}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(2)}
                                    className="flex-1 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 py-3 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(4)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                                >
                                    See Recommendations <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Recommendations */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    📈 Recommended Strategies
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Based on your {outlook} outlook for {currentPrice} → {targetPrice}
                                </p>
                            </div>

                            <div className="space-y-4">
                                {strategies.map((strategy, idx) => (
                                    <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:border-blue-500 transition">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{strategy.name}</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{strategy.description}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${strategy.complexity === 'Easy' ? 'bg-green-100 text-green-700' :
                                                    strategy.complexity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {strategy.complexity}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">Max Profit</div>
                                                <div className="font-bold text-green-600">{strategy.maxProfit}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">Max Loss</div>
                                                <div className="font-bold text-red-600">{strategy.maxLoss}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">Win Probability</div>
                                                <div className="font-bold text-blue-600">{strategy.winProbability}%</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">Risk:Reward</div>
                                                <div className="font-bold text-slate-900 dark:text-white">{strategy.riskReward}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                                <span className="font-medium">Ideal for:</span> {strategy.idealFor}
                                            </div>
                                            <Link
                                                to="/strategy"
                                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                            >
                                                <LineChart className="w-4 h-4" />
                                                Build This
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setStep(1)}
                                className="w-full border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 py-3 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                Start Over
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {/* AdSense Display Ad */}
            <AdSlot slot="strategy-wizard-bottom" format="horizontal" className="mt-8" />
        </div>
    );
}
