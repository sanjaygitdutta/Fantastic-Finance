import { authService } from './authService';

const API_BASE = 'https://api.upstox.com/v2';

// Instrument key mapping for indices
export const INSTRUMENT_KEYS: Record<string, string> = {
    'NIFTY': 'NSE_INDEX|Nifty 50',
    'BANKNIFTY': 'NSE_INDEX|Nifty Bank',
    'FINNIFTY': 'NSE_INDEX|Nifty Fin Service',
    'MIDCPNIFTY': 'NSE_INDEX|Nifty Midcap 100',
    'SENSEX': 'BSE_INDEX|SENSEX'
};

export interface OptionData {
    callPremium: number;
    putPremium: number;
    atmStrike: number;
    expiry: string;
    iv: number;
    callOI: number;
    putOI: number;
    callVolume: number;
    putVolume: number;
}

interface OptionChainResponse {
    status: string;
    data: Array<{
        expiry: string;
        pcr: number;
        strike_price: number;
        underlying_key: string;
        underlying_spot_price: number;
        call_options: {
            instrument_key: string;
            market_data: {
                ltp: number;
                volume: number;
                oi: number;
                close_price: number;
            };
            option_greeks: {
                iv: number;
                delta: number;
                theta: number;
                gamma: number;
                vega: number;
            };
        };
        put_options: {
            instrument_key: string;
            market_data: {
                ltp: number;
                volume: number;
                oi: number;
                close_price: number;
            };
            option_greeks: {
                iv: number;
                delta: number;
                theta: number;
            };
        };
    }>;
}

class OptionChainService {
    /**
     * Calculate ATM strike based on spot price
     */
    calculateATMStrike(spotPrice: number, indexType: string): number {
        const step = indexType === 'SENSEX' ? 100 : 50;
        return Math.round(spotPrice / step) * step;
    }

    /**
     * Get nearest expiry date (Thursday for weekly, last Thursday for monthly)
     */
    getNearestExpiry(): string {
        const today = new Date();
        const dayOfWeek = today.getDay();

        // Calculate next Thursday (4 = Thursday)
        const daysUntilThursday = (4 - dayOfWeek + 7) % 7 || 7;
        const nextThursday = new Date(today);
        nextThursday.setDate(today.getDate() + daysUntilThursday);

        // Format as YYYY-MM-DD
        return nextThursday.toISOString().split('T')[0];
    }

    /**
     * Fetch option chain from Upstox API
     */
    async fetchOptionChain(instrumentKey: string, expiryDate: string): Promise<OptionChainResponse | null> {
        try {
            const token = await authService.getValidAccessToken();

            // Fallback to env variable if no stored token
            const finalToken = token || import.meta.env.VITE_UPSTOX_ACCESS_TOKEN;

            if (!finalToken) {
                console.warn('No Upstox access token available');
                return null;
            }

            const url = `${API_BASE}/option/chain?instrument_key=${encodeURIComponent(instrumentKey)}&expiry_date=${expiryDate}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${finalToken}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                console.error(`Option chain API error: ${response.status} ${response.statusText}`);
                return null;
            }

            const data: OptionChainResponse = await response.json();
            return data;

        } catch (error) {
            console.error('Failed to fetch option chain:', error);
            return null;
        }
    }

    /**
     * Get ATM option data for a specific index
     */
    async getATMOptions(
        indexType: string,
        spotPrice: number,
        expiryDate?: string
    ): Promise<OptionData | null> {
        try {
            const instrumentKey = INSTRUMENT_KEYS[indexType];
            if (!instrumentKey) {
                console.error(`Unknown index type: ${indexType}`);
                return null;
            }

            // Use provided expiry or calculate nearest
            const expiry = expiryDate || this.getNearestExpiry();

            // Fetch option chain
            const chainData = await this.fetchOptionChain(instrumentKey, expiry);
            if (!chainData || !chainData.data || chainData.data.length === 0) {
                console.warn(`No option chain data available for ${indexType}`);
                return null;
            }

            // Calculate ATM strike
            const atmStrike = this.calculateATMStrike(spotPrice, indexType);

            // Find ATM options in the chain
            const atmOption = chainData.data.find(item => item.strike_price === atmStrike);

            if (!atmOption) {
                console.warn(`ATM strike ${atmStrike} not found in option chain`);
                return null;
            }

            // Extract option data
            const optionData: OptionData = {
                callPremium: atmOption.call_options.market_data.ltp || 0,
                putPremium: atmOption.put_options.market_data.ltp || 0,
                atmStrike: atmStrike,
                expiry: expiry,
                iv: atmOption.call_options.option_greeks?.iv || 0,
                callOI: atmOption.call_options.market_data.oi || 0,
                putOI: atmOption.put_options.market_data.oi || 0,
                callVolume: atmOption.call_options.market_data.volume || 0,
                putVolume: atmOption.put_options.market_data.volume || 0
            };

            return optionData;

        } catch (error) {
            console.error('Error getting ATM options:', error);
            return null;
        }
    }

    /**
     * Get available expiry dates for an index
     */
    async getAvailableExpiries(indexType: string): Promise<string[]> {
        try {
            const token = await authService.getValidAccessToken();
            const finalToken = token || import.meta.env.VITE_UPSTOX_ACCESS_TOKEN;

            if (!finalToken) return [];

            const instrumentKey = INSTRUMENT_KEYS[indexType];
            if (!instrumentKey) return [];

            // Fetch contracts to get expiry dates
            const url = `${API_BASE}/option/contract?instrument_key=${encodeURIComponent(instrumentKey)}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${finalToken}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) return [];

            const data = await response.json();

            // Extract unique expiry dates
            if (data.status === 'success' && data.data) {
                const expiries = [...new Set(data.data.map((contract: any) => contract.expiry))];
                return expiries.sort();
            }

            return [];

        } catch (error) {
            console.error('Failed to fetch expiry dates:', error);
            return [];
        }
    }
}

