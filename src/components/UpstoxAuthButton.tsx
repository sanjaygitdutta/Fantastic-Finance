import { LogIn, TrendingUp } from 'lucide-react';
import { useUpstoxAuth } from '../hooks/useUpstoxAuth';

export default function UpstoxAuthButton() {
    const { isAuthenticated, login, logout } = useUpstoxAuth();

    if (isAuthenticated) {
        return (
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-700">Live NSE Data</span>
                </div>
                <button
                    onClick={logout}
                    className="text-sm text-slate-600 hover:text-slate-900 transition"
                >
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={login}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-medium shadow-lg"
        >
            <TrendingUp className="w-4 h-4" />
            Connect Upstox for Live NSE Data
            <LogIn className="w-4 h-4" />
        </button>
    );
}
