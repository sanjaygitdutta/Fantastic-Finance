import { memo } from 'react';
import { TVWidget } from './TVWidget';

// 1. Ticker Tape Widget (Global or Dashboard top)
export const TickerTapeWidget = memo(() => (
    <TVWidget
        height="46px"
        scriptHTML={{
            src: "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js",
            innerHTML: JSON.stringify({
                "symbols": [
                    { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500" },
                    { "proName": "FOREXCOM:NSXUSD", "title": "Nasdaq 100" },
                    { "proName": "FX_IDC:EURUSD", "title": "EUR/USD" },
                    { "proName": "BITSTAMP:BTCUSD", "title": "BTC/USD" },
                    { "proName": "BITSTAMP:ETHUSD", "title": "ETH/USD" },
                    { "description": "NIFTY 50", "proName": "NSE:NIFTY" },
                    { "description": "BANK NIFTY", "proName": "NSE:BANKNIFTY" },
                    { "description": "RELIANCE", "proName": "NSE:RELIANCE" }
                ],
                "showSymbolLogo": true,
                "colorTheme": "light",
                "isTransparent": false,
                "displayMode": "adaptive",
                "locale": "en"
            })
        }}
    />
));

// 2. Market Quotes Widget for Global Indices
export const GlobalIndicesWidget = memo(() => (
    <TVWidget
        height="500px"
        scriptHTML={{
            src: "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js",
            innerHTML: JSON.stringify({
                "width": "100%",
                "height": "100%",
                "symbolsGroups": [
                    {
                        "name": "Global Indices",
                        "symbols": [
                            { "name": "FOREXCOM:SPXUSD", "displayName": "S&P 500" },
                            { "name": "FOREXCOM:NSXUSD", "displayName": "Nasdaq 100" },
                            { "name": "FOREXCOM:DJI", "displayName": "Dow 30" },
                            { "name": "INDEX:NKY", "displayName": "Nikkei 225" },
                            { "name": "INDEX:DEU40", "displayName": "DAX Index" },
                            { "name": "INDEX:FTSE", "displayName": "FTSE 100" }
                        ]
                    },
                    {
                        "name": "Indian Indices",
                        "symbols": [
                            { "name": "NSE:NIFTY", "displayName": "NIFTY 50" },
                            { "name": "NSE:BANKNIFTY", "displayName": "NIFTY BANK" },
                            { "name": "BSE:SENSEX", "displayName": "SENSEX" }
                        ]
                    }
                ],
                "showSymbolLogo": true,
                "colorTheme": "light",
                "isTransparent": false,
                "locale": "en"
            })
        }}
    />
));

// 3. Technical Analysis Gauge Widget
export const TechnicalAnalysisWidget = memo(({ symbol = "NSE:NIFTY", height = "450px" }: { symbol?: string, height?: string }) => (
    <TVWidget
        height={height}
        scriptHTML={{
            src: "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js",
            innerHTML: JSON.stringify({
                "interval": "1m",
                "width": "100%",
                "isTransparent": false,
                "height": "450",
                "symbol": symbol,
                "showIntervalTabs": true,
                "locale": "en",
                "colorTheme": "light"
            })
        }}
    />
));

// 4. Advanced Chart Widget
export const AdvancedChartWidget = memo(({ symbol = "NSE:NIFTY", height = "950px" }: { symbol?: string, height?: string }) => (
    <TVWidget
        height={height}
        scriptHTML={{
            src: "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
            innerHTML: JSON.stringify({
                "width": "100%",
                "height": "950",
                "symbol": symbol,
                "interval": "D",
                "timezone": "Etc/UTC",
                "theme": "light",
                "style": "1",
                "locale": "en",
                "enable_publishing": false,
                "allow_symbol_change": true,
                "container_id": "tradingview_advanced_chart"
            })
        }}
    />
));
// 5. Forex Quotes Widget
export const ForexQuotesWidget = memo(({ height = "950px" }: { height?: string }) => (
    <TVWidget
        height={height}
        scriptHTML={{
            src: "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js",
            innerHTML: JSON.stringify({
                "width": "100%",
                "height": "950",
                "symbolsGroups": [
                    {
                        "name": "Major Pairs",
                        "symbols": [
                            { "name": "FX:EURUSD", "displayName": "EUR/USD" },
                            { "name": "FX:GBPUSD", "displayName": "GBP/USD" },
                            { "name": "FX:USDJPY", "displayName": "USD/JPY" },
                            { "name": "FX:USDCHF", "displayName": "USD/CHF" },
                            { "name": "FX:AUDUSD", "displayName": "AUD/USD" },
                            { "name": "FX:USDCAD", "displayName": "USD/CAD" }
                        ]
                    },
                    {
                        "name": "Indian Rupee Crosses",
                        "symbols": [
                            { "name": "FX_IDC:USDINR", "displayName": "USD/INR" },
                            { "name": "FX_IDC:EURINR", "displayName": "EUR/INR" },
                            { "name": "FX_IDC:GBPINR", "displayName": "GBP/INR" },
                            { "name": "FX_IDC:JPYINR", "displayName": "JPY/INR" }
                        ]
                    }
                ],
                "showSymbolLogo": true,
                "colorTheme": "light",
                "isTransparent": false,
                "locale": "en"
            })
        }}
    />
));
// 6. Economic Calendar Widget
export const EconomicCalendarWidget = memo(({ height = "600px" }: { height?: string }) => (
    <TVWidget
        height={height}
        scriptHTML={{
            src: "https://s3.tradingview.com/external-embedding/embed-widget-events.js",
            innerHTML: JSON.stringify({
                "colorTheme": "light",
                "isTransparent": false,
                "width": "100%",
                "height": "600",
                "locale": "en",
                "importanceFilter": "0,1",
                "currencyFilter": "USD,EUR,GBP,JPY,CNY,INR"
            })
        }}
    />
));

// 7. Timeline Widget (Real-time News)
export const TimelineWidget = memo(({ height = "600px", colorTheme = "light" }: { height?: string, colorTheme?: "light" | "dark" }) => (
    <TVWidget
        height={height}
        scriptHTML={{
            src: "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js",
            innerHTML: JSON.stringify({
                "feedMode": "all_symbols",
                "isTransparent": false,
                "displayMode": "regular",
                "width": "100%",
                "height": height,
                "colorTheme": colorTheme,
                "locale": "en"
            })
        }}
    />
));
// 8. Bond Quotes Widget
export const BondQuotesWidget = memo(({ height = "600px" }: { height?: string }) => (
    <TVWidget
        height={height}
        scriptHTML={{
            src: "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js",
            innerHTML: JSON.stringify({
                "width": "100%",
                "height": height,
                "symbolsGroups": [
                    {
                        "name": "Indian Government Bonds",
                        "symbols": [
                            { "name": "TVC:IN10Y", "displayName": "India 10Y Yield" },
                            { "name": "TVC:IN05Y", "displayName": "India 5Y Yield" },
                            { "name": "TVC:IN02Y", "displayName": "India 2Y Yield" }
                        ]
                    },
                    {
                        "name": "Global Benchmark Yields",
                        "symbols": [
                            { "name": "TVC:US10Y", "displayName": "US 10Y Yield" },
                            { "name": "TVC:US02Y", "displayName": "US 2Y Yield" },
                            { "name": "TVC:GB10Y", "displayName": "UK 10Y Yield" },
                            { "name": "TVC:DE10Y", "displayName": "Germany 10Y Yield" },
                            { "name": "TVC:JP10Y", "displayName": "Japan 10Y Yield" }
                        ]
                    }
                ],
                "showSymbolLogo": true,
                "colorTheme": "light",
                "isTransparent": false,
                "locale": "en",
                "container_id": "tradingview_bond_quotes_20250120"
            })
        }}
    />
));
