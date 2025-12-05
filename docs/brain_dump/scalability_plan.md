# Scalability Implementation Plan: 50k Concurrent Users

## Goal
Ensure the platform can handle 50,000 concurrent users without crashing client browsers or hitting backend API limits.

## 🚨 Critical Architecture Bottlenecks

### 1. Market Data API Limits (The "Shared Token" Risk)
- **Problem**: Currently, if a user isn't logged into Upstox, the app falls back to `VITE_UPSTOX_ACCESS_TOKEN`.
- **Risk**: 50,000 users connecting to Upstox WebSocket using the **SAME** access token will trigger immediate rate-limiting or account bans from Upstox.
- **Solution**:
    - **Primary**: Enforce "Bring Your Own Account" (BYOA). Users must log in with Upstox to see live data.
    - **Fallback**: For guests, do **NOT** use the live API shared token. Use the **Simulation Mode** (which runs locally in the browser and costs nothing).
    - **Action**: Update `LivePriceContext` to only use live API if *User is authenticated*, otherwise default to Simulation.

### 2. Client-Side Rendering Performance (The "Browser Freeze" Risk)
- **Problem**: `LivePriceContext` updates React state *every time* a WebSocket message arrives. Markets generate 10-50 updates/second.
- **Risk**: 50 re-renders per second will freeze the UI, especially on mobile devices.
- **Solution**: **Throttling**. Buffer incoming WebSocket messages and flush them to React state max 1-2 times per second.

### 3. Computation Overhead
- **Problem**: `OptionChainViewer` recalculates Black-Scholes Greeks for 100+ strikes on every render.
- **Solution**: Memoize calculations `useMemo`.

## 🛠 Proposed Changes

### Phase 1: Client Optimization (Immediate)
1.  **Modify `LivePriceContext.tsx`**:
    - Implement `useRef` buffer for price updates.
    - Create a flushing interval (e.g., 500ms).
    - Remove immediate `setPrices` from `ws.onmessage`.
2.  **Modify `LivePriceContext.tsx` (Logic)**:
    - **Disable shared token fallback**. If no user token, use Simulation Mode. (Saves API quota).

### Phase 2: Infrastructure (Recommendations)
1.  **CDN**: Ensure Vercel/Netlify is used for static assets (handled).
2.  **Supabase**: Enable Row Level Security (RLS) policies to prevent mass-reads from unauthorized users.

## 📜 Verification Plan
- **Performance Test**: Open multiple tabs (simulating load) and check generic "FPS" and "CPU Usage" in Chrome DevTools.
- **Network Test**: Verify no WebSocket connection is attempted without user login.
