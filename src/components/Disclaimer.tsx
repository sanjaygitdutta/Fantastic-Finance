import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Disclaimer() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <ShieldAlert className="w-6 h-6 text-orange-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Disclaimer</h1>
                    </div>
                    <p className="text-slate-600">Fantastic Finance</p>
                </div>

                {/* Disclaimer Content */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div className="prose prose-slate max-w-none">
                        <p className="text-slate-700 leading-relaxed mb-4 font-medium border-l-4 border-blue-500 pl-4 bg-blue-50 p-2 rounded-r">
                            <strong>Fantastic Financial is an independent website and has no relation to any company, LLP, or entity with similar names.</strong>
                        </p>

                        <p className="text-slate-700 leading-relaxed mb-4">
                            The information provided on this website is for <strong>informational and educational purposes only</strong>.
                            Fantastic Finance is <strong>not a SEBI-registered investment advisor</strong> and does not provide any kind of
                            investment or trading advice.
                        </p>

                        <p className="text-slate-700 leading-relaxed mb-4">
                            All content including market data, charts, news, analysis, and tools is intended to help users understand
                            financial markets. It should <strong>not be interpreted as a recommendation</strong> to buy, sell, or hold
                            any financial instrument.
                        </p>

                        <p className="text-slate-700 leading-relaxed mb-4">
                            <strong>Stock market investments are subject to market risks.</strong> Users should conduct their own research
                            or consult a certified financial advisor before making any investment decisions.
                        </p>

                        <p className="text-slate-700 leading-relaxed mb-4">
                            Market data displayed on this website may be delayed or sourced from third-party providers. We do not guarantee
                            the <strong>accuracy, completeness, or reliability</strong> of any information.
                        </p>

                        <p className="text-slate-700 leading-relaxed mb-4">
                            Fantastic Finance, its owners, employees, and affiliates will <strong>not be responsible for any financial
                                losses</strong> incurred from the use of this website.
                        </p>

                        <p className="text-slate-700 leading-relaxed font-semibold">
                            By using this website, you agree that you are solely responsible for your investment decisions.
                        </p>
                    </div>
                </div>

                {/* Important Notice Box */}
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mb-6">
                    <div className="flex gap-3">
                        <ShieldAlert className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-orange-900 mb-2">Important Notice</h3>
                            <p className="text-sm text-orange-800">
                                This platform is designed for educational purposes to help users learn about options trading,
                                derivatives strategies, and market analysis. Always consult with a SEBI-registered financial
                                advisor before making any investment decisions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
