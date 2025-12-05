import React, { createContext, useContext, useState, useEffect } from 'react';

interface PaperTrade {
    id: string;
    symbol: string;
    type: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    timestamp: Date;
    pnl?: number;
}

interface PaperHolding {
    symbol: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
    pnl: number;
    pnlPercent: number;
    // Greeks for options positions
    delta?: number;
    gamma?: number;
    theta?: number;
    vega?: number;
    strikePrice?: number;
    optionType?: 'CALL' | 'PUT';
}

interface PaperPortfolio {
    cashBalance: number;
    totalInvested: number;
    currentValue: number;
    totalPnL: number;
    trades: PaperTrade[];
    holdings: PaperHolding[];
}

interface PaperTradingContextType {
    portfolio: PaperPortfolio;
    executeTrade: (symbol: string, type: 'BUY' | 'SELL', quantity: number, price: number) => boolean;
    resetPortfolio: () => void;
    getPerformanceMetrics: () => {
        totalReturn: number;
        winRate: number;
        tradesCount: number;
        avgProfit: number;
    };
    getPortfolioGreeks: () => {
        delta: number;
        gamma: number;
        theta: number;
        vega: number;
    };
}

const INITIAL_CASH = 1000000; // ₹10 Lakhs

const defaultPortfolio: PaperPortfolio = {
    cashBalance: INITIAL_CASH,
    totalInvested: 0,
    currentValue: INITIAL_CASH,
    totalPnL: 0,
    trades: [],
    holdings: []
};

const PaperTradingContext = createContext<PaperTradingContextType | undefined>(undefined);

export function PaperTradingProvider({ children }: { children: React.ReactNode }) {
    const [portfolio, setPortfolio] = useState<PaperPortfolio>(() => {
        // Load from localStorage if available
        const saved = localStorage.getItem('paperPortfolio');
        return saved ? JSON.parse(saved) : defaultPortfolio;
    });

    // Save to localStorage whenever portfolio changes
    useEffect(() => {
        localStorage.setItem('paperPortfolio', JSON.stringify(portfolio));
    }, [portfolio]);

    const executeTrade = (symbol: string, type: 'BUY' | 'SELL', quantity: number, price: number): boolean => {
        const totalCost = quantity * price;

        if (type === 'BUY') {
            // Check if enough cash
            if (totalCost > portfolio.cashBalance) {
                return false; // Insufficient funds
            }

            const newTrade: PaperTrade = {
                id: Date.now().toString(),
                symbol,
                type,
                quantity,
                price,
                timestamp: new Date()
            };

            setPortfolio(prev => {
                // Update or create holding
                const existingHolding = prev.holdings.find(h => h.symbol === symbol);
                let newHoldings: PaperHolding[];

                if (existingHolding) {
                    const totalQuantity = existingHolding.quantity + quantity;
                    const totalCost = (existingHolding.avgPrice * existingHolding.quantity) + (price * quantity);
                    const newAvgPrice = totalCost / totalQuantity;

                    newHoldings = prev.holdings.map(h =>
                        h.symbol === symbol
                            ? {
                                ...h,
                                quantity: totalQuantity,
                                avgPrice: newAvgPrice,
                                currentPrice: price,
                                pnl: (price - newAvgPrice) * totalQuantity,
                                pnlPercent: ((price - newAvgPrice) / newAvgPrice) * 100
                            }
                            : h
                    );
                } else {
                    newHoldings = [
                        ...prev.holdings,
                        {
                            symbol,
                            quantity,
                            avgPrice: price,
                            currentPrice: price,
                            pnl: 0,
                            pnlPercent: 0
                        }
                    ];
                }

                return {
                    ...prev,
                    cashBalance: prev.cashBalance - totalCost,
                    totalInvested: prev.totalInvested + totalCost,
                    trades: [...prev.trades, newTrade],
                    holdings: newHoldings
                };
            });

            return true;
        } else {
            // SELL
            const holding = portfolio.holdings.find(h => h.symbol === symbol);
            if (!holding || holding.quantity < quantity) {
                return false; // Don't have enough shares
            }

            const pnl = (price - holding.avgPrice) * quantity;

            const newTrade: PaperTrade = {
                id: Date.now().toString(),
                symbol,
                type,
                quantity,
                price,
                timestamp: new Date(),
                pnl
            };

            setPortfolio(prev => {
                const newHoldings = prev.holdings
                    .map(h =>
                        h.symbol === symbol
                            ? {
                                ...h,
                                quantity: h.quantity - quantity,
                                currentPrice: price,
                                pnl: (price - h.avgPrice) * (h.quantity - quantity),
                                pnlPercent: ((price - h.avgPrice) / h.avgPrice) * 100
                            }
                            : h
                    )
                    .filter(h => h.quantity > 0); // Remove if quantity becomes 0

                return {
                    ...prev,
                    cashBalance: prev.cashBalance + totalCost,
                    totalInvested: Math.max(0, prev.totalInvested - (holding.avgPrice * quantity)),
                    totalPnL: prev.totalPnL + pnl,
                    trades: [...prev.trades, newTrade],
                    holdings: newHoldings
                };
            });

            return true;
        }
    };

    const resetPortfolio = () => {
        setPortfolio(defaultPortfolio);
        localStorage.removeItem('paperPortfolio');
    };

    const getPerformanceMetrics = () => {
        const completedTrades = portfolio.trades.filter(t => t.type === 'SELL');
        const winningTrades = completedTrades.filter(t => (t.pnl || 0) > 0);

        const totalReturn = ((portfolio.currentValue - INITIAL_CASH) / INITIAL_CASH) * 100;
        const winRate = completedTrades.length > 0 ? (winningTrades.length / completedTrades.length) * 100 : 0;
        const avgProfit = completedTrades.length > 0
            ? completedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / completedTrades.length
            : 0;

        return {
            totalReturn,
            winRate,
            tradesCount: portfolio.trades.length,
            avgProfit
        };
    };

    const getPortfolioGreeks = () => {
        return portfolio.holdings.reduce((acc, holding) => ({
            delta: acc.delta + (holding.delta || 0) * holding.quantity,
            gamma: acc.gamma + (holding.gamma || 0) * holding.quantity,
            theta: acc.theta + (holding.theta || 0) * holding.quantity,
            vega: acc.vega + (holding.vega || 0) * holding.quantity
        }), { delta: 0, gamma: 0, theta: 0, vega: 0 });
    };

    return (
        <PaperTradingContext.Provider value={{ portfolio, executeTrade, resetPortfolio, getPerformanceMetrics, getPortfolioGreeks }}>
            {children}
        </PaperTradingContext.Provider>
    );
}

export function usePaperTrading() {
    const context = useContext(PaperTradingContext);
    if (!context) {
        throw new Error('usePaperTrading must be used within PaperTradingProvider');
    }
    return context;
}
