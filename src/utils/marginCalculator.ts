export interface MarginResult {
    totalMargin: number;
    spanMargin: number;
    exposureMargin: number;
    premium: number;
    benefit: number;
    breakdown: string[];
}

interface StrategyLeg {
    type: 'CALL' | 'PUT';
    action: 'BUY' | 'SELL';
    strike: number;
    quantity: number;
    price: number;
}

export const calculateMargin = (legs: StrategyLeg[], spotPrice: number): MarginResult => {
    let totalMargin = 0;
    let spanMargin = 0;
    let exposureMargin = 0;
    let netPremium = 0;
    let benefit = 0;
    const breakdown: string[] = [];

    // Constants for NIFTY (Approximate values)
    const LOT_SIZE = 50;
    const SPAN_PERCENT = 0.12; // 12% Span Margin
    const EXPOSURE_PERCENT = 0.03; // 3% Exposure Margin
    const SHORT_OPTION_MIN_MARGIN = 80000; // Min margin per lot for naked short

    // 1. Calculate Net Premium (Cash flow)
    legs.forEach(leg => {
        const amount = leg.price * leg.quantity * LOT_SIZE;
        if (leg.action === 'BUY') {
            netPremium += amount; // Debit
        } else {
            netPremium -= amount; // Credit
        }
    });

    // 2. Identify Positions
    const longCalls = legs.filter(l => l.action === 'BUY' && l.type === 'CALL');
    const shortCalls = legs.filter(l => l.action === 'SELL' && l.type === 'CALL');
    const longPuts = legs.filter(l => l.action === 'BUY' && l.type === 'PUT');
    const shortPuts = legs.filter(l => l.action === 'SELL' && l.type === 'PUT');

    // 3. Calculate Margin for Short Positions (Initial Naked Calculation)
    let totalShortValue = 0;

    [...shortCalls, ...shortPuts].forEach(leg => {
        const contractValue = spotPrice * leg.quantity * LOT_SIZE;
        const legSpan = contractValue * SPAN_PERCENT;
        const legExposure = contractValue * EXPOSURE_PERCENT;

        spanMargin += legSpan;
        exposureMargin += legExposure;
        totalShortValue += contractValue;

        breakdown.push(`Short ${leg.type} ${leg.strike}: ~₹${(legSpan + legExposure).toLocaleString()} margin`);
    });

    // 4. Apply Hedging Benefits (Simplified Logic)
    // Check for Credit Spreads / Iron Condors

    // Call Side Hedge
    if (shortCalls.length > 0 && longCalls.length > 0) {
        // Find matched quantities
        const hedgedQty = Math.min(
            shortCalls.reduce((sum, l) => sum + l.quantity, 0),
            longCalls.reduce((sum, l) => sum + l.quantity, 0)
        );

        if (hedgedQty > 0) {
            // Significant margin reduction for spreads
            // In a spread, max loss is limited, so margin is roughly max loss
            const reduction = (spotPrice * hedgedQty * LOT_SIZE) * (SPAN_PERCENT + EXPOSURE_PERCENT) * 0.7; // 70% reduction estimate
            benefit += reduction;
            spanMargin -= reduction * 0.8;
            exposureMargin -= reduction * 0.2;
            breakdown.push(`Hedge Benefit (Call Spread): -₹${reduction.toLocaleString()}`);
        }
    }

    // Put Side Hedge
    if (shortPuts.length > 0 && longPuts.length > 0) {
        const hedgedQty = Math.min(
            shortPuts.reduce((sum, l) => sum + l.quantity, 0),
            longPuts.reduce((sum, l) => sum + l.quantity, 0)
        );

        if (hedgedQty > 0) {
            const reduction = (spotPrice * hedgedQty * LOT_SIZE) * (SPAN_PERCENT + EXPOSURE_PERCENT) * 0.7;
            benefit += reduction;
            spanMargin -= reduction * 0.8;
            exposureMargin -= reduction * 0.2;
            breakdown.push(`Hedge Benefit (Put Spread): -₹${reduction.toLocaleString()}`);
        }
    }

    // 5. Final Calculation
    // If Net Premium is positive (Debit strategy), we need to pay that cash
    // If Net Premium is negative (Credit strategy), we receive cash but need margin

    // For pure buyers (no shorts), margin is just the premium to pay
    if (shortCalls.length === 0 && shortPuts.length === 0) {
        totalMargin = Math.max(0, netPremium);
        spanMargin = 0;
        exposureMargin = 0;
        breakdown.push(`Net Premium to Pay: ₹${totalMargin.toLocaleString()}`);
    } else {
        // For sellers/spreads
        totalMargin = Math.max(0, spanMargin + exposureMargin);

        // If it's a credit strategy, the credit received can effectively reduce cash needed
        // But exchanges usually require the full margin upfront
        // We'll display the Margin Requirement
    }

    return {
        totalMargin: Math.round(totalMargin),
        spanMargin: Math.round(spanMargin),
        exposureMargin: Math.round(exposureMargin),
        premium: netPremium,
        benefit: Math.round(benefit),
        breakdown
    };
};
