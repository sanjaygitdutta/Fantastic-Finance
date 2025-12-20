import { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import SEO from './components/SEO';
import { useAnalytics } from './hooks/useAnalytics';
import Footer from './components/Footer';
import './index.css';
import { useTheme } from './context/ThemeContext';
import { useAntiScraping } from './hooks/useAntiScraping';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Lazy load landing page components
const Hero = lazy(() => import('./components/Hero'));
const Features = lazy(() => import('./components/Features'));
const Statistics = lazy(() => import('./components/Statistics'));
const HowItWorks = lazy(() => import('./components/HowItWorks'));
const FinalCTA = lazy(() => import('./components/FinalCTA'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const AuthModal = lazy(() => import('./components/AuthModal'));

const LandingPageCalendar = lazy(() => import('./components/LandingPageCalendar'));

const Dashboard = lazy(() => import('./components/Dashboard'));

const Community = lazy(() => import('./components/Community'));
const Goals = lazy(() => import('./components/Goals'));
const MarketData = lazy(() => import('./components/MarketData'));
const Analytics = lazy(() => import('./components/Analytics'));
const StockDetails = lazy(() => import('./components/StockDetails'));
const StrategyBuilder = lazy(() => import('./components/StrategyBuilder'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const TradingTerminal = lazy(() => import('./components/TradingTerminal'));
const Learning = lazy(() => import('./components/Learning'));
const Gamification = lazy(() => import('./components/Gamification'));
const SocialTrading = lazy(() => import('./components/SocialTrading'));
const PaperPortfolio = lazy(() => import('./components/PaperPortfolio'));
const StockScreener = lazy(() => import('./components/StockScreener'));
const NotFound = lazy(() => import('./components/NotFound'));
const NewsRoom = lazy(() => import('./components/NewsRoom'));
const AdvancedCharts = lazy(() => import('./components/AdvancedCharts'));
const TechnicalAnalysis = lazy(() => import('./components/TechnicalAnalysis'));
const Academy = lazy(() => import('./components/Academy'));
const ArticleDetail = lazy(() => import('./components/ArticleDetail'));
const StraddleChart = lazy(() => import('./components/StraddleChart'));
const Donate = lazy(() => import('./components/Donate'));
const Settings = lazy(() => import('./components/Settings'));
const OptionChainViewer = lazy(() => import('./components/OptionChainViewer'));
const IVAnalysis = lazy(() => import('./components/IVAnalysis'));
const OptionsScanner = lazy(() => import('./components/OptionsScanner'));
const ActivePositions = lazy(() => import('./components/ActivePositions'));
const AlertsCenter = lazy(() => import('./components/AlertsCenter'));
const CourseDetail = lazy(() => import('./components/CourseDetail'));
const StrategyWizard = lazy(() => import('./components/StrategyWizard'));
const StrategyScreener = lazy(() => import('./components/StrategyScreener'));
const Profile = lazy(() => import('./components/Profile'));
const AuthCallback = lazy(() => import('./components/AuthCallback'));
const Disclaimer = lazy(() => import('./components/Disclaimer'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./components/TermsAndConditions'));
const AdminLogin = lazy(() => import('./components/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const Watchlist = lazy(() => import('./components/Watchlist'));
const EconomicCalendar = lazy(() => import('./components/EconomicCalendar'));
const IPOPage = lazy(() => import('./components/IPOPage'));
const ImportantLinks = lazy(() => import('./components/ImportantLinks'));
const CalculatorHub = lazy(() => import('./components/CalculatorHub'));
const BlackScholesCalculator = lazy(() => import('./components/BlackScholesCalculator'));
const MarginCalculator = lazy(() => import('./components/MarginCalculator'));
const DailyQuiz = lazy(() => import('./components/DailyQuiz'));
const ETF = lazy(() => import('./components/ETF'));
const Bond = lazy(() => import('./components/Bond'));
const Currency = lazy(() => import('./components/Currency'));
const Commodity = lazy(() => import('./components/Commodity'));
const Review = lazy(() => import('./components/Review'));
const Brokers = lazy(() => import('./pages/Brokers'));
const StrategyRecommendations = lazy(() => import('./components/StrategyRecommendations'));
const AIAssistant = lazy(() => import('./components/AIAssistant'));
const HeaderDemo = lazy(() => import('./pages/HeaderDemo'));
const WallStreet = lazy(() => import('./pages/WallStreet'));
const CryptoMarket = lazy(() => import('./pages/CryptoMarket'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

function App() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  useAnalytics();
  useAntiScraping();

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  useEffect(() => {
    // Auto-trigger auth modal for restricted paths when not logged in
    const restrictedPaths = ['/markets', '/wallstreet', '/crypto', '/news', '/strategy', '/analytics', '/portfolio', '/calendar'];
    const isRestricted = restrictedPaths.some(p => window.location.pathname.startsWith(p));
    const isPublicPath = ['/', '/terms', '/privacy', '/disclaimer'].includes(window.location.pathname);

    if (!user && (isRestricted || !isPublicPath) && window.location.pathname !== '/') {
      setShowAuthModal(true);
      setAuthMode('login');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Syncing with Markets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200 ${theme}`}>
      <ScrollToTop />
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {user ? (
              <>
                <Route path="/community" element={<Community />} />
                <Route path="/callback" element={<AuthCallback />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<><SEO title="Dashboard" /><Dashboard /></>} />
                  <Route path="goals" element={<Goals />} />
                  <Route path="markets" element={<><SEO title="Indian Stock Market Dashboard | NIFTY & SENSEX Live" description="Monitor live NIFTY 50 and SENSEX data with real-time updates. Track sectoral performance and top gainers on India's most advanced market dashboard." /><MarketData /></>} />
                  <Route path="wallstreet" element={<WallStreet />} />
                  <Route path="crypto" element={<CryptoMarket />} />
                  <Route path="news" element={<NewsRoom />} />
                  <Route path="header-demo" element={<HeaderDemo />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="stock/:symbol" element={<StockDetails />} />
                  <Route path="strategy" element={<><SEO title="Options Strategy Builder & Payoff Calculator" description="Build and simulate complex options strategies like Iron Condors and Butterfly spreads. Visualize risk-reward with our advanced payoff calculator." /><StrategyBuilder /></>} />
                  <Route path="charts" element={<AdvancedCharts />} />
                  <Route path="straddle" element={<StraddleChart />} />
                  <Route path="option-chain" element={<><SEO title="Live NIFTY & Bank NIFTY Option Chain with Greeks" description="Access real-time option chain data for NIFTY, Bank NIFTY and Stocks. View Greeks (Delta, Gamma, Theta, Vega) and PCR analytics instantly." schemaData={{
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": [{
                      "@type": "Question",
                      "name": "How to read an Option Chain?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "An option chain lists all available options contracts for a security. It displays strike prices, premiums, open interest (OI), and volume to help traders gauge market sentiment."
                      }
                    }, {
                      "@type": "Question",
                      "name": "What are Option Greeks?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Option Greeks like Delta, Gamma, Theta, and Vega measure the sensitivity of an option's price to changes in underlying price, time decay, and volatility."
                      }
                    }]
                  }} /><OptionChainViewer /></>} />
                  <Route path="iv-analysis" element={<><SEO title="Implied Volatility (IV) Analysis & Surface" description="Analyze Implied Volatility (IV) for NIFTY and stocks. Identify cheap and expensive options using IV percentile and rank tools." /><IVAnalysis /></>} />
                  <Route path="scanner" element={<><SEO title="Intraday Options Scanner & OI Analytics" description="Scan for high-oi stocks and intraday breakouts. Use our powerful scanner to find trading opportunities in NIFTY and Bank NIFTY." /><OptionsScanner /></>} />
                  <Route path="positions" element={<ActivePositions />} />
                  <Route path="alerts" element={<AlertsCenter />} />
                  <Route path="technical" element={<TechnicalAnalysis />} />
                  <Route path="portfolio" element={<Portfolio />} />
                  <Route path="paper-portfolio" element={<PaperPortfolio />} />
                  <Route path="watchlist" element={<Watchlist />} />
                  <Route path="calendar" element={<EconomicCalendar />} />
                  <Route path="ipo" element={<IPOPage />} />
                  <Route path="links" element={<ImportantLinks />} />
                  <Route path="calculators" element={<CalculatorHub />} />
                  <Route path="black-scholes" element={<BlackScholesCalculator />} />
                  <Route path="margin-calculator" element={<MarginCalculator />} />
                  <Route path="etf" element={<ETF />} />
                  <Route path="bond" element={<Bond />} />
                  <Route path="currency" element={<Currency />} />
                  <Route path="commodity" element={<Commodity />} />
                  <Route path="review" element={<Review />} />
                  <Route path="brokers" element={<Brokers />} />
                  <Route path="daily-quiz" element={<><SEO title="Quick Quiz | Test Your Trading Knowledge" description="Take our daily 5-minute stock market quiz to sharpen your trading skills. Earn points and climb the leaderboard." /><DailyQuiz /></>} />
                  <Route path="academy" element={<><SEO title="Stock Market Academy | Free Trading Courses" description="Learn option trading, technical analysis, and market basics from scratch. Free courses designed for Indian retail traders." /><Academy /></>} />
                  <Route path="article/:id" element={<ArticleDetail />} />
                  <Route path="course/:id" element={<CourseDetail />} />
                  <Route path="strategy-wizard" element={<StrategyWizard />} />
                  <Route path="strategy-screener" element={<StrategyScreener />} />
                  <Route path="donate" element={<Donate />} />
                  <Route path="trading" element={<TradingTerminal />} />
                  <Route path="learning" element={<Learning />} />
                  <Route path="gamification" element={<Gamification />} />
                  <Route path="social" element={<SocialTrading />} />
                  <Route path="screener" element={<StockScreener />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="disclaimer" element={<Disclaimer />} />
                  <Route path="privacy" element={<PrivacyPolicy />} />
                  <Route path="terms" element={<TermsAndConditions />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </>
            ) : (
              <>
                <Route path="/terms" element={<><SEO title="Terms" /><Navigation onLoginClick={() => handleAuthClick('login')} /><div className="pt-16"><TermsAndConditions /></div><Footer /><AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} mode={authMode} onModeChange={setAuthMode} /></>} />
                <Route path="/privacy" element={<><SEO title="Privacy" /><Navigation onLoginClick={() => handleAuthClick('login')} /><div className="pt-16"><PrivacyPolicy /></div><Footer /><AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} mode={authMode} onModeChange={setAuthMode} /></>} />
                <Route path="/disclaimer" element={<><SEO title="Disclaimer" /><Navigation onLoginClick={() => handleAuthClick('login')} /><div className="pt-16"><Disclaimer /></div><Footer /><AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} mode={authMode} onModeChange={setAuthMode} /></>} />

                <Route path="*" element={
                  <>
                    <SEO />
                    <Navigation onLoginClick={() => handleAuthClick('login')} />
                    <Suspense fallback={<PageLoader />}>
                      <Hero onSignUpClick={() => handleAuthClick('signup')} />
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 mb-20">
                        <StrategyRecommendations onAuthRequired={() => handleAuthClick('login')} />
                      </div>
                      <LandingPageCalendar />
                      <Features />
                      <Statistics />
                      <HowItWorks />
                      <FinalCTA onSignUpClick={() => handleAuthClick('signup')} />
                      <About />
                      <Contact />
                      <Footer />
                      <AIAssistant />
                      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} mode={authMode} onModeChange={setAuthMode} />
                    </Suspense>
                  </>
                } />
              </>
            )}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;