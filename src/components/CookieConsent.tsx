import { useState, useEffect } from 'react';
import { X, Cookie, Shield } from 'lucide-react';

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            // Show banner after a short delay
            setTimeout(() => setShowBanner(true), 1000);
        } else if (consent === 'accepted') {
            // Initialize Google Consent Mode
            initializeGoogleConsent(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        initializeGoogleConsent(true);
        setShowBanner(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookieConsent', 'declined');
        initializeGoogleConsent(false);
        setShowBanner(false);
    };

    const initializeGoogleConsent = (granted: boolean) => {
        // Google Consent Mode v2
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                'ad_storage': granted ? 'granted' : 'denied',
                'ad_user_data': granted ? 'granted' : 'denied',
                'ad_personalization': granted ? 'granted' : 'denied',
                'analytics_storage': granted ? 'granted' : 'denied'
            });
        }
    };

    if (!showBanner) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={handleDecline}></div>

            {/* Cookie Consent Banner */}
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
                <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 md:p-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Cookie className="w-6 h-6 text-white" />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                            🍪 We Value Your Privacy
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                            We use cookies and similar technologies to enhance your experience, analyze site traffic,
                                            and show personalized ads. By clicking "Accept", you consent to our use of cookies.
                                            You can manage your preferences anytime.
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleDecline}
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={handleAccept}
                                        className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl"
                                    >
                                        Accept All Cookies
                                    </button>
                                    <button
                                        onClick={handleDecline}
                                        className="flex-1 sm:flex-none px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                                    >
                                        Decline
                                    </button>
                                    <a
                                        href="/privacy-policy"
                                        className="flex items-center justify-center gap-2 px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition text-sm font-medium"
                                    >
                                        <Shield className="w-4 h-4" />
                                        Privacy Policy
                                    </a>
                                </div>

                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-4">
                                    By using our site, you acknowledge that you have read and understood our Privacy Policy and Cookie Policy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
