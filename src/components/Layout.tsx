import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { TrendingUp, Globe, Newspaper, Zap, BarChart2, Activity, Users, Filter, GraduationCap, Heart, User, Settings as SettingsIcon, LogOut, Menu, X, Star, Briefcase, Bell, Calendar, TrendingUpIcon, Link as LinkIcon, Calculator, Brain, Shield } from 'lucide-react';
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
            // 1. Clear Application State
            localStorage.removeItem('demo_user');
            localStorage.removeItem('upstox_access_token');
            localStorage.removeItem('upstox_refresh_token');

            // 2. Clear Supabase Tokens (Manual Fail-safe)
            // This ensures useAuth doesn't automatically re-login the user on reload
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
                    localStorage.removeItem(key);
                }
            });

            // 3. Dispatch Events to update UI immediately
            window.dispatchEvent(new Event('demo_login'));
            window.dispatchEvent(new Event('storage'));

            // 4. API Sign Out (best effort, don't block if network fails)
            await supabase.auth.signOut().catch((err: Error) => console.warn('Supabase signout suppressed:', err));

        } catch (error) {
            console.error('Sign out logic error:', error);
        } finally {
            // 5. Hard Redirect (Replace history to prevent back-button return)
            console.log('Redirecting to landing page...');
            window.location.replace('/');
        }
    };

    const isActive = (path: string) => location.pathname === path;

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 flex flex-col">
            <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>

                            <Link to="/" className="flex items-center gap-2 flex-shrink-0" onClick={closeMobileMenu}>
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent whitespace-nowrap">
                                    Fantastic Finance
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-0.5 flex-wrap">
                            <Link
                                to="/markets"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/markets')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <Globe className="w-4 h-4" />
                                Markets
                            </Link>
                            <Link
                                to="/news"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/news')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <Newspaper className="w-4 h-4" />
                                News
                            </Link>
                            <Link
                                to="/strategy"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/strategy')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <Zap className="w-4 h-4" />
                                Strategy
                            </Link>
                            <Link
                                to="/charts"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/charts')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <BarChart2 className="w-4 h-4" />
                                Charts
                            </Link>
                            <Link
                                to="/straddle"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/straddle')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <Activity className="w-4 h-4" />
                                Premium
                            </Link>
                            <Link
                                to="/option-chain"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/option-chain')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <Activity className="w-4 h-4" />
                                Options
                            </Link>
                            <Link
                                to="/iv-analysis"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/iv-analysis')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <TrendingUp className="w-4 h-4" />
                                IV Analysis
                            </Link>
                            <Link
                                to="/scanner"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/scanner')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <Filter className="w-4 h-4" />
                                Scanner
                            </Link>
                            <Link
                                to="/technical"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/technical')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <Activity className="w-4 h-4" />
                                Technical
                            </Link>
                            <Link
                                to="/community"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/community')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <Users className="w-4 h-4" />
                                Community
                            </Link>
                            <Link
                                to="/analytics"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/analytics')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <BarChart2 className="w-4 h-4" />
                                Analytics
                            </Link>
                            <Link
                                to="/screener"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/screener')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <Filter className="w-4 h-4" />
                                Screener
                            </Link>
                            <Link
                                to="/watchlist"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/watchlist')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <Star className="w-4 h-4" />
                                Watchlist
                            </Link>
                            <Link
                                to="/portfolio"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/portfolio')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <Briefcase className="w-4 h-4" />
                                Portfolio
                            </Link>
                            <Link
                                to="/alerts"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/alerts')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <Bell className="w-4 h-4" />
                                Alerts
                            </Link>
                            <Link
                                to="/calendar"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/calendar')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <Calendar className="w-4 h-4" />
                                Calendar
                            </Link>
                            <Link
                                to="/ipo"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/ipo')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <TrendingUpIcon className="w-4 h-4" />
                                IPO
                            </Link>
                            <Link
                                to="/links"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/links')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <LinkIcon className="w-4 h-4" />
                                Links
                            </Link>
                            <Link
                                to="/calculators"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/calculators')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <Calculator className="w-4 h-4" />
                                Calculators
                            </Link>
                            <Link
                                to="/etf"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/etf')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <BarChart2 className="w-4 h-4" />
                                ETF
                            </Link>
                            <Link
                                to="/bond"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/bond')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <Shield className="w-4 h-4" />
                                Bond
                            </Link>
                            <Link
                                to="/currency"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/currency')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <Globe className="w-4 h-4" />
                                Currency
                            </Link>
                            <Link
                                to="/commodity"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/commodity')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <Zap className="w-4 h-4" />
                                Commodity
                            </Link>
                            <Link
                                to="/daily-quiz"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/daily-quiz')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <Brain className="w-4 h-4" />
                                Quick Quiz
                            </Link>
                            <Link
                                to="/academy"
                                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition font-medium text-xs whitespace-nowrap ${isActive('/academy')
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <GraduationCap className="w-4 h-4" />
                                Academy
                            </Link>
                        </div>

                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <div className="px-4 py-2 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
                            <Link to="/markets" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Markets</Link>
                            <Link to="/news" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">News</Link>
                            <Link to="/strategy" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Strategy</Link>
                            <Link to="/charts" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Charts</Link>
                            <Link to="/straddle" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Premium</Link>
                            <Link to="/option-chain" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Options</Link>
                            <Link to="/iv-analysis" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">IV Analysis</Link>
                            <Link to="/scanner" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Scanner</Link>
                            <Link to="/technical" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Technical</Link>
                            <Link to="/community" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Community</Link>
                            <Link to="/analytics" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Analytics</Link>
                            <Link to="/screener" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Screener</Link>
                            <Link to="/watchlist" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Watchlist</Link>
                            <Link to="/portfolio" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Portfolio</Link>
                            <Link to="/alerts" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Alerts</Link>
                            <Link to="/calendar" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Calendar</Link>
                            <Link to="/ipo" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">IPO</Link>
                            <Link to="/links" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Important Links</Link>
                            <Link to="/calculators" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Calculators</Link>
                            <Link to="/etf" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">ETF</Link>
                            <Link to="/bond" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Bond</Link>
                            <Link to="/currency" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Currency</Link>
                            <Link to="/commodity" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Commodity</Link>
                            <Link to="/daily-quiz" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Quick Quiz</Link>
                            <Link to="/academy" onClick={closeMobileMenu} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Academy</Link>

                            <div className="border-t border-slate-200 dark:border-slate-800 my-2 pt-2">
                                <Link to="/profile" onClick={closeMobileMenu} className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                                    <User className="w-5 h-5" /> Profile
                                </Link>
                                <Link to="/settings" onClick={closeMobileMenu} className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                                    <SettingsIcon className="w-5 h-5" /> Settings
                                </Link>

                                <button onClick={() => { handleSignOut(); closeMobileMenu(); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-left">
                                    <LogOut className="w-5 h-5" /> Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
                <Breadcrumbs />
                <Outlet />
            </main>


            <Footer />

            {/* Floating User Menu - Desktop Only - Right Side */}
            <div className="hidden lg:flex fixed top-20 right-6 z-40 flex-col gap-3">
                <Link
                    to="/profile"
                    className="p-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:scale-110"
                    title="Profile"
                >
                    <User className="w-5 h-5" />
                </Link>
                <Link
                    to="/settings"
                    className="p-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:scale-110"
                    title="Settings"
                >
                    <SettingsIcon className="w-5 h-5" />
                </Link>

                <button
                    onClick={handleSignOut}
                    className="p-3 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:scale-110"
                    title="Sign Out"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>

            {/* Floating Donate Button - Left Side - Above AI Assistant */}
            <div className="hidden lg:flex fixed bottom-28 left-6 z-40">
                <button
                    onClick={() => setDonationModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full shadow-lg hover:from-pink-600 hover:to-red-600 transition-all duration-300 hover:scale-110"
                    title="Support Us"
                >
                    <Heart className="w-5 h-5 fill-white" />
                    <span className="font-semibold">Donate</span>
                </button>
            </div>

            <MarketPulse />
            <AIAssistant />
            <FloatingActions />
            <DonationModal isOpen={donationModalOpen} onClose={() => setDonationModalOpen(false)} />

            {/* DEBUG BANNER: Remove after verification */}
            <DebugBanner />
        </div>
    );
}

// Temporary Debug Component to verify deployment and API connection
function DebugBanner() {
    return (
        <div className="fixed bottom-0 left-0 w-full bg-red-600 text-white text-[10px] font-bold py-1 z-50 text-center flex justify-center gap-6 items-center shadow-lg safe-area-bottom">
            <span className="bg-white/20 px-2 py-0.5 rounded">DEPLOYMENT: v2.5 (STATIC FIX)</span>
            <span>If you see this, the code is updating.</span>
            <span>Target API: /api/stock</span>
        </div>
    );
}
