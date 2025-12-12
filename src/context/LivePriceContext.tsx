import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { authService } from '../services/authService';

type PriceData = {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
};

type LivePriceContextType = {
    prices: Record<string, PriceData>;
    isConnected: boolean;
    lastUpdated: Date | null;
    refreshPrices: () => Promise<void>;
    usingLiveApi: boolean;
};

const LivePriceContext = createContext<LivePriceContextType | undefined>(undefined);

// Symbol Mapping: App Symbol -> Upstox Instrument Key
const SYMBOL_MAP: Record<string, string> = {
    'RELIANCE': 'NSE_EQ|INE002A01018',
    'TATASTEEL': 'NSE_EQ|INE081A01012',
    'INFY': 'NSE_EQ|INE009A01021',
    'HDFCBANK': 'NSE_EQ|INE040A01034',
    'ITC': 'NSE_EQ|INE154A01025',
    'TCS': 'NSE_EQ|INE467B01029',
    'SBIN': 'NSE_EQ|INE062A01020',
    'TATAMOTORS': 'NSE_EQ|INE155A01022',
    'NIFTY 50': 'NSE_INDEX|Nifty 50',
    'BANKNIFTY': 'NSE_INDEX|Nifty Bank',
    'SENSEX': 'BSE_INDEX|SENSEX',
    'GOLD': 'MCX_FO|GOLD',
    'SILVER': 'MCX_FO|SILVER',
    'CRUDEOIL': 'MCX_FO|CRUDEOIL',
    // World Indices (Mapped to dummy or potential future keys)
    'NASDAQ': 'GLOBAL|NASDAQ',
    'DOW JONES': 'GLOBAL|DOWJONES',
    'S&P 500': 'GLOBAL|GSPC',
    'DAX': 'GLOBAL|DAX',
    'FTSE': 'GLOBAL|FTSE',
    // Crypto
    'BTC': 'CRYPTO|BTC',
    'ETH': 'CRYPTO|ETH',
    'SOL': 'CRYPTO|SOL',
};

// YFinance Symbol Mapping
const YFINANCE_MAP: Record<string, string> = {
    'RELIANCE': 'RELIANCE.NS',
    'TATASTEEL': 'TATASTEEL.NS',
    'INFY': 'INFY.NS',
    'HDFCBANK': 'HDFCBANK.NS',
    'ITC': 'ITC.NS',
    'TCS': 'TCS.NS',
    'SBIN': 'SBIN.NS',
    'TATAMOTORS': 'TATAMOTORS.NS',
    'NIFTY 50': '^NSEI',
    'BANKNIFTY': '^NSEBANK',
    'SENSEX': '^BSESN',
    'GOLD': 'GC=F',
    'SILVER': 'SI=F',
    'CRUDEOIL': 'CL=F',
    'BTC': 'BTC-USD',
    'ETH': 'ETH-USD',
    'SOL': 'SOL-USD',
    'NASDAQ': '^IXIC',
    'DOW JONES': '^DJI',
    'S&P 500': '^GSPC',
    'DAX': '^GDAXI',
    'FTSE': '^FTSE',
};

// Reverse map for easy lookup during updates
const REVERSE_SYMBOL_MAP: Record<string, string> = {};
Object.entries(SYMBOL_MAP).forEach(([symbol, key]) => {
    REVERSE_SYMBOL_MAP[key] = symbol;
});

// Initial Mock Data (Fallback)
const INITIAL_PRICES: Record<string, number> = {
    'RELIANCE': 2450.00,
    'TATASTEEL': 120.50,
    'INFY': 1500.00,
    'HDFCBANK': 1600.00,
    'ITC': 350.00,
    'TCS': 3500.00,
    'SBIN': 580.00,
    'TATAMOTORS': 620.00,
    'NIFTY 50': 19500.00,
    'BANKNIFTY': 44500.00,
    'SENSEX': 65000.00,
    'GOLD': 60000.00,
    'SILVER': 72000.00,
    'CRUDEOIL': 6500.00,
    'BTC': 65000.00,
    'ETH': 3500.00,
    'SOL': 140.00,
    'NASDAQ': 16000.00,
    'DOW JONES': 38000.00,
    'S&P 500': 5000.00,
    'DAX': 17000.00,
    'FTSE': 7600.00,
};

