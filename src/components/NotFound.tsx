import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="text-center max-w-lg">
                <div className="relative inline-block mb-8">
                    <div className="text-9xl font-bold text-slate-100">404</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Search className="w-24 h-24 text-blue-600 opacity-20" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-4">Page Not Found</h1>
                <p className="text-slate-600 mb-8 text-lg">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-lg shadow-blue-500/20"
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition font-semibold"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}