export const optionChainService = new OptionChainService();

// Export convenience functions for direct use
export const getAvailableExpiries = (instrumentKey: string) => {
    // Extract index type from instrument key (e.g., "NSE_INDEX|Nifty 50" -> "NIFTY")
    const indexType = Object.keys(INSTRUMENT_KEYS).find(
        key => INSTRUMENT_KEYS[key] === instrumentKey
    ) || 'NIFTY';
    return optionChainService.getAvailableExpiries(indexType);
};

export const getOptionChain = async (instrumentKey: string, expiryDate: string) => {
    try {
        const chainData = await optionChainService.fetchOptionChain(instrumentKey, expiryDate);

        if (!chainData || !chainData.data) {
            return null;
        }

        // Get spot price from first item
        const spotPrice = chainData.data[0]?.underlying_spot_price || 0;

        // Format the data for the OptionChainViewer
        return {
            spot_price: spotPrice,
            expiry: expiryDate,
            strikes: chainData.data.map(strike => ({
                strike_price: strike.strike_price,
                call_options: {
                    last_price: strike.call_options?.market_data?.ltp || 0,
                    bid_price: strike.call_options?.market_data?.close_price || 0,
                    ask_price: strike.call_options?.market_data?.close_price || 0,
                    volume: strike.call_options?.market_data?.volume || 0,
                    oi: strike.call_options?.market_data?.oi || 0,
                    oi_change: 0, // TODO: Calculate from historical data
                    iv: strike.call_options?.option_greeks?.iv || 0.30,
                    delta: strike.call_options?.option_greeks?.delta || 0,
                    gamma: strike.call_options?.option_greeks?.gamma || 0,
                    theta: strike.call_options?.option_greeks?.theta || 0,
                    vega: strike.call_options?.option_greeks?.vega || 0
                },
                put_options: {
                    last_price: strike.put_options?.market_data?.ltp || 0,
                    bid_price: strike.put_options?.market_data?.close_price || 0,
                    ask_price: strike.put_options?.market_data?.close_price || 0,
                    volume: strike.put_options?.market_data?.volume || 0,
                    oi: strike.put_options?.market_data?.oi || 0,
                    oi_change: 0, // TODO: Calculate from historical data
                    iv: strike.put_options?.option_greeks?.iv || 0.30,
                    delta: strike.put_options?.option_greeks?.delta || 0,
                    gamma: strike.put_options?.option_greeks?.gamma || 0,
                    theta: strike.put_options?.option_greeks?.theta || 0,
                    vega: strike.put_options?.option_greeks?.vega || 0
                }
            }))
        };
    } catch (error) {
        console.error('Error in getOptionChain:', error);
        return null;
    }
};
