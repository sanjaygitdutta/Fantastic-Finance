import { useState, useEffect, useMemo } from 'react';
import { PlusSquare, MinusSquare, Trash2, Play, RefreshCw, Save, Share2, TrendingUp, TrendingDown, Target, Zap, Activity, Info, ChevronRight, HelpCircle, BarChart3, AlertTriangle, BookOpen, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

import { calculateMargin } from '../utils/marginCalculator';
import { runBacktestSimulation } from '../utils/backtestEngine';
import { usePaperTrading } from '../context/PaperTradingContext';
import { useAnalytics } from '../hooks/useAnalytics';
import AdSlot from './AdSlot';

interface OptionLeg {
    id: string;
    type: 'CALL' | 'PUT';
    action: 'BUY' | 'SELL';
    strike: number;
    premium: number;
    quantity: number;
    expiry: string;
}

interface GreeksData {
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
}

import { useLocation } from 'react-router-dom';

export default function StrategyBuilder() {
    const { logEvent } = useAnalytics();
    const location = useLocation();
    const initialState = location.state as {
        templateName?: string;
        strategyName?: string;
        legs?: OptionLeg[];
        symbol?: string;
        spotPrice?: number;
    } | null;

    const [activeTab, setActiveTab] = useState<'builder' | 'backtest' | 'templates'>('builder');
    const [categoryFilter, setCategoryFilter] = useState<'All' | 'Bullish' | 'Bearish' | 'Neutral'>('All');
    const [symbol, setSymbol] = useState(initialState?.symbol || 'NIFTY 50');
    const [spotPrice, setSpotPrice] = useState(initialState?.spotPrice || 24500);
    const [legs, setLegs] = useState<OptionLeg[]>(initialState?.legs || []);
    const [strategyName, setStrategyName] = useState(initialState?.strategyName || 'Custom Strategy');
    const [backtestResults, setBacktestResults] = useState<any>(null);

    const { portfolio } = usePaperTrading();
    const marginResult = legs.length > 0 ? calculateMargin(legs.map(leg => ({
        ...leg,
        price: leg.premium
    })), spotPrice) : null;

    useEffect(() => {
        if (!location.state) return;

        console.log('StrategyBuilder: Processing incoming state:', location.state);
        const currentState = location.state as typeof initialState;

        if (currentState?.symbol) setSymbol(currentState.symbol);
        if (currentState?.spotPrice) setSpotPrice(currentState.spotPrice);

        // Prioritize custom legs if provided
        if (currentState?.legs && currentState.legs.length > 0) {
            console.log('StrategyBuilder: Loading Custom Legs');
            setLegs(currentState.legs);
            if (currentState.strategyName) setStrategyName(currentState.strategyName);
            setActiveTab('builder');
        }
        // Fallback to template name lookup if no legs but name is present
        else if (currentState?.templateName) {
            console.log('StrategyBuilder: Loading Template by Name:', currentState.templateName);
            const template = templates.find(t => t.name.toLowerCase() === currentState.templateName?.toLowerCase());
            if (template) {
                loadTemplate(template);
            }
        }
    }, [location.state]);

    // Dynamic Strategy Templates
    const templates = [
        // Bullish Strategies
        {
            name: 'Long Call',
            desc: 'Simple bullish strategy with unlimited profit potential',
            category: 'Bullish',
            legs: [
                { type: 'CALL', action: 'BUY', strikeOffset: 0, quantity: 1 } // ATM
            ]
        },
        {
            name: 'Short Put',
            desc: 'Bullish strategy collecting premium, profit if price stays above strike',
            category: 'Bullish',
            legs: [
                { type: 'PUT', action: 'SELL', strikeOffset: 0, quantity: 1 } // ATM
            ]
        },
        {
            name: 'Bull Call Spread',
            desc: 'Limited risk, limited reward bullish strategy',
            category: 'Bullish',
            legs: [
                { type: 'CALL', action: 'BUY', strikeOffset: 0, quantity: 1 }, // ATM
                { type: 'CALL', action: 'SELL', strikeOffset: 200, quantity: 1 } // OTM
            ]
        },
        {
            name: 'Bull Put Spread',
            desc: 'Credit spread for moderately bullish outlook',
            category: 'Bullish',
            legs: [
                { type: 'PUT', action: 'SELL', strikeOffset: 0, quantity: 1 }, // ATM
                { type: 'PUT', action: 'BUY', strikeOffset: -200, quantity: 1 } // OTM
            ]
        },
        {
            name: 'Call Ratio Spread',
            desc: 'Bullish strategy selling more OTM calls than ITM calls bought',
            category: 'Bullish',
            legs: [
                { type: 'CALL', action: 'BUY', strikeOffset: 0, quantity: 1 }, // ATM
                { type: 'CALL', action: 'SELL', strikeOffset: 200, quantity: 2 } // OTM
            ]
        },
        // Bearish Strategies
        {
            name: 'Long Put',
            desc: 'Simple bearish strategy with high profit potential',
            category: 'Bearish',
            legs: [
                { type: 'PUT', action: 'BUY', strikeOffset: 0, quantity: 1 } // ATM
            ]
        },
        {
            name: 'Short Call',
            desc: 'Bearish strategy collecting premium, profit if price stays below strike',
            category: 'Bearish',
            legs: [
                { type: 'CALL', action: 'SELL', strikeOffset: 0, quantity: 1 } // ATM
            ]
        },
        {
            name: 'Bear Put Spread',
            desc: 'Limited risk bearish strategy',
            category: 'Bearish',
            legs: [
                { type: 'PUT', action: 'BUY', strikeOffset: 0, quantity: 1 }, // ATM
                { type: 'PUT', action: 'SELL', strikeOffset: -200, quantity: 1 } // OTM
            ]
        },
        {
            name: 'Bear Call Spread',
            desc: 'Credit spread for moderately bearish outlook',
            category: 'Bearish',
            legs: [
                { type: 'CALL', action: 'SELL', strikeOffset: 0, quantity: 1 }, // ATM
                { type: 'CALL', action: 'BUY', strikeOffset: 200, quantity: 1 } // OTM
            ]
        },
        {
            name: 'Put Ratio Spread',
            desc: 'Bearish strategy selling more OTM puts than ITM puts bought',
            category: 'Bearish',
            legs: [
                { type: 'PUT', action: 'BUY', strikeOffset: 0, quantity: 1 }, // ATM
                { type: 'PUT', action: 'SELL', strikeOffset: -200, quantity: 2 } // OTM
            ]
        },
        // Neutral Strategies
        {
            name: 'Long Straddle',
            desc: 'High volatility play - profit from big moves in either direction',
            category: 'Neutral',
            legs: [
                { type: 'CALL', action: 'BUY', strikeOffset: 0, quantity: 1 }, // ATM
                { type: 'PUT', action: 'BUY', strikeOffset: 0, quantity: 1 } // ATM
            ]
        },
        {
            name: 'Short Straddle',
            desc: 'High premium collection, profits from low volatility',
            category: 'Neutral',
            legs: [
                { type: 'CALL', action: 'SELL', strikeOffset: 0, quantity: 1 }, // ATM
                { type: 'PUT', action: 'SELL', strikeOffset: 0, quantity: 1 } // ATM
            ]
        },
        {
            name: 'Long Strangle',
            desc: 'Similar to straddle but with OTM options, lower cost',
            category: 'Neutral',
            legs: [
                { type: 'CALL', action: 'BUY', strikeOffset: 200, quantity: 1 }, // OTM Call
                { type: 'PUT', action: 'BUY', strikeOffset: -200, quantity: 1 } // OTM Put
            ]
        },
        {
            name: 'Short Strangle',
            desc: 'Premium collection from selling OTM options',
            category: 'Neutral',
            legs: [
                { type: 'CALL', action: 'SELL', strikeOffset: 200, quantity: 1 }, // OTM Call
                { type: 'PUT', action: 'SELL', strikeOffset: -200, quantity: 1 } // OTM Put
            ]
        },
        {
            name: 'Iron Condor',
            desc: 'Neutral strategy for range-bound markets',
            category: 'Neutral',
            legs: [
                { type: 'PUT', action: 'BUY', strikeOffset: -400, quantity: 1 }, // OTM Put Buy
                { type: 'PUT', action: 'SELL', strikeOffset: -200, quantity: 1 }, // OTM Put Sell
                { type: 'CALL', action: 'SELL', strikeOffset: 200, quantity: 1 }, // OTM Call Sell
                { type: 'CALL', action: 'BUY', strikeOffset: 400, quantity: 1 } // OTM Call Buy
            ]
        },
        {
            name: 'Iron Butterfly',
            desc: 'Similar to iron condor but with ATM short options',
            category: 'Neutral',
            legs: [
                { type: 'PUT', action: 'BUY', strikeOffset: -200, quantity: 1 }, // OTM Put Buy
                { type: 'PUT', action: 'SELL', strikeOffset: 0, quantity: 1 }, // ATM Put Sell
                { type: 'CALL', action: 'SELL', strikeOffset: 0, quantity: 1 }, // ATM Call Sell
                { type: 'CALL', action: 'BUY', strikeOffset: 200, quantity: 1 } // OTM Call Buy
            ]
        },
        {
            name: 'Long Call Butterfly',
            desc: 'Limited risk, limited profit neutral strategy',
            category: 'Neutral',
            legs: [
                { type: 'CALL', action: 'BUY', strikeOffset: -200, quantity: 1 }, // ITM Call Buy
                { type: 'CALL', action: 'SELL', strikeOffset: 0, quantity: 2 }, // ATM Call Sell
                { type: 'CALL', action: 'BUY', strikeOffset: 200, quantity: 1 } // OTM Call Buy
            ]
        },
        {
            name: 'Calendar Spread',
            desc: 'Time decay strategy using different expiries',
            category: 'Neutral',
            legs: [
                { type: 'CALL', action: 'SELL', strikeOffset: 0, quantity: 1 }, // Near Month
                { type: 'CALL', action: 'BUY', strikeOffset: 0, quantity: 1 } // Far Month
            ]
        }
    ];

    const addLeg = () => {
        const atmStrike = Math.round(spotPrice / 50) * 50;
        const newLeg: OptionLeg = {
            id: Date.now().toString(),
            type: 'CALL',
            action: 'BUY',
            strike: atmStrike,
            premium: 100,
            quantity: 1,
            expiry: '2024-12-28'
        };
        setLegs([...legs, newLeg]);
    };

    const removeLeg = (id: string) => {
        setLegs(legs.filter(leg => leg.id !== id));
    };

    const updateLeg = (id: string, field: keyof OptionLeg, value: any) => {
        setLegs(legs.map(leg => leg.id === id ? { ...leg, [field]: value } : leg));
    };

    const calculateEstimatedPremium = (strike: number, type: 'CALL' | 'PUT', spot: number) => {
        const intrinsic = type === 'CALL' ? Math.max(0, spot - strike) : Math.max(0, strike - spot);
        const timeValue = Math.max(0, (1 - Math.abs(spot - strike) / spot) * (spot * 0.01)); // Approx 1% ATM time value
        // Add some randomness or base value to make it look realistic
        return Math.round(intrinsic + timeValue + 10);
    };

    const loadTemplate = (template: any) => {
        const atmStrike = Math.round(spotPrice / 50) * 50;
        const templateLegs = template.legs.map((leg: any, idx: number) => ({
            id: Date.now().toString() + idx,
            type: leg.type as 'CALL' | 'PUT',
            action: leg.action as 'BUY' | 'SELL',
            strike: atmStrike + leg.strikeOffset,
            premium: calculateEstimatedPremium(atmStrike + leg.strikeOffset, leg.type as 'CALL' | 'PUT', spotPrice),
            quantity: leg.quantity,
            expiry: '2024-12-28'
        }));
        setLegs(templateLegs);
        setStrategyName(template.name);
        setActiveTab('builder');
    };

    // Calculate P&L for a single leg at different spot prices
    const calculateLegPnL = (leg: OptionLeg, spotAtExpiry: number) => {
        let intrinsicValue = 0;

        if (leg.type === 'CALL') {
            intrinsicValue = Math.max(0, spotAtExpiry - leg.strike);
        } else {
            intrinsicValue = Math.max(0, leg.strike - spotAtExpiry);
        }

        const positionValue = intrinsicValue * leg.quantity;
        const premium = leg.premium * leg.quantity;

        if (leg.action === 'BUY') {
            return positionValue - premium;
        } else {
            return premium - positionValue;
        }
    };

    // Generate payoff chart data
    const generatePayoffData = () => {
        const data = [];
        const range = spotPrice * 0.2; // ±20% from spot
        const step = range / 50;

        for (let price = spotPrice - range; price <= spotPrice + range; price += step) {
            let totalPnL = 0;
            legs.forEach(leg => {
                totalPnL += calculateLegPnL(leg, price);
            });
            data.push({ price: Math.round(price), pnl: Math.round(totalPnL) });
        }
        return data;
    };

    // Calculate Greeks (simplified)
    const calculateGreeks = (): GreeksData => {
        let totalDelta = 0;
        let totalGamma = 0;
        let totalTheta = 0;
        let totalVega = 0;

        legs.forEach(leg => {
            const multiplier = leg.action === 'BUY' ? 1 : -1;
            const isCall = leg.type === 'CALL';

            // Simplified Greeks calculation
            totalDelta += (isCall ? 0.5 : -0.5) * multiplier * leg.quantity;
            totalGamma += 0.01 * multiplier * leg.quantity;
            totalTheta += -0.05 * multiplier * leg.quantity;
            totalVega += 0.15 * multiplier * leg.quantity;
        });

        return {
            delta: parseFloat(totalDelta.toFixed(2)),
            gamma: parseFloat(totalGamma.toFixed(4)),
            theta: parseFloat(totalTheta.toFixed(2)),
            vega: parseFloat(totalVega.toFixed(2))
        };
    };

    // Calculate max profit/loss and breakeven
    const calculateStrategyMetrics = () => {
        const payoffData = generatePayoffData();
        const maxProfit = Math.max(...payoffData.map(d => d.pnl));
        const maxLoss = Math.min(...payoffData.map(d => d.pnl));

        // Find breakeven points
        const breakevens: number[] = [];
        for (let i = 1; i < payoffData.length; i++) {
            if ((payoffData[i - 1].pnl < 0 && payoffData[i].pnl >= 0) ||
                (payoffData[i - 1].pnl >= 0 && payoffData[i].pnl < 0)) {
                breakevens.push(payoffData[i].price);
            }
        }

        return { maxProfit, maxLoss, breakevens };
    };

    const runBacktest = () => {
        if (legs.length === 0) {
            alert('Please add strategy legs before running backtest');
            return;
        }

        // Get values from inputs (you can make these state variables for better control)
        const duration = parseInt((document.querySelector('select[id="duration"]') as HTMLSelectElement)?.value || '90');
        const capital = parseInt((document.querySelector('input[type="number"]') as HTMLInputElement)?.value || '100000');

        // Run simulation with user-selected parameters
        const results = runBacktestSimulation(legs, capital, duration);
        setBacktestResults(results);

        // Show success message
        console.log('Backtest completed successfully', results);
        logEvent('feature_used', { feature: 'Backtest' });
    };

    const payoffData = useMemo(() => legs.length > 0 ? generatePayoffData() : [], [legs, spotPrice]);
    const greeks = useMemo(() => legs.length > 0 ? calculateGreeks() : null, [legs]);
    const metrics = useMemo(() => legs.length > 0 ? calculateStrategyMetrics() : null, [legs, payoffData]);
    const netPremium = useMemo(() => legs.reduce((sum, leg) => {
        return sum + (leg.action === 'BUY' ? -leg.premium : leg.premium) * leg.quantity;
    }, 0), [location.state]);

    return (
        <div className="space-y-6">
            {/* Strategy Builder Top Ad */}
            <AdSlot slot="strategy-builder-top" format="horizontal" />
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Derivatives Strategy Builder</h1>
                </div>
                <div className="flex gap-3 flex-wrap">
                    <select
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        className="px-4 py-2 border-2 border-slate-200 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    >
                        <option value="NIFTY 50">NIFTY 50</option>
                        <option value="BANKNIFTY">BANKNIFTY</option>
                        <option value="SENSEX">SENSEX</option>
                        <option value="FINNIFTY">FINNIFTY</option>
                        <option value="MIDCPNIFTY">MIDCPNIFTY</option>
                    </select>
                    <input
                        type="text"
                        value={strategyName}
                        onChange={(e) => setStrategyName(e.target.value)}
                        className="px-4 py-2 border-2 border-slate-200 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        placeholder="Strategy Name"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200">
                {[
                    { id: 'builder', label: 'Strategy Builder', icon: Zap },
                    { id: 'backtest', label: 'Backtest', icon: BarChart3 },
                    { id: 'templates', label: 'Templates', icon: BookOpen }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-3 font-medium transition relative ${activeTab === tab.id
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Builder Tab */}
            {activeTab === 'builder' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Leg Builder */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Spot Price */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-2xl text-white shadow-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-blue-100 text-sm mb-1">{symbol} Spot Price</p>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            value={spotPrice || ''}
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                if (val > 0 || e.target.value === '') {
                                                    setSpotPrice(val);
                                                }
                                            }}
                                            placeholder="e.g., 22000"
                                            className="text-3xl font-bold bg-white/20 px-3 py-1 rounded-lg w-40 focus:outline-none focus:ring-2 focus:ring-white/50"
                                            min="0.01"
                                            step="0.5"
                                        />
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                    <p className="text-xs text-blue-100 mt-1">💡 Manual Update</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-blue-100 text-sm">Net Premium</p>
                                    <p className={`text-2xl font-bold ${netPremium >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                        ₹{Math.abs(netPremium).toLocaleString()}
                                        <span className="text-sm ml-1">{netPremium >= 0 ? 'Credit' : 'Debit'}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Funds Needed Panel */}
                        {marginResult && (
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-orange-500" />
                                    Funds Needed
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800">
                                        <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">Total Margin Required</p>
                                        <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                                            ₹{marginResult.totalMargin.toLocaleString()}
                                        </p>
                                        {marginResult.benefit > 0 && (
                                            <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                                                Hedge Benefit: -₹{marginResult.benefit.toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Available Funds</p>
                                        <p className="text-2xl font-bold text-slate-800 dark:text-white">
                                            ₹{portfolio.cashBalance.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                                        <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Margin Status</p>
                                        <p className={`text-xl font-bold ${portfolio.cashBalance >= marginResult.totalMargin ? 'text-green-600' : 'text-red-600'}`}>
                                            {portfolio.cashBalance >= marginResult.totalMargin ? 'Sufficient Funds' : 'Shortfall'}
                                        </p>
                                        {portfolio.cashBalance < marginResult.totalMargin && (
                                            <p className="text-xs text-red-500 mt-1">
                                                Add ₹{(marginResult.totalMargin - portfolio.cashBalance).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {marginResult.breakdown.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                        <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Margin Breakdown</p>
                                        <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
                                            {marginResult.breakdown.map((item, idx) => (
                                                <li key={idx} className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Legs Table */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-blue-600" />
                                    Strategy Legs ({legs.length})
                                </h3>
                                <button
                                    onClick={addLeg}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                                >
                                    <Plus className="w-4 h-4" /> Add Leg
                                </button>
                            </div>

                            {legs.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                                    <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-400">No legs added. Start building your strategy.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr>
                                                <th className="text-left p-3 font-semibold text-slate-700">Type</th>
                                                <th className="text-left p-3 font-semibold text-slate-700">Action</th>
                                                <th className="text-left p-3 font-semibold text-slate-700">Strike</th>
                                                <th className="text-left p-3 font-semibold text-slate-700">Premium</th>
                                                <th className="text-left p-3 font-semibold text-slate-700">Qty</th>
                                                <th className="text-left p-3 font-semibold text-slate-700">Expiry</th>
                                                <th className="text-left p-3 font-semibold text-slate-700"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {legs.map((leg, idx) => (
                                                <tr key={leg.id} className="border-b border-slate-100 hover:bg-slate-50">
                                                    <td className="p-3">
                                                        <select
                                                            value={leg.type}
                                                            onChange={(e) => updateLeg(leg.id, 'type', e.target.value)}
                                                            className="px-3 py-1.5 border border-slate-300 rounded-lg font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <option value="CALL">CALL</option>
                                                            <option value="PUT">PUT</option>
                                                        </select>
                                                    </td>
                                                    <td className="p-3">
                                                        <select
                                                            value={leg.action}
                                                            onChange={(e) => updateLeg(leg.id, 'action', e.target.value)}
                                                            className={`px-3 py-1.5 border rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${leg.action === 'BUY' ? 'bg-green-50 border-green-300 text-green-700' : 'bg-red-50 border-red-300 text-red-700'
                                                                }`}
                                                        >
                                                            <option value="BUY">BUY</option>
                                                            <option value="SELL">SELL</option>
                                                        </select>
                                                    </td>
                                                    <td className="p-3">
                                                        <input
                                                            type="number"
                                                            value={leg.strike}
                                                            onChange={(e) => updateLeg(leg.id, 'strike', Number(e.target.value))}
                                                            className="w-24 px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </td>
                                                    <td className="p-3">
                                                        <input
                                                            type="number"
                                                            value={leg.premium}
                                                            onChange={(e) => updateLeg(leg.id, 'premium', Number(e.target.value))}
                                                            className="w-20 px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </td>
                                                    <td className="p-3">
                                                        <input
                                                            type="number"
                                                            value={leg.quantity}
                                                            onChange={(e) => updateLeg(leg.id, 'quantity', Number(e.target.value))}
                                                            className="w-16 px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </td>
                                                    <td className="p-3">
                                                        <input
                                                            type="date"
                                                            value={leg.expiry}
                                                            onChange={(e) => updateLeg(leg.id, 'expiry', e.target.value)}
                                                            className="px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                                                        />
                                                    </td>
                                                    <td className="p-3">
                                                        <button
                                                            onClick={() => removeLeg(leg.id)}
                                                            className="text-slate-400 hover:text-red-500 transition"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Payoff Diagram */}
                        {legs.length > 0 && (
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-purple-600" />
                                    Payoff Diagram
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={payoffData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis
                                            dataKey="price"
                                            stroke="#64748b"
                                            label={{ value: 'Spot Price at Expiry', position: 'insideBottom', offset: -5 }}
                                        />
                                        <YAxis
                                            stroke="#64748b"
                                            label={{ value: 'P&L (₹)', angle: -90, position: 'insideLeft' }}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                            formatter={(value: any) => [`₹${value}`, 'P&L']}
                                        />
                                        <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
                                        <ReferenceLine x={spotPrice} stroke="#3b82f6" strokeDasharray="5 5" label={{ value: 'Current Spot', fill: '#3b82f6' }} />
                                        {metrics?.breakevens.map((be, idx) => (
                                            <ReferenceLine key={idx} x={be} stroke="#10b981" strokeDasharray="5 5" label={{ value: 'BE', fill: '#10b981' }} />
                                        ))}
                                        <Line type="monotone" dataKey="pnl" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* Right: Greeks & Metrics */}
                    <div className="space-y-6">
                        {/* Strategy Metrics */}
                        {metrics && (
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4">Strategy Metrics</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Max Profit</p>
                                        <p className="text-2xl font-bold text-green-600">₹{metrics.maxProfit.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Max Loss</p>
                                        <p className="text-2xl font-bold text-red-600">₹{Math.abs(metrics.maxLoss).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Breakeven Points</p>
                                        <div className="flex flex-wrap gap-2">
                                            {metrics.breakevens.map((be, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 rounded-lg font-medium text-sm">
                                                    {be.toLocaleString()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Risk/Reward Ratio</p>
                                        <p className="text-lg font-bold text-slate-800">
                                            1:{(metrics.maxProfit / Math.abs(metrics.maxLoss)).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Greeks */}
                        {greeks && (
                            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
                                <h3 className="font-bold mb-4">Portfolio Greeks</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/10 p-3 rounded-lg">
                                        <p className="text-xs text-slate-400 mb-1">Delta</p>
                                        <p className="text-xl font-bold">{greeks.delta}</p>
                                    </div>
                                    <div className="bg-white/10 p-3 rounded-lg">
                                        <p className="text-xs text-slate-400 mb-1">Gamma</p>
                                        <p className="text-xl font-bold">{greeks.gamma}</p>
                                    </div>
                                    <div className="bg-white/10 p-3 rounded-lg">
                                        <p className="text-xs text-slate-400 mb-1">Theta</p>
                                        <p className="text-xl font-bold">{greeks.theta}</p>
                                    </div>
                                    <div className="bg-white/10 p-3 rounded-lg">
                                        <p className="text-xs text-slate-400 mb-1">Vega</p>
                                        <p className="text-xl font-bold">{greeks.vega}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Backtest Tab */}
            {activeTab === 'backtest' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Configuration Panel */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4">Backtest Configuration</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
                                    <select id="duration" defaultValue="90" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="30">Last 30 Days</option>
                                        <option value="90">Last 90 Days</option>
                                        <option value="180">Last 6 Months</option>
                                        <option value="365">Last 1 Year</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Market Scenario</label>
                                    <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="random">Random Walk</option>
                                        <option value="bull">Bull Run</option>
                                        <option value="bear">Bear Market</option>
                                        <option value="sideways">Range Bound</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Initial Capital</label>
                                    <input type="number" defaultValue={100000} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <button
                                    onClick={runBacktest}
                                    disabled={legs.length === 0}
                                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg transition font-medium ${legs.length === 0 ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    <Play className="w-4 h-4" />
                                    Run Simulation
                                </button>
                                {legs.length === 0 && (
                                    <p className="text-xs text-red-500 text-center">Add strategy legs to run backtest</p>
                                )}
                            </div>
                        </div>

                        {backtestResults && (
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4">Key Metrics</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <p className="text-xs text-slate-500 mb-1">Win Rate</p>
                                        <p className="text-lg font-bold text-slate-800">{backtestResults.metrics.winRate}%</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <p className="text-xs text-slate-500 mb-1">Sharpe</p>
                                        <p className="text-lg font-bold text-slate-800">{backtestResults.metrics.sharpeRatio}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <p className="text-xs text-slate-500 mb-1">Avg Profit</p>
                                        <p className="text-lg font-bold text-green-600">₹{backtestResults.metrics.avgProfit}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <p className="text-xs text-slate-500 mb-1">Avg Loss</p>
                                        <p className="text-lg font-bold text-red-600">₹{backtestResults.metrics.avgLoss}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Charts Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        {backtestResults ? (
                            <>
                                {/* Equity Curve */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-green-600" />
                                            Equity Curve
                                        </h3>
                                        <div className="text-right">
                                            <p className="text-sm text-slate-500">Total Return</p>
                                            <p className={`text-2xl font-bold ${backtestResults.metrics.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {backtestResults.metrics.totalReturn > 0 ? '+' : ''}{backtestResults.metrics.totalReturn}%
                                            </p>
                                        </div>
                                    </div>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={backtestResults.equityCurve.map((val: number, idx: number) => ({ date: backtestResults.dates[idx], value: val }))}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                                <XAxis
                                                    dataKey="date"
                                                    stroke="#64748b"
                                                    tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    minTickGap={30}
                                                />
                                                <YAxis stroke="#64748b" domain={['auto', 'auto']} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                                    formatter={(value: number) => [`₹${Math.round(value).toLocaleString()}`, 'Equity']}
                                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                                />
                                                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Underlying Asset Price */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-slate-800 mb-4">Underlying Asset Price</h3>
                                    <div className="h-[200px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={backtestResults.underlyingPrice.map((val: number, idx: number) => ({ date: backtestResults.dates[idx], value: val }))}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                                <XAxis dataKey="date" hide />
                                                <YAxis stroke="#64748b" domain={['auto', 'auto']} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                                    formatter={(value: number) => [`${Math.round(value).toLocaleString()}`, 'Price']}
                                                />
                                                <Line type="monotone" dataKey="value" stroke="#64748b" strokeWidth={1} dot={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                <BarChart3 className="w-16 h-16 text-slate-300 mb-4" />
                                <h3 className="text-lg font-bold text-slate-700 mb-2">Ready to Simulate</h3>
                                <p className="text-slate-500 max-w-md">
                                    Configure your backtest parameters on the left and click "Run Simulation" to see how your strategy would have performed.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Templates Tab */}
            {activeTab === 'templates' && (
                <div className="space-y-6">
                    {/* Category Filters */}
                    <div className="flex gap-2 flex-wrap">
                        {(['All', 'Bullish', 'Bearish', 'Neutral'] as const).map((category) => (
                            <button
                                key={category}
                                onClick={() => setCategoryFilter(category)}
                                className={`px-4 py-2 rounded-lg font-medium transition ${categoryFilter === category
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-300'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Template Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates
                            .filter(t => categoryFilter === 'All' || t.category === categoryFilter)
                            .map((template) => (
                                <div key={template.name} className="bg-white p-6 rounded-2xl border-2 border-slate-200 hover:border-blue-500 transition-all cursor-pointer shadow-sm hover:shadow-lg group">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition">{template.name}</h3>
                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${template.category === 'Bullish' ? 'bg-green-100 text-green-700' :
                                            template.category === 'Bearish' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {template.category}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-sm mb-4">{template.desc}</p>
                                    <div className="space-y-2 mb-4">
                                        {template.legs.map((leg, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded-lg">
                                                <span className={`font-medium px-2 py-0.5 rounded ${leg.action === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {leg.action}
                                                </span>
                                                <span className="text-slate-700">{leg.type} @ {leg.strikeOffset > 0 ? '+' : ''}{leg.strikeOffset}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => loadTemplate(template)}
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                                    >
                                        Use Template
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Strategy Analysis Ad */}
            <AdSlot slot="strategy-builder-analysis" format="horizontal" className="mt-6" />
            {/* Bottom Ad */}
            <AdSlot slot="strategy-builder-bottom" format="horizontal" className="mt-8" />
        </div>
    );
}
