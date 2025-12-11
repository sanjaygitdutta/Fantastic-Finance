import { useRef, useEffect, memo } from 'react';
import { Calendar as CalendarIcon, AlertCircle } from 'lucide-react';

const TradingViewCalendar = memo(function TradingViewCalendar() {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "width": "100%",
            "height": "800",
            "colorTheme": "light",
            "isTransparent": false,
            "locale": "en",
            "importanceFilter": "0,1",
            "currencyFilter": "USD,EUR,GBP,JPY,CNY,INR"
        });

        container.current.innerHTML = '';
        container.current.appendChild(script);

        return () => {
            if (container.current) {
                container.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <div className="tradingview-widget-container" ref={container}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
});

export default function EconomicCalendar() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <CalendarIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Economic Calendar</h1>
                            <p className="text-slate-500 dark:text-slate-400">Important economic events and indicators</p>
                        </div>
                    </div>
                </div>

                {/* Widget */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <TradingViewCalendar />
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">About Economic Calendar</h4>
                            <p className="text-sm text-blue-800 dark:text-blue-400">
                                This real-time calendar allows you to track key economic events from around the world.
                                Monitor GDP releases, Interest Rate decisions, Inflation data (CPI/PPI), and Employment figures
                                that move the markets. Events are updated automatically.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
