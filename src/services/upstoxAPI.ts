import axios from 'axios';

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
    private accessToken: string | null = null;

    constructor() {
        // Load token from localStorage if exists
        this.accessToken = localStorage.getItem('upstox_access_token');
    }

    setAccessToken(token: string) {
        this.accessToken = token;
        localStorage.setItem('upstox_access_token', token);
    }

    clearAccessToken() {
        this.accessToken = null;
        localStorage.removeItem('upstox_access_token');
    }

    isAuthenticated(): boolean {
        return !!this.accessToken;
    }

    // Generate authorization URL
    getAuthorizationUrl(): string {
        const apiKey = import.meta.env.VITE_UPSTOX_API_KEY;
        const redirectUri = import.meta.env.VITE_UPSTOX_REDIRECT_URI;

        return `https://api.upstox.com/v2/login/authorization/dialog?client_id=${apiKey}&redirect_uri=${redirectUri}&response_type=code`;
    }

    // Exchange authorization code for access token
    async getAccessToken(authCode: string): Promise<string> {
        try {
            const response = await axios.post(`${UPSTOX_API_BASE}/login/authorization/token`, {
                code: authCode,
                client_id: import.meta.env.VITE_UPSTOX_API_KEY,
                client_secret: import.meta.env.VITE_UPSTOX_API_SECRET,
                redirect_uri: import.meta.env.VITE_UPSTOX_REDIRECT_URI,
                grant_type: 'authorization_code'
            });

            const { access_token } = response.data;
            this.setAccessToken(access_token);
            return access_token;
        } catch (error) {
            console.error('Error getting access token:', error);
            throw error;
        }
    }

    // Get market quotes for multiple instruments
    async getQuotes(instrumentKeys: string[]): Promise<Record<string, UpstoxQuote>> {
        if (!this.accessToken) {
            throw new Error('Not authenticated');
        }

        try {
            const response = await axios.get(`${UPSTOX_API_BASE}/market-quote/quotes`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
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
    createMarketDataFeed(instrumentKeys: string[], onUpdate: (data: any) => void): WebSocket {
        if (!this.accessToken) {
            throw new Error('Not authenticated');
        }

        const ws = new WebSocket(`wss://api.upstox.com/v2/feed/market-data-feed/authorize?access_token=${this.accessToken}`);

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
    }

    // Get user profile
    async getUserProfile() {
        if (!this.accessToken) {
            throw new Error('Not authenticated');
        }

        try {
            const response = await axios.get(`${UPSTOX_API_BASE}/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
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
