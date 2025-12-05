import { useMemo, useState } from 'react';
import { Activity, RefreshCw, Wifi, WifiOff, LogIn } from 'lucide-react';
import { useLivePrices } from '../context/LivePriceContext';
import { authService } from '../services/authService';

export default function MarketPulse() {
    const { prices, refreshPrices, lastUpdated, usingLiveApi } = useLivePrices();
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Calculate market "temperature" based on average absolute change
    const volatility = useMemo(() => {
        const changes = Object.values(prices).map(p => Math.abs(p.changePercent));
        if (changes.length === 0) return 0;
        const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
        return avgChange;
    }, [prices]);

    // Determine state based on volatility
    const getState = () => {
        if (volatility > 0.5) return { color: 'text-red-500', bg: 'bg-red-500', status: 'High Volatility', pulse: 'animate-ping' };
        if (volatility > 0.2) return { color: 'text-green-500', bg: 'bg-green-500', status: 'Active Market', pulse: 'animate-pulse' };
        return { color: 'text-blue-500', bg: 'bg-blue-500', status: 'Calm Market', pulse: 'animate-pulse duration-[3s]' };
    };

    const state = getState();

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refreshPrices();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const handleLogin = () => {
        window.location.href = authService.getLoginUrl();
    };

    const isAuthenticated = authService.isAuthenticated();
    const envTokenPresent = !!import.meta.env.VITE_UPSTOX_ACCESS_TOKEN;

    return (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:scale-105">
            {/* Status Indicator */}
            <div className="relative flex items-center justify-center w-4 h-4" title={usingLiveApi ? "Live Connection" : "Simulated Data"}>
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${state.bg} ${state.pulse}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${state.bg}`}></span>
            </div>

            {/* Market Status Text */}
            <div className="flex flex-col mr-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 leading-none">
                    {usingLiveApi ? 'Live Feed' : 'Simulated'}
                </span>
                <span className={`text-xs font-bold ${state.color} leading-none mt-0.5`}>{state.status}</span>
            </div>

            {/* Connection Icon */}
            {usingLiveApi ? (
                <Wifi className="w-4 h-4 text-green-500" title="Connected to Upstox" />
            ) : (
                <WifiOff className="w-4 h-4 text-slate-400" title="Using Simulated Data" />
            )}

            {/* Divider */}
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

            {/* Login Button (if not authenticated and no env token) */}
            {!isAuthenticated && !envTokenPresent && (
                <>
                    <button
                        onClick={handleLogin}
                        className="flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                        title="Login with Upstox"
                    >
                        <LogIn className="w-3 h-3" />
                        Login
                    </button>
                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                </>
            )}

            {/* Refresh Button */}
            <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition ${isRefreshing ? 'animate-spin' : ''}`}
                title="Refresh Prices"
            >
                <RefreshCw className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </button>
        </div>
    );
}
