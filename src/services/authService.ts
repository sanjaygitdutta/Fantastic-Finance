const API_BASE = 'https://api.upstox.com/v2';

export interface UpstoxTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
}

export interface StoredTokenData {
    accessToken: string;
    refreshToken?: string;
    expiresAt: number;
}

type TokenRefreshListener = (token: string) => void;

class AuthService {
    private readonly apiKey = import.meta.env.VITE_UPSTOX_API_KEY;
    private readonly apiSecret = import.meta.env.VITE_UPSTOX_API_SECRET;
    private readonly redirectUri = import.meta.env.VITE_UPSTOX_REDIRECT_URI;
    private refreshSchedulerInterval: number | null = null;
    private tokenRefreshListeners: TokenRefreshListener[] = [];

    /**
     * Generate Upstox OAuth login URL
     */
    getLoginUrl(): string {
        const state = Math.random().toString(36).substring(7);
        localStorage.setItem('oauth_state', state);

        const params = new URLSearchParams({
            client_id: this.apiKey,
            redirect_uri: this.redirectUri,
            state: state,
            scope: 'orders'
        });

        return `https://api.upstox.com/v2/login/authorization/dialog?${params.toString()}`;
    }

    /**
     * Exchange authorization code for access token
     */
    async exchangeCodeForToken(code: string): Promise<StoredTokenData> {
        const response = await fetch(`${API_BASE}/login/authorization/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: new URLSearchParams({
                code: code,
                client_id: this.apiKey,
                client_secret: this.apiSecret,
                redirect_uri: this.redirectUri,
                grant_type: 'authorization_code'
            })
        });

        const data: UpstoxTokenResponse = await response.json();

        const tokenData: StoredTokenData = {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresAt: Date.now() + (data.expires_in * 1000)
        };

        this.saveTokens(tokenData);
        return tokenData;
    }

    /**
     * Refresh access token using refresh token
     */
    async refreshAccessToken(): Promise<StoredTokenData> {
        const stored = this.getStoredTokens();
        if (!stored?.refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await fetch(`${API_BASE}/login/authorization/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: new URLSearchParams({
                refresh_token: stored.refreshToken,
                client_id: this.apiKey,
                client_secret: this.apiSecret,
                redirect_uri: this.redirectUri,
                grant_type: 'refresh_token'
            })
        });

        const data: UpstoxTokenResponse = await response.json();

        const tokenData: StoredTokenData = {
            accessToken: data.access_token,
            refreshToken: data.refresh_token || stored.refreshToken,
            expiresAt: Date.now() + (data.expires_in * 1000)
        };

        this.saveTokens(tokenData);
        return tokenData;
    }

    /**
     * Get valid access token (auto-refresh if expired)
     */
    async getValidAccessToken(): Promise<string | null> {
        const stored = this.getStoredTokens();
        if (!stored) return null;

        // If token expires in less than 5 minutes, refresh it
        if (stored.expiresAt - Date.now() < 5 * 60 * 1000) {
            try {
                const refreshed = await this.refreshAccessToken();
                return refreshed.accessToken;
            } catch (error) {
                console.error('Failed to refresh token:', error);
                this.clearTokens();
                return null;
            }
        }

        return stored.accessToken;
    }

    /**
     * Force refresh access token regardless of expiration time
     * Useful when API returns 401 even if token looks valid locally
     */
    async forceRefreshAccessToken(): Promise<string | null> {
        try {
            const refreshed = await this.refreshAccessToken();
            return refreshed.accessToken;
        } catch (error) {
            console.error('Failed to force refresh token:', error);
            this.clearTokens();
            return null;
        }
    }

    /**
     * Check if token is expired
     */
    isTokenExpired(): boolean {
        const stored = this.getStoredTokens();
        if (!stored) return true;
        return Date.now() >= stored.expiresAt;
    }

    /**
     * Save tokens to localStorage
     */
    private saveTokens(data: StoredTokenData): void {
        localStorage.setItem('upstox_tokens', JSON.stringify(data));
    }

    /**
     * Get stored tokens from localStorage
     */
    getStoredTokens(): StoredTokenData | null {
        const stored = localStorage.getItem('upstox_tokens');
        if (!stored) return null;
        return JSON.parse(stored);
    }

    /**
     * Clear all stored tokens
     */
    clearTokens(): void {
        localStorage.removeItem('upstox_tokens');
        localStorage.removeItem('oauth_state');
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !this.isTokenExpired();
    }

    /**
     * Get milliseconds until token expiration
     */
    getTokenExpiresIn(): number | null {
        const stored = this.getStoredTokens();
        if (!stored) return null;
        return stored.expiresAt - Date.now();
    }

    /**
     * Subscribe to token refresh events
     */
    onTokenRefresh(listener: TokenRefreshListener): () => void {
        this.tokenRefreshListeners.push(listener);
        // Return unsubscribe function
        return () => {
            this.tokenRefreshListeners = this.tokenRefreshListeners.filter(l => l !== listener);
        };
    }

    /**
     * Notify all listeners that token was refreshed
     */
    private notifyTokenRefresh(token: string): void {
        this.tokenRefreshListeners.forEach(listener => {
            try {
                listener(token);
            } catch (error) {
                console.error('Error in token refresh listener:', error);
            }
        });
    }

    /**
     * Start background token refresh scheduler
     * Checks every 5 minutes and refreshes if token expires in less than 10 minutes
     */
    startTokenRefreshScheduler(): void {
        if (this.refreshSchedulerInterval) {
            console.warn('Token refresh scheduler already running');
            return;
        }

        console.log('Starting background token refresh scheduler');

        // Check immediately
        this.checkAndRefreshToken();

        // Then check every 5 minutes
        this.refreshSchedulerInterval = window.setInterval(() => {
            this.checkAndRefreshToken();
        }, 5 * 60 * 1000); // 5 minutes
    }

    /**
     * Stop background token refresh scheduler
     */
    stopTokenRefreshScheduler(): void {
        if (this.refreshSchedulerInterval) {
            clearInterval(this.refreshSchedulerInterval);
            this.refreshSchedulerInterval = null;
            console.log('Stopped background token refresh scheduler');
        }
    }

    /**
     * Check token expiration and refresh if needed
     */
    private async checkAndRefreshToken(): Promise<void> {
        const stored = this.getStoredTokens();
        if (!stored || !stored.refreshToken) return;

        const expiresIn = stored.expiresAt - Date.now();
        const tenMinutes = 10 * 60 * 1000;

        // If token expires in less than 10 minutes, refresh it
        if (expiresIn < tenMinutes && expiresIn > 0) {
            console.log(`Token expires in ${Math.round(expiresIn / 1000 / 60)} minutes. Refreshing...`);
            try {
                const refreshed = await this.refreshAccessToken();
                console.log('Token refreshed successfully in background');
                this.notifyTokenRefresh(refreshed.accessToken);
            } catch (error) {
                console.error('Background token refresh failed:', error);
            }
        } else if (expiresIn <= 0) {
            console.warn('Token already expired. Attempting refresh...');
            try {
                const refreshed = await this.refreshAccessToken();
                console.log('Expired token refreshed successfully');
                this.notifyTokenRefresh(refreshed.accessToken);
            } catch (error) {
                console.error('Failed to refresh expired token:', error);
                this.clearTokens();
            }
        }
    }
}

export const authService = new AuthService();