export function LivePriceProvider({ children }: { children: ReactNode }) {
    const [prices, setPrices] = useState<Record<string, PriceData>>(() => {
        const initial: Record<string, PriceData> = {};
        Object.entries(INITIAL_PRICES).forEach(([symbol, price]) => {
            initial[symbol] = {
                symbol,
                price,
                change: 0,
                changePercent: 0,
            };
        });
        return initial;
    });
    const [isConnected, setIsConnected] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [usingLiveApi, setUsingLiveApi] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const priceUpdateBuffer = useRef<Record<string, PriceData>>({});
    const reconnectAttemptsRef = useRef(0);
    const reconnectTimeoutRef = useRef<number | null>(null);
    const maxReconnectAttempts = 10;
    const baseReconnectDelay = 1000; // Start with 1 second
    const maxReconnectDelay = 30000; // Max 30 seconds

    // Function to get authorized WebSocket URL with timeout
    const getAuthorizedUrl = async (token: string): Promise<string | null> => {
        try {
            // Add timeout to prevent hanging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

            const response = await fetch('https://api.upstox.com/v2/feed/market-data-feed/authorize', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.status === 401) {
                console.error('Upstox Access Token is invalid or expired (401 Unauthorized).');
                console.log('Attempting to force refresh the token...');

                // Try to force refresh the token before giving up
                const newToken = await authService.forceRefreshAccessToken();
                if (newToken) {
                    console.log('Token refreshed successfully after 401. Retrying authorization...');
                    // Retry with the new token
                    try {
                        const retryResponse = await fetch('https://api.upstox.com/v2/feed/market-data-feed/authorize', {
                            headers: {
                                'Authorization': `Bearer ${newToken}`,
                                'Accept': 'application/json'
                            },
                            signal: controller.signal
                        });

                        if (retryResponse.ok) {
                            const data = await retryResponse.json();
                            if (data.status === 'success' && data.data && data.data.authorizedRedirectUri) {
                                console.log('Successfully authorized with refreshed token');
                                return data.data.authorizedRedirectUri;
                            }
                        }
                    } catch (retryError) {
                        console.error('Retry after token refresh failed:', retryError);
                    }
                }

                // If refresh failed or retry failed, clear tokens
                console.log('Could not recover from 401 error. Clearing tokens...');
                authService.clearTokens();
                return null;
            }

            if (!response.ok) {
                console.error(`Upstox API error: ${response.status} ${response.statusText}`);
                return null;
            }

            const data = await response.json();
            if (data.status === 'success' && data.data && data.data.authorizedRedirectUri) {
                return data.data.authorizedRedirectUri;
            }
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                console.warn('Upstox authorization timed out - using simulated data');
            } else {
                console.error('Failed to authorize WebSocket:', error);
            }
        }
        return null;
    };

    const connectWebSocket = useCallback(async () => {
        // Try to get valid access token (will auto-refresh if needed)
        const storedToken = await authService.getValidAccessToken();
        let finalToken = storedToken;
        let tokenSource = 'stored';

        // REMOVED ENV FALLBACK: For 50k users, shared token = immediate ban.
        // Users must provide their own token via OAuth.
        if (!finalToken) {
            tokenSource = 'none';
        }

        if (!finalToken) {
            console.warn('No access token available. Please login or add VITE_UPSTOX_ACCESS_TOKEN to .env');
            setUsingLiveApi(false);
            return;
        }

        console.log(`Attempting to connect to Upstox using ${tokenSource} token...`);

        // Close existing connection if any
        if (wsRef.current) {
            wsRef.current.close();
        }

        const wsUrl = await getAuthorizedUrl(finalToken);
        if (!wsUrl) {
            console.warn('Could not get authorized WebSocket URL. Falling back to simulation.');
            setUsingLiveApi(false);
            return;
        }

        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('Connected to Upstox WebSocket');
            setIsConnected(true);
            setUsingLiveApi(true);
            reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful connection

            // Subscribe to feeds
            const instrumentKeys = Object.values(SYMBOL_MAP);
            const subscriptionMessage = {
                guid: "some_unique_id",
                method: "sub",
                data: {
                    mode: "full",
                    instrumentKeys: instrumentKeys
                }
            };
            ws.send(JSON.stringify(subscriptionMessage));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'live_feed' && data.feeds) {
                    // Buffer updates instead of setting state immediately
                    Object.entries(data.feeds).forEach(([key, feedData]: [string, any]) => {
                        let appSymbol = REVERSE_SYMBOL_MAP[key];
                        if (!appSymbol) return;

                        const ltpc = feedData.ltpc || (feedData.fullFeed && feedData.fullFeed.marketFF && feedData.fullFeed.marketFF.ltpc);

                        if (ltpc) {
                            const price = ltpc.ltp;
                            const close = ltpc.cp;
                            const change = price - close;
                            const changePercent = (change / close) * 100;

                            // Store in buffer
                            priceUpdateBuffer.current[appSymbol] = {
                                symbol: appSymbol,
                                price: price,
                                change: change,
                                changePercent: changePercent
                            };
                        }
                    });
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        // Flush buffer every 500ms
        const flushInterval = setInterval(() => {
            if (Object.keys(priceUpdateBuffer.current).length > 0) {
                setPrices(prev => ({
                    ...prev,
                    ...priceUpdateBuffer.current
                }));
                priceUpdateBuffer.current = {}; // Clear buffer
                setLastUpdated(new Date());
            }
        }, 500);

        ws.onclose = () => {
            clearInterval(flushInterval); // Clean up interval on close

            console.log('Upstox WebSocket disconnected');
            setIsConnected(false);

            // Attempt automatic reconnection with exponential backoff
            if (reconnectAttemptsRef.current < maxReconnectAttempts) {
                const delay = Math.min(
                    baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current),
                    maxReconnectDelay
                );

                reconnectAttemptsRef.current++;
                console.log(`Attempting to reconnect in ${delay / 1000} seconds (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`);

                reconnectTimeoutRef.current = window.setTimeout(() => {
                    connectWebSocket();
                }, delay);
            } else {
                console.error('Max reconnection attempts reached. Please refresh the page or check your connection.');
                setUsingLiveApi(false);
            }
        };

        ws.onerror = (error) => {
            console.error('Upstox WebSocket error:', error);
            setIsConnected(false);
        };

    }, []);

    // Subscribe to token refresh events to reconnect with new token
    useEffect(() => {
        const unsubscribe = authService.onTokenRefresh(() => {
            console.log('Token was refreshed. Reconnecting WebSocket with new token...');
            // Close existing connection
            if (wsRef.current) {
                wsRef.current.close();
            }
            // Reconnect with new token
            connectWebSocket();
        });

        return () => unsubscribe();
    }, [connectWebSocket]);

    const simulatePrices = useCallback(() => {
        setPrices(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(symbol => {
                const currentPrice = next[symbol].price;
                const volatility = symbol === 'BTC' || symbol === 'ETH' ? 0.005 : 0.002;
                const changePercent = (Math.random() * volatility * 2) - volatility;
                const change = currentPrice * changePercent;
                const newPrice = currentPrice + change;

                next[symbol] = {
                    symbol,
                    price: Number(newPrice.toFixed(2)),
                    change: Number((newPrice - INITIAL_PRICES[symbol]).toFixed(2)),
                    changePercent: Number(((newPrice - INITIAL_PRICES[symbol]) / INITIAL_PRICES[symbol] * 100).toFixed(2)),
                };
            });
            return next;
        });
        setLastUpdated(new Date());
    }, []);

    const refreshPrices = useCallback(async () => {
        // If using live API, maybe reconnect or just let it stream?
        // For now, if not connected, try to connect.
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            await connectWebSocket();
        }

        // If no user token, we remain in simulation mode
        const token = await authService.getValidAccessToken();
        if (!token) {
            simulatePrices();
        }
    }, [connectWebSocket, simulatePrices]);

    // Function to fetch from our local Python API (Batch Mode)
    const fetchFromLocalApi = useCallback(async () => {
        try {
            const symbols = Object.keys(INITIAL_PRICES);

            // Gather all YFinance symbols needed
            const yfSymbolsToFetch = new Set<string>();
            const reverseMap: Record<string, string[]> = {}; // yfSymbol -> [appSymbols]

            symbols.forEach(appSymbol => {
                const yf = YFINANCE_MAP[appSymbol];
                if (yf) {
                    yfSymbolsToFetch.add(yf);
                    if (!reverseMap[yf]) reverseMap[yf] = [];
                    reverseMap[yf].push(appSymbol);
                }
            });

            if (yfSymbolsToFetch.size === 0) return;

            // Make single batch request
            const symbolsParam = Array.from(yfSymbolsToFetch).join(',');
            const res = await fetch(`/api/stock?symbols=${encodeURIComponent(symbolsParam)}`);

            if (!res.ok) {
                console.warn(`Local API batch fetch failed: ${res.status}`);
                // Only simulate if API is completely down
                simulatePrices();
                return;
            }

            const data = await res.json();
            const results = data.results || [];

            if (results.length > 0) {
                const updates: Record<string, PriceData> = {};

                results.forEach((item: any) => {
                    const yfSym = item.symbol;
                    const appSymbols = reverseMap[yfSym];

                    if (appSymbols) {
                        appSymbols.forEach(appSym => {
                            // Yahoo data already has change/changePercent, or calculate it
                            const price = item.currentPrice;
                            const prevClose = item.previousClose || item.open || price;
                            const change = item.change !== undefined ? item.change : (price - prevClose);
                            const changePercent = item.changePercent !== undefined ? item.changePercent : ((change / prevClose) * 100);

                            updates[appSym] = {
                                symbol: appSym,
                                price: price,
                                change: change,
                                changePercent: changePercent
                            };
                        });
                    }
                });

                setPrices(prev => ({
                    ...prev,
                    ...updates
                }));
                setUsingLiveApi(true); // Technically using "Live" data from Yahoo
                setLastUpdated(new Date());
            }

        } catch (error) {
            console.error("Local API fetch failed:", error);
            simulatePrices();
        }
    }, [simulatePrices]);

    useEffect(() => {
        // Only start token refresh scheduler if we have tokens
        const tokens = authService.getStoredTokens();
        if (tokens) {
            authService.startTokenRefreshScheduler();
        }

        // Defer the initial connection significantly to not block page load at all
        // Page loads with simulated data first, then connects to live feed
        const timer = setTimeout(() => {
            refreshPrices();
        }, 5000); // 5 second delay

        // Keep simulation running if not live (no user token or WS disconnected)
        // Modified to use local API if available
        const interval = setInterval(async () => {
            const token = authService.getStoredTokens();
            // Fallback to local API if no token OR if we have a token but WS isn't somehow connected
            // Note: isConnected might take a moment to update, but polling every 5s is safe.
            // We use a ref for isConnected to avoid stale closure if needed, but here we depend on isConnected from scope?
            // Actually, useEffect dependency includes isConnected? No, it doesn't in the original code.
            // Let's rely on the fact that if we aren't getting WS updates, we want local data.

            // Simpler check: If not using Live API explicitly and not Connected to WS
            if (!token || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
                await fetchFromLocalApi();
            }
        }, 5000); // Poll every 5 seconds

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
            // Stop the token refresh scheduler
            authService.stopTokenRefreshScheduler();
        };
    }, [refreshPrices, simulatePrices, fetchFromLocalApi]);

    return (
        <LivePriceContext.Provider value={{ prices, isConnected, lastUpdated, refreshPrices, usingLiveApi }}>
            {children}
        </LivePriceContext.Provider>
    );
}

export function useLivePrices() {
    const context = useContext(LivePriceContext);
    if (context === undefined) {
        throw new Error('useLivePrices must be used within a LivePriceProvider');
    }
    return context;
}
