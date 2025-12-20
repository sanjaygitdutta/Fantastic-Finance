import { Calendar, Globe, ArrowRight } from 'lucide-react';
import { EconomicCalendarWidget } from './TradingViewWidgets';
import { Link } from 'react-router-dom';

export default function LandingPageCalendar() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                    {/* Left: Info */}
                    <div className="lg:col-span-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-full mb-6 border border-orange-200 dark:border-orange-800">
                            <Globe className="w-3 h-3" /> REAL-TIME DATA
                        </div>
                        <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                            Never Miss a <br />
                            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Market-Moving</span> Event
                        </h2>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Stay ahead of the curve with our live economic calendar. Monitor interest rate decisions,
                            GDP releases, and employment data that dictate market direction across major economies including India.
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-slate-700">Daily Economic Releases</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-slate-700">Global Market Impact</span>
                            </div>
                        </div>

                        <Link
                            to="/calendar"
                            className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline group"
                        >
                            View Full Detailed Calendar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Right: Widget */}
                    <div className="lg:col-span-3">
                        <div className="bg-slate-50 rounded-3xl p-4 md:p-8 shadow-2xl border border-slate-200 relative">
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg">
                                LIVE STREAMING
                            </div>
                            <div className="rounded-2xl overflow-hidden bg-white shadow-inner border border-slate-100">
                                <EconomicCalendarWidget height="500px" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
