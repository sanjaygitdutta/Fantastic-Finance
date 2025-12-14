import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
    TrendingUp, Globe, Newspaper, Zap, BarChart2, Activity, Filter,
    GraduationCap, Heart, User, LogOut, Menu, X,
    Star, Briefcase, Bell, Calendar, Link as LinkIcon, Calculator, Brain,
    Shield, ChevronDown, Monitor, PieChart, DollarSign, Layers, Settings
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import MarketPulse from './MarketPulse';
import AIAssistant from './AIAssistant';
import FloatingActions from './FloatingActions';
import DonationModal from './DonationModal';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

export default function Layout() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [donationModalOpen, setDonationModalOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            console.log('Signing out...');
            localStorage.removeItem('demo_user');
            localStorage.removeItem('upstox_access_token');
            localStorage.removeItem('upstox_refresh_token');

            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
                    localStorage.removeItem(key);
                }
            });

            window.dispatchEvent(new Event('demo_login'));
            window.dispatchEvent(new Event('storage'));

            await supabase.auth.signOut().catch((err: Error) => console.warn('Supabase signout suppressed:', err));

        } catch (error) {
            console.error('Sign out logic error:', error);
        } finally {
            console.log('Redirecting to landing page...');
            window.location.replace('/');
        }
    };

    const isActive = (path: string) => location.pathname === path;
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 flex flex-col">
            <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* LEFT: Logo & Mobile Menu Toggle */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>

                            <Link to="/" className="flex items-center gap-2 flex-shrink-0" onClick={closeMobileMenu}>
                                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                                    <TrendingUp className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent whitespace-nowrap">
                                    Fantastic Finance
                                </span>
                            </Link>
                        </div>

                        {/* CENTER: Desktop Navigation with Dropdowns */}
                        <div className="hidden lg:flex items-center gap-8">

                            {/* MARKETS DROPDOWN */}
                            <div className="relative group">
                                <button className={`flex items-center gap-1 text-sm font-medium ${['/markets', '/wallstreet', '/news', '/ipo', '/calendar'].some(p => isActive(p)) ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'} hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-4 focus:outline-none`}>
                                    Markets <ChevronDown className="w-3 h-3 opacity-70 group-hover:rotate-180 transition-transform" />
                                </button>
                                <div className="absolute top-full left-0 w-52 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-1 z-50">
                                    <Link to="/markets" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <Globe className="w-4 h-4 text-blue-500" /> Market
                                    </Link>
                                    <Link to="/wallstreet" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <TrendingUp className="w-4 h-4 text-rose-500" /> Wall Street
                                    </Link>
                                    <Link to="/news" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <Newspaper className="w-4 h-4 text-slate-500" /> News
                                    </Link>
                                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                                    <Link to="/ipo" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <Layers className="w-4 h-4 text-purple-500" /> IPO
                                    </Link>
                                    <Link to="/calendar" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <Calendar className="w-4 h-4 text-orange-500" /> Calendar
                                    </Link>
                                </div>
                            </div>

                            {/* ANALYSIS DROPDOWN */}
                            <div className="relative group">
                                <button className={`flex items-center gap-1 text-sm font-medium ${['/strategy', '/analytics', '/straddle', '/charts', '/option-chain', '/iv-analysis', '/technical'].some(p => isActive(p)) ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'} hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-4 focus:outline-none`}>
                                    Analysis <ChevronDown className="w-3 h-3 opacity-70 group-hover:rotate-180 transition-transform" />
                                </button>
                                <div className="absolute top-full left-0 w-56 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-1 z-50">
                                    <Link to="/strategy" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <Brain className="w-4 h-4 text-purple-500" /> Strategy Builder
                                    </Link>
                                    <Link to="/analytics" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <BarChart2 className="w-4 h-4 text-orange-500" /> Analytics
                                    </Link>
                                    <Link to="/straddle" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <Activity className="w-4 h-4 text-pink-500" /> Premium Charts
                                    </Link>
                                    <Link to="/charts" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <BarChart2 className="w-4 h-4 text-blue-500" /> Advanced Charts
                                    </Link>
                                    <Link to="/option-chain" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <Activity className="w-4 h-4 text-emerald-500" /> Option Chain
                                    </Link>
                                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                                    <Link to="/iv-analysis" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <PieChart className="w-4 h-4 text-pink-500" /> IV Analysis
                                    </Link>
                                    <Link to="/technical" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <Activity className="w-4 h-4 text-teal-500" /> Technicals
                                    </Link>
                                </div>
                            </div>

                            {/* CURRENCY & ASSETS DROPDOWN */}
                            <div className="relative group">
                                <button className={`flex items-center gap-1 text-sm font-medium ${['/currency', '/crypto', '/commodity', '/bond', '/etf'].some(p => isActive(p)) ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'} hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-4 focus:outline-none`}>
                                    Currency & Assets <ChevronDown className="w-3 h-3 opacity-70 group-hover:rotate-180 transition-transform" />
                                </button>
                                <div className="absolute top-full left-0 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-1 z-50">
                                    <Link to="/currency" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <DollarSign className="w-4 h-4 text-green-500" /> Forex / Currency
                                    </Link>
                                    <Link to="/crypto" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <Zap className="w-4 h-4 text-orange-500" /> Crypto
                                    </Link>
                                    <Link to="/commodity" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <Shield className="w-4 h-4 text-yellow-500" /> Commodities
                                    </Link>
                                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                                    <Link to="/bond" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <Activity className="w-4 h-4 text-blue-400" /> Bonds
                                    </Link>
                                    <Link to="/etf" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <Layers className="w-4 h-4 text-indigo-400" /> ETFs
                                    </Link>
                                </div>
                            </div>

                            {/* TOOLS / ACADEMY DROPDOWN */}
                            <div className="relative group">
                                <button className={`flex items-center gap-1 text-sm font-medium ${['/calculators', '/daily-quiz', '/academy', '/links', '/scanner', '/screener'].some(p => isActive(p)) ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'} hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-4 focus:outline-none`}>
                                    Tools <ChevronDown className="w-3 h-3 opacity-70 group-hover:rotate-180 transition-transform" />
                                </button>
                                <div className="absolute top-full left-0 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-1 z-50">
                                    <Link to="/calculators" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <Calculator className="w-4 h-4 text-slate-500" /> Calculators
                                    </Link>

                                    <Link to="/scanner" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <Monitor className="w-4 h-4 text-indigo-500" /> Market Scanner
                                    </Link>
                                    <Link to="/screener" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <Filter className="w-4 h-4 text-cyan-500" /> Stock Screener
                                    </Link>
                                    <Link to="/daily-quiz" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <Brain className="w-4 h-4 text-pink-500" /> Daily Quiz
                                    </Link>
                                    <Link to="/links" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <LinkIcon className="w-4 h-4 text-blue-400" /> Important Links
                                    </Link>
                                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                                    <Link to="/academy" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <GraduationCap className="w-4 h-4 text-emerald-500" /> Academy
                                    </Link>
                                </div>
                            </div>

                            {/* PORTFOLIO DROPDOWN */}
                            <div className="relative group">
                                <button className={`flex items-center gap-1 text-sm font-medium ${['/portfolio', '/watchlist', '/alerts'].some(p => isActive(p)) ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'} hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-4 focus:outline-none`}>
                                    Portfolio <ChevronDown className="w-3 h-3 opacity-70 group-hover:rotate-180 transition-transform" />
                                </button>
                                <div className="absolute top-full left-0 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-1 z-50">
                                    <Link to="/portfolio" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <Briefcase className="w-4 h-4 text-slate-500" /> My Portfolio
                                    </Link>
                                    <Link to="/watchlist" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <Star className="w-4 h-4 text-yellow-500" /> Watchlist
                                    </Link>
                                    <Link to="/alerts" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-700 dark:text-slate-200">
                                        <Bell className="w-4 h-4 text-red-500" /> Alerts
                                    </Link>
                                </div>
                            </div>

                            {/* COMMUNITY LINK (Beside Portfolio) */}
                            <Link to="/community" className={`text-sm font-medium ${isActive('/community') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'} hover:text-blue-600 dark:hover:text-blue-400 transition-colors`}>
                                Community
                            </Link>

                        </div>

                        {/* RIGHT: User Actions */}
                        <div className="hidden lg:flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setDonationModalOpen(true)}
                                    className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full text-sm font-medium hover:from-pink-600 hover:to-red-600 transition shadow-sm mr-2"
                                >
                                    <Heart className="w-4 h-4 fill-white" /> Donate
                                </button>
                                <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 transition">
                                    <User className="w-5 h-5" />
                                    <span className="hidden xl:inline">Profile</span>
                                </Link>
                                <Link to="/settings" className="text-slate-500 hover:text-blue-600 transition" title="Settings">
                                    <Settings className="w-5 h-5" />
                                </Link>
                                <button onClick={handleSignOut} className="text-red-600 hover:text-red-700 transition" title="Sign Out">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative z-50">
                        <div className="px-4 py-2 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
                            <div className="font-semibold text-xs text-slate-400 uppercase tracking-wider mt-4 mb-2">Markets</div>
                            <Link to="/markets" onClick={closeMobileMenu} className="mobile-nav-link pl-4 border-l-2 border-transparent hover:border-blue-500">Market</Link>
                            <Link to="/wallstreet" onClick={closeMobileMenu} className="mobile-nav-link pl-4 border-l-2 border-transparent hover:border-blue-500">Wall Street</Link>
                            <Link to="/news" onClick={closeMobileMenu} className="mobile-nav-link pl-4 border-l-2 border-transparent hover:border-blue-500">News</Link>
                            <Link to="/ipo" onClick={closeMobileMenu} className="mobile-nav-link pl-4 border-l-2 border-transparent hover:border-blue-500">IPO</Link>

                            <div className="font-semibold text-xs text-slate-400 uppercase tracking-wider mt-4 mb-2">Analysis</div>
                            <Link to="/strategy" onClick={closeMobileMenu} className="mobile-nav-link pl-4 border-l-2 border-transparent hover:border-blue-500">Strategy</Link>
                            <Link to="/charts" onClick={closeMobileMenu} className="mobile-nav-link pl-4 border-l-2 border-transparent hover:border-blue-500">Charts</Link>
                            <Link to="/option-chain" onClick={closeMobileMenu} className="mobile-nav-link pl-4 border-l-2 border-transparent hover:border-blue-500">Option Chain</Link>
                            <Link to="/scanner" onClick={closeMobileMenu} className="mobile-nav-link pl-4 border-l-2 border-transparent hover:border-blue-500">Scanner</Link>
                            <Link to="/screener" onClick={closeMobileMenu} className="mobile-nav-link pl-4 border-l-2 border-transparent hover:border-blue-500">Screener</Link>
                            <Link to="/iv-analysis" onClick={closeMobileMenu} className="mobile-nav-link pl-4 border-l-2 border-transparent hover:border-blue-500">IV Analysis</Link>

                            <div className="font-semibold text-xs text-slate-400 uppercase tracking-wider mt-4 mb-2">Assets</div>
                            <Link to="/currency" onClick={closeMobileMenu} className="mobile-nav-link pl-4 border-l-2 border-transparent hover:border-blue-500">Currency/Forex</Link>
                            <Link to="/crypto" onClick={closeMobileMenu} className="mobile-nav-link pl-4 border-l-2 border-transparent hover:border-blue-500">Crypto</Link>
                            <Link to="/commodity" onClick={closeMobileMenu} className="mobile-nav-link pl-4 border-l-2 border-transparent hover:border-blue-500">Commodity</Link>
                            <Link to="/etf" onClick={closeMobileMenu} className="mobile-nav-link pl-4 border-l-2 border-transparent hover:border-blue-500">ETFs</Link>
                            <Link to="/bond" onClick={closeMobileMenu} className="mobile-nav-link pl-4 border-l-2 border-transparent hover:border-blue-500">Bonds</Link>

                            <div className="font-semibold text-xs text-slate-400 uppercase tracking-wider mt-4 mb-2">Tools</div>
                            <Link to="/calculators" onClick={closeMobileMenu} className="mobile-nav-link pl-4 border-l-2 border-transparent hover:border-blue-500">Calculators</Link>
                            <Link to="/daily-quiz" onClick={closeMobileMenu} className="mobile-nav-link pl-4 border-l-2 border-transparent hover:border-blue-500">Daily Quiz</Link>
                            <Link to="/links" onClick={closeMobileMenu} className="mobile-nav-link pl-4 border-l-2 border-transparent hover:border-blue-500">All Links</Link>
                            <Link to="/academy" onClick={closeMobileMenu} className="mobile-nav-link pl-4 border-l-2 border-transparent hover:border-blue-500">Academy</Link>

                            <div className="font-semibold text-xs text-slate-400 uppercase tracking-wider mt-4 mb-2">Account</div>
                            <Link to="/portfolio" onClick={closeMobileMenu} className="mobile-nav-link pl-4 border-l-2 border-transparent hover:border-blue-500">Portfolio</Link>
                            <Link to="/watchlist" onClick={closeMobileMenu} className="mobile-nav-link pl-4 border-l-2 border-transparent hover:border-blue-500">Watchlist</Link>
                            <Link to="/alerts" onClick={closeMobileMenu} className="mobile-nav-link pl-4 border-l-2 border-transparent hover:border-blue-500">Alerts</Link>
                            <Link to="/community" onClick={closeMobileMenu} className="mobile-nav-link pl-4 border-l-2 border-transparent hover:border-blue-500">Community</Link>

                            <div className="border-t border-slate-200 dark:border-slate-800 my-4 pt-4">
                                <button
                                    onClick={() => { setDonationModalOpen(true); closeMobileMenu(); }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 text-left mb-2"
                                >
                                    <Heart className="w-5 h-5 fill-pink-600 dark:fill-pink-400" /> Donate
                                </button>
                                <Link to="/profile" onClick={closeMobileMenu} className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 mb-2">
                                    <User className="w-5 h-5" /> Profile
                                </Link>
                                <button onClick={() => { handleSignOut(); closeMobileMenu(); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-left">
                                    <LogOut className="w-5 h-5" /> Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
                <Breadcrumbs />
                <Outlet />
            </main>

            <Footer />



            <MarketPulse />
            <AIAssistant />
            <FloatingActions />
            <DonationModal isOpen={donationModalOpen} onClose={() => setDonationModalOpen(false)} />
        </div>
    );
}
