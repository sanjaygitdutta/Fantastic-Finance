import { Calendar } from 'lucide-react';
import { EconomicCalendarWidget } from './TradingViewWidgets';

export default function TradingCalendar() {
    return (
        <div className="bg-white/80 backdrop-blur-xl dark:bg-slate-800/80 rounded-2xl p-6 shadow-xl border border-white/20 dark:border-slate-700/50 h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
                        <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Trading Calendar</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Real-time global & Indian economic events</p>
                    </div>
                </div>
                <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full border border-green-200 dark:border-green-800">
                    LIVE FEED
                </div>
            </div>

            {/* TradingView Economic Calendar Widget */}
            <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                <EconomicCalendarWidget height="500px" />
            </div>

            <div className="mt-4 text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    Automated Data Sync • High Impact events highlighted
                </p>
            </div>
        </div>
    );
}
