import axios from 'axios';
import { authService } from './authService';

const UPSTOX_API_BASE = 'https://api.upstox.com/v2';

export interface UpstoxQuote {
    instrumentKey: string;
    lastPrice: number;
    change: number;
    changePercent: number;
    high: number;
    low: number;
    open: number;
    close: number;
    volume: number;
}

class UpstoxAPI {
    constructor() {
        // Token management is now handled by authService
    }

    setAccessToken(_token: string) {
        // Deprecated: Tokens are managed by authService
        console.warn('upstoxAPI.setAccessToken is deprecated. Use authService directly.');
    }

    clearAccessToken() {
        authService.clearTokens();
    }

    isAuthenticated(): boolean {
        return authService.isAuthenticated();
    }

    // Generate authorization URL
    getAuthorizationUrl(): string {
        return authService.getLoginUrl();
    }

    // Exchange authorization code for access token
    async getAccessToken(authCode: string): Promise<string> {
        const tokenData = await authService.exchangeCodeForToken(authCode);
        return tokenData.accessToken;
    }

    // Get market quotes for multiple instruments
    async getQuotes(instrumentKeys: string[]): Promise<Record<string, UpstoxQuote>> {
        const accessToken = await authService.getValidAccessToken();
        if (!accessToken) {
            throw new Error('Not authenticated');
        }

        try {
            const response = await axios.get(`${UPSTOX_API_BASE}/market-quote/quotes`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                },
                params: {
                    instrument_key: instrumentKeys.join(',')
                }
            });

            const quotes: Record<string, UpstoxQuote> = {};

            for (const [key, data] of Object.entries(response.data.data)) {
                const quoteData: any = data;
                quotes[key] = {
                    instrumentKey: key,
                    lastPrice: quoteData.last_price,
                    change: quoteData.net_change,
                    changePercent: quoteData.percentage_change,
                    high: quoteData.ohlc?.high || 0,
                    low: quoteData.ohlc?.low || 0,
                    open: quoteData.ohlc?.open || 0,
                    close: quoteData.ohlc?.close || 0,
                    volume: quoteData.volume || 0
                };
            }

            return quotes;
        } catch (error) {
            console.error('Error fetching quotes:', error);
            throw error;
        }
    }

    // Create WebSocket connection for real-time data
    async createMarketDataFeed(instrumentKeys: string[], onUpdate: (data: any) => void): Promise<WebSocket> {
        const accessToken = await authService.getValidAccessToken();
        if (!accessToken) {
            throw new Error('Not authenticated');
        }

        // We need to authorize the websocket connection first
        // This mirrors logic in LivePriceContext somewhat, but upstoxAPI handles it simply for now
        // NOTE: LivePriceContext is the preferred way to consume data in this app

        try {
            // Get authorized URL
            const response = await axios.get(`${UPSTOX_API_BASE}/feed/market-data-feed/authorize`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            });

            const authorizedUrl = response.data.data.authorizedRedirectUri;
            const ws = new WebSocket(authorizedUrl);

            ws.onopen = () => {
                console.log('Upstox WebSocket connected');

                // Subscribe to instruments
                ws.send(JSON.stringify({
                    guid: 'someguid',
                    method: 'sub',
                    data: {
                        mode: 'full',
                        instrumentKeys: instrumentKeys
                    }
                }));
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    onUpdate(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            ws.onclose = () => {
                console.log('Upstox WebSocket disconnected');
            };

            return ws;
        } catch (error) {
            console.error('Error creating market data feed:', error);
            throw error;
        }
    }

    // Get user profile
    async getUserProfile() {
        const accessToken = await authService.getValidAccessToken();
        if (!accessToken) {
            throw new Error('Not authenticated');
        }

        try {
            const response = await axios.get(`${UPSTOX_API_BASE}/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            });

            return response.data.data;
        } catch (error) {
            console.error('Error get ting user profile:', error);
            throw error;
        }
    }
}

export const upstoxAPI = new UpstoxAPI();
