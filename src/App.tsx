import { useState, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import SEO from './components/SEO';
import { useAnalytics } from './hooks/useAnalytics';
import Footer from './components/Footer';

import { useAntiScraping } from './hooks/useAntiScraping';

// Lazy load landing page components for better performance
const Hero = lazy(() => import('./components/Hero'));
const Features = lazy(() => import('./components/Features'));
const Statistics = lazy(() => import('./components/Statistics'));
const HowItWorks = lazy(() => import('./components/HowItWorks'));
const FinalCTA = lazy(() => import('./components/FinalCTA'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const AuthModal = lazy(() => import('./components/AuthModal'));

// Lazy load components for performance
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
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Loading Fallback Component
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

function App() {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Initialize Analytics
  useAnalytics();

  // Initialize Security Shield (Anti-Scraping)
  useAntiScraping();


  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/community" element={<Community />} />
            <Route path="/callback" element={<AuthCallback />} />
            <Route path="/" element={<Layout />}>
              <Route index element={
                <>
                  <SEO title="Live Stock Market Dashboard & AI Analysis" />
                  <Dashboard />
                </>
              } />

              <Route path="goals" element={<Goals />} />
              <Route path="markets" element={
                <>
                  <SEO
                    title="Real-time Stock Market Data - NIFTY, SENSEX"
                    description="Track live NIFTY 50, BANKNIFTY, and SENSEX data. Get real-time market updates, top gainers/losers, and sector performance."
                  />
                  <MarketData />
                </>
              } />
              <Route path="news" element={<NewsRoom />} />
              <Route path="header-demo" element={
                <>
                  <SEO title="Header Concepts" />
                  <HeaderDemo />
                </>
              } />
              <Route path="analytics" element={
                <>
                  <SEO
                    title="Advanced Stock Market Analytics & Options Chain"
                    description="Deep dive into market analytics with our advanced options chain viewer, PCR analysis, and multi-strike comparisons."
                  />
                  <Analytics />
                </>
              } />
              <Route path="stock/:symbol" element={<StockDetails />} />
              <Route path="strategy" element={<StrategyBuilder />} />
              <Route path="charts" element={<AdvancedCharts />} />
              <Route path="straddle" element={<StraddleChart />} />
              <Route path="option-chain" element={<OptionChainViewer />} />
              <Route path="iv-analysis" element={<IVAnalysis />} />
              <Route path="scanner" element={<OptionsScanner />} />
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
              <Route path="daily-quiz" element={<DailyQuiz />} />
              <Route path="academy" element={<Academy />} />
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
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Admin Routes - Accessible without regular user auth */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } />

            {/* Main App Routes */}
            <Route path="*" element={
              <>
                <SEO />
                <Navigation onLoginClick={() => handleAuthClick('login')} />
                <Suspense fallback={<PageLoader />}>
                  <Hero onSignUpClick={() => handleAuthClick('signup')} />

                  {/* AI Recommendations Section */}
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 mb-20">
                    <StrategyRecommendations />
                  </div>

                  <Features />
                  <Statistics />
                  <HowItWorks />
                  <FinalCTA onSignUpClick={() => handleAuthClick('signup')} />
                  <About />
                  <Contact />
                  <Footer />
                  <AIAssistant />
                  <AuthModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                    mode={authMode}
                    onModeChange={setAuthMode}
                  />
                </Suspense>
              </>
            } />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;