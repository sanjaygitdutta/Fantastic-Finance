import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    type?: string;
    canonicalUrl?: string;
}

export default function SEO({
    title = "Live Stock Market Dashboard & AI Analysis | Fantastic Finance",
    description = "Track live Indian stock market data (NIFTY, SENSEX), analyze options chains, and get AI-powered trading signals. The best platform for derivatives trading and market analysis.",
    keywords = "stock market, share market, indian stock market, nse live, bank nifty option chain, live market data, nifty 50, bank nifty, options trading, option chain, ai trading, trading platform, stock analysis, black scholes calculator, markets, news, strategy, charts, premium, iv analysis, scanner, technical, community, analytics, screener, watchlist, portfolio, alerts, calendar, ipo, links, calculators, etf, bond, currency, commodity, quick quiz, world indices, indian indices, sectoral performance, top stocks, indices futures, real-time commodities, forex cross rates, cryptocurrencies, bonds & rates, tradingview, financial news room, derivatives strategy builder, backtest strategies, bullish strategies, bearish strategies, neutral strategies, long call, short put, bull call spread, bull put spread, call ratio spread, long put, short call, bear put spread, bear call spread, put ratio spread, long straddle, short straddle, long strangle, short strangle, iron condor, iron butterfly, long call butterfly, calendar spread, advanced charts, greeks, implied volatility, zerodha alternative, upstox option chain, angel one trading, groww stocks, learn option trading, stock market course, trading for beginners, f&o tutorial, rsi indicator, macd crossover, moving averages, bollinger bands, pivot points, share bazar, online paise kaise kamaye, stock market tips hindi, nifty target tomorrow, market prediction today, bank nifty prediction, StockMarket, Investing, Trading, FinancialFreedom, WealthManagement, MarketAnalysis, InvestmentTips, TradingStrategy, FinanceNews, EquityMarket, NSE, BSE, StockMarketIndia, IntradayTrading, OptionsTrading, SwingTrading, PortfolioManagement, MarketTrends, Sensex, Nifty, StockTips, FinancialEducation, InvestorMindset, MoneyManagement, InvestmentStrategy, TradingCommunity, FinancialGoals, WealthBuilding, EconomicNews, StockMarketUpdate, candlestick patterns, price action trading, how to read option chain, swing trading strategies, intraday tips, trading psychology, zerodha brokerage, angel one login, 5paisa trading, dhan option trader, kotak securities, groww app, paytm money stocks, fibonacci retracement, supertrend indicator, vwap trading, volume profile, support and resistance, breakout trading, share market kya hai, option trading kaise kare, intraday trading tips hindi, nifty kal kaisa rahega, best stocks to buy hindi, theoretical option prices, performance metrics calculator, portfolio performance analysis, sharpe ratio, sortino ratio, calmar ratio, treynor ratio, information ratio, gain to pain ratio, profit factor, win rate analysis, payoff ratio, risk adjusted returns, pcr analysis, put call ratio sentiment, implied volatility surface, margin calculator, future margin calculator, options profit calculator, option greeks calculator, breakeven calculator",
    image = "https://fantasticfinancialadvisory.com/og-image.jpg",
    type = "website",
    canonicalUrl
}: SEOProps) {
    const location = useLocation();
    const url = canonicalUrl || `https://fantasticfinancialadvisory.com${location.pathname}`;
    const siteTitle = "Fantastic Finance";

    // Ensure title has the site name if not already present
    const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />
        </Helmet>
    );
}
