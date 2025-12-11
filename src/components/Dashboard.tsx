import { TrendingUp, DollarSign, ArrowRight, Newspaper, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import PortfolioChart from './PortfolioChart';
import { useLivePrices } from '../context/LivePriceContext';
import { usePaperTrading } from '../context/PaperTradingContext';
import { useState } from 'react';
import FIIDIIDashboard from './FIIDIIDashboard';
import IPOWatch from './IPOWatch';
import WelcomeHero from './WelcomeHero';
import QuickActionCenter from './QuickActionCenter';
import PerformanceDashboard from './PerformanceDashboard';
import ActivePositions from './ActivePositions';
import StrategyRecommendations from './StrategyRecommendations';
import PortfolioInsights from './PortfolioInsights';
import AchievementBadges from './AchievementBadges';
import LearningCorner from './LearningCorner';
import TradingCalendar from './TradingCalendar';
import { DisplayAd } from './AdSense';

export default function Dashboard() {
  const { prices } = useLivePrices();
  const { portfolio, getPerformanceMetrics } = usePaperTrading();
  const metrics = getPerformanceMetrics();
  const [showLosers, setShowLosers] = useState(false);

  // Dynamic Market Indices
  const marketIndices = [
    { name: 'NIFTY 50', ...prices['NIFTY 50'] || { price: 19500, change: 0, changePercent: 0 } },
    { name: 'BANKNIFTY', ...prices['BANKNIFTY'] || { price: 44500, change: 0, changePercent: 0 } },
    { name: 'BTC', ...prices['BTC'] || { price: 35000, change: 0, changePercent: 0 } },
    { name: 'ETH', ...prices['ETH'] || { price: 1800, change: 0, changePercent: 0 } },
  ];

  // Dynamic Top Movers (using the same mock list but with live prices)
  const topMoversList = ['RELIANCE', 'TATASTEEL', 'INFY', 'HDFCBANK'];
  const stocksData = topMoversList.map(symbol => {
    const data = prices[symbol] || { price: 0, changePercent: 0 };
    return {
      symbol,
      price: data.price,
      change: data.changePercent
    };
  });

  // Sort by gainers (positive change) or losers (negative change)
  const displayStocks = showLosers
    ? stocksData.sort((a, b) => a.change - b.change).slice(0, 4) // Most negative first
    : stocksData.sort((a, b) => b.change - a.change).slice(0, 4); // Most positive first

  const newsSnippets = [
    { id: 1, title: "RBI keeps repo rate unchanged at 6.5%", time: "2h ago" },
    { id: 2, title: "Tech stocks rally as AI demand surges", time: "4h ago" },
    { id: 3, title: "Oil prices stabilize amidst global tensions", time: "5h ago" },
  ];

  return (
    <div className="space-y-6 animate-in">
      {/* New: Personalized Welcome Hero */}
      <div className="slide-up">
        <WelcomeHero userName="Trader" />
      </div>

      {/* New: Quick Actions */}
      <div className="slide-up delay-100">
        <QuickActionCenter />
      </div>

      {/* New: Performance Dashboard & Active Positions Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 slide-up delay-200">
        <PerformanceDashboard />
        <ActivePositions />
      </div>

      {/* Market Ticker */}
      <div className="bg-slate-900 text-white p-3 rounded-lg overflow-hidden flex items-center gap-6 shadow-md slide-up delay-300">
        <div className="flex items-center gap-2 z-10 bg-slate-900 pr-4">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="font-bold text-blue-400 text-sm whitespace-nowrap">MARKETS LIVE</span>
        </div>
        <div className="flex gap-8 animate-marquee whitespace-nowrap">
          {marketIndices.map((idx) => (
            <div key={idx.name} className="flex items-center gap-2 text-sm hover:bg-white/10 px-2 py-1 rounded transition">
              <span className="font-medium text-slate-300">{idx.name}</span>
              <span className="font-mono">{idx.price?.toLocaleString()}</span>
              <span className={`font-mono ${idx.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {idx.changePercent > 0 ? '+' : ''}{idx.changePercent}%
              </span>
            </div>
          ))}
          {/* Duplicate for seamless marquee */}
          {marketIndices.map((idx) => (
            <div key={`${idx.name}-dup`} className="flex items-center gap-2 text-sm hover:bg-white/10 px-2 py-1 rounded transition">
              <span className="font-medium text-slate-300">{idx.name}</span>
              <span className="font-mono">{idx.price?.toLocaleString()}</span>
              <span className={`font-mono ${idx.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {idx.changePercent > 0 ? '+' : ''}{idx.changePercent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 slide-up delay-300">
        {/* Main Portfolio Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl transform transition hover:scale-[1.01] duration-300">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-blue-100 font-medium mb-1">Total Portfolio Value</p>
              <h2 className="text-4xl font-bold tracking-tight">₹ {portfolio.currentValue.toLocaleString()}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 rounded-lg text-sm font-bold flex items-center gap-1 backdrop-blur-sm ${portfolio.totalPnL >= 0 ? 'bg-green-500/20 text-green-100 border border-green-500/30' : 'bg-red-500/20 text-red-100 border border-red-500/30'
                  }`}>
                  {portfolio.totalPnL >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
                  {portfolio.totalPnL >= 0 ? '+' : ''}₹{Math.abs(portfolio.totalPnL).toLocaleString()} ({metrics.totalReturn.toFixed(2)}%)
                </span>
                <span className="text-blue-200 text-sm font-medium">Total Return</span>
              </div>
            </div>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md shadow-inner border border-white/10">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="h-48">
            <PortfolioChart />
          </div>
        </div>

        {/* Quick Stats / Watchlist */}
        <div className="space-y-6">
          {/* Account Balance */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-700 dark:text-white">Available Funds</h3>
              <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">Add Funds</button>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">₹ {portfolio.cashBalance.toLocaleString()}</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Ready to deploy</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link to="/transactions" className="flex items-center justify-center py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                History
              </Link>
              <Link to="/portfolio" className="flex items-center justify-center py-2.5 rounded-lg text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition shadow-lg shadow-slate-200 dark:shadow-none">
                Portfolio
              </Link>
            </div>
          </div>

          {/* Top Movers/Losers Mini Widget */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-700 dark:text-white flex items-center gap-2">
                {showLosers ? <TrendingDown className="w-4 h-4 text-red-600" /> : <TrendingUp className="w-4 h-4 text-green-600" />}
                {showLosers ? 'Top Losers' : 'Top Gainers'}
              </h3>
              <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setShowLosers(false)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${!showLosers
                    ? 'bg-white dark:bg-slate-600 text-green-600 dark:text-green-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                >
                  Gainers
                </button>
                <button
                  onClick={() => setShowLosers(true)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${showLosers
                    ? 'bg-white dark:bg-slate-600 text-red-600 dark:text-red-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                >
                  Losers
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {displayStocks.map((stock) => (
                <Link key={stock.symbol} to={`/stock/${stock.symbol}`} className="flex justify-between items-center text-sm hover:bg-slate-50 dark:hover:bg-slate-700 p-2.5 rounded-xl transition group">
                  <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{stock.symbol}</span>
                  <div className="text-right">
                    <div className="font-medium text-slate-900 dark:text-white">{stock.price.toLocaleString()}</div>
                    <div className={stock.change >= 0 ? 'text-green-600 text-xs font-bold' : 'text-red-600 text-xs font-bold'}>
                      {stock.change > 0 ? '+' : ''}{stock.change}%
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Indian Market Specifics: FII/DII & IPOs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 slide-up delay-300">
        <FIIDIIDashboard />
        <IPOWatch />
      </div>

      {/* Phase 2: Strategy Recommendations & Portfolio Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 slide-up delay-300">
        <StrategyRecommendations />
        <PortfolioInsights />
      </div>

      {/* Achievement & Gamification */}
      <div className="slide-up delay-300">
        <AchievementBadges />
      </div>

      {/* Bottom Section: Learning & Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 slide-up delay-300">
        <LearningCorner />
        <TradingCalendar />
      </div>

      {/* Original: Market News & Quick Links (Optional - can keep or remove) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 slide-up delay-300">
        {/* Market News */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-purple-600" /> Market News
            </h3>
            <Link to="/community" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {newsSnippets.map((news) => (
              <div key={news.id} className="flex gap-4 group cursor-pointer p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                <div className="w-1 h-12 bg-slate-200 dark:bg-slate-600 rounded-full group-hover:bg-gradient-to-b group-hover:from-blue-500 group-hover:to-purple-500 transition-all"></div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">{news.title}</h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">{news.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl text-white shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 group-hover:opacity-30 transition duration-700"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 group-hover:opacity-30 transition duration-700"></div>

          <div className="relative z-10">
            <h3 className="font-bold text-2xl mb-2">Explore Analytics</h3>
            <p className="text-slate-300 text-sm mb-6 max-w-xs leading-relaxed">Deep dive into Option Chains, Heatmaps, and Advanced Charts with professional grade tools.</p>
          </div>
          <Link to="/analytics" className="relative z-10 self-start bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-50 transition shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transform duration-200">
            Go to Analytics <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* AdSense Display Ad */}
      <DisplayAd adSlot="1234567890" className="mt-8 opacity-80 hover:opacity-100 transition" />
    </div>
  );
}