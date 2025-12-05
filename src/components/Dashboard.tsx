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
    <div className="space-y-6">
      {/* New: Personalized Welcome Hero */}
      <WelcomeHero userName="Trader" />

      {/* New: Quick Actions */}
      <QuickActionCenter />

      {/* New: Performance Dashboard & Active Positions Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceDashboard />
        <ActivePositions />
      </div>

      {/* Market Ticker */}
      <div className="bg-slate-900 text-white p-3 rounded-lg overflow-hidden flex items-center gap-6 shadow-md">
        <span className="font-bold text-blue-400 text-sm whitespace-nowrap">MARKETS LIVE</span>
        <div className="flex gap-8 animate-marquee whitespace-nowrap">
          {marketIndices.map((idx) => (
            <div key={idx.name} className="flex items-center gap-2 text-sm">
              <span className="font-medium text-slate-300">{idx.name}</span>
              <span>{idx.price?.toLocaleString()}</span>
              <span className={idx.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}>
                {idx.changePercent > 0 ? '+' : ''}{idx.changePercent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Portfolio Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-blue-100 font-medium mb-1">Total Portfolio Value</p>
              <h2 className="text-4xl font-bold">₹ {portfolio.currentValue.toLocaleString()}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 rounded text-sm font-medium flex items-center gap-1 ${portfolio.totalPnL >= 0 ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
                  }`}>
                  {portfolio.totalPnL >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                  {portfolio.totalPnL >= 0 ? '+' : ''}₹{Math.abs(portfolio.totalPnL).toLocaleString()} ({metrics.totalReturn.toFixed(2)}%)
                </span>
                <span className="text-blue-200 text-sm">Total Return</span>
              </div>
            </div>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-700">Available Funds</h3>
              <button className="text-blue-600 text-sm font-medium hover:underline">Add Funds</button>
            </div>
            <div className="text-2xl font-bold text-slate-900">₹ {portfolio.cashBalance.toLocaleString()}</div>
            <p className="text-slate-500 text-sm mt-1">Ready to deploy</p>
            <Link to="/transactions" className="mt-4 w-full block text-center bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition">
              View Transactions
            </Link>
          </div>

          {/* Top Movers/Losers Mini Widget */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-700 dark:text-white flex items-center gap-2">
                {showLosers ? <TrendingDown className="w-4 h-4 text-red-600" /> : <TrendingUp className="w-4 h-4 text-green-600" />}
                {showLosers ? 'Top Losers' : 'Top Gainers'}
              </h3>
              <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5">
                <button
                  onClick={() => setShowLosers(false)}
                  className={`px-2 py-1 text-xs font-medium rounded transition ${!showLosers
                    ? 'bg-white dark:bg-slate-600 text-green-600 dark:text-green-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                    }`}
                >
                  Gainers
                </button>
                <button
                  onClick={() => setShowLosers(true)}
                  className={`px-2 py-1 text-xs font-medium rounded transition ${showLosers
                    ? 'bg-white dark:bg-slate-600 text-red-600 dark:text-red-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                    }`}
                >
                  Losers
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {displayStocks.map((stock) => (
                <Link key={stock.symbol} to={`/stock/${stock.symbol}`} className="flex justify-between items-center text-sm hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded-lg transition">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{stock.symbol}</span>
                  <div className="text-right">
                    <div className="font-medium dark:text-white">{stock.price.toLocaleString()}</div>
                    <div className={stock.change >= 0 ? 'text-green-600 text-xs font-semibold' : 'text-red-600 text-xs font-semibold'}>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FIIDIIDashboard />
        <IPOWatch />
      </div>

      {/* Phase 2: Strategy Recommendations & Portfolio Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StrategyRecommendations />
        <PortfolioInsights />
      </div>

      {/* Achievement & Gamification */}
      <AchievementBadges />

      {/* Bottom Section: Learning & Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LearningCorner />
        <TradingCalendar />
      </div>

      {/* Original: Market News & Quick Links (Optional - can keep or remove) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Market News */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-purple-600" /> Market News
            </h3>
            <Link to="/community" className="text-blue-600 text-sm hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {newsSnippets.map((news) => (
              <div key={news.id} className="flex gap-3 group cursor-pointer">
                <div className="w-1 h-full bg-slate-200 rounded-full group-hover:bg-blue-500 transition-colors"></div>
                <div>
                  <h4 className="text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors">{news.title}</h4>
                  <span className="text-xs text-slate-400">{news.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xl mb-2">Explore Analytics</h3>
            <p className="text-slate-300 text-sm mb-6">Deep dive into Option Chains, Heatmaps, and Advanced Charts.</p>
          </div>
          <Link to="/analytics" className="self-start bg-white text-slate-900 px-6 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-blue-50 transition">
            Go to Analytics <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* AdSense Display Ad */}
      <DisplayAd adSlot="1234567890" className="mt-6" />
    </div>
  );
}