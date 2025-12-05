# Upstox API Integration Guide

## Overview
This guide will help you integrate **real NSE/BSE market data** using the Upstox API.

---

## Step 1: Get Upstox API Credentials

### Create Developer Account
1. Visit [Upstox Developer Console](https://api.upstox.com/)
2. Sign up / Login with your Upstox account
3. Create a new app to get your API credentials

### You'll Receive:
- **API Key** (API Secret)
- **API Secret**
- **Redirect URL** (use `http://localhost:5173/auth/callback`)

---

## Step 2: Install Dependencies

```bash
npm install axios
```

---

## Step 3: Environment Variables

Create/update `.env` file in project root:

```env
VITE_UPSTOX_API_KEY=your_api_key_here
VITE_UPSTOX_API_SECRET=your_api_secret_here
VITE_UPSTOX_REDIRECT_URI=http://localhost:3000/auth/callback
```

---

## Step 4: How Upstox API Works

### Authentication Flow (OAuth 2.0):
1. **Authorize**: Redirect user to Upstox login
2. **Callback**: Upstox returns authorization code
3. **Token**: Exchange code for access token
4. **API Calls**: Use access token for market data

### Market Data Endpoints:
- **Quotes**: GET `/v2/market-quote/quotes`
- **Market Data Feed**: WebSocket for real-time streaming
- **Historical Data**: GET `/v2/historical-candle/{instrument_key}/{interval}/{to_date}`

---

## Step 5: Implementation Files Created

### Files Added:
1. `src/services/upstoxAPI.ts` - API service
2. `src/hooks/useUpstoxAuth.ts` - Authentication hook
3. `src/components/UpstoxAuth.tsx` - Login component

### Updated Files:
- `src/context/LivePriceContext.tsx` - Now uses real Upstox data
- `src/App.tsx` - Added auth callback route

---

## Step 6: Usage

### In Your App:

```typescript
import { useUpstoxAuth } from './hooks/useUpstoxAuth';

function App() {
  const { isAuthenticated, login, logout } = useUpstoxAuth();
  
  if (!isAuthenticated) {
    return <button onClick={login}>Connect to Upstox</button>;
  }
  
  // Now LivePriceContext will use real data!
  return <YourApp />;
}
```

---

## Instrument Keys for NSE Stocks

Upstox uses instrument keys to identify stocks:

```
NSE_EQ|INE002A01018  - Reliance
NSE_EQ|INE467B01029  - TCS
NSE_EQ|INE040A01034  - HDFC Bank
NSE_INDEX|Nifty 50   - NIFTY 50
NSE_INDEX|Nifty Bank - BANK NIFTY
```

---

## WebSocket for Real-Time Data

```typescript
const ws = new WebSocket('wss://api.upstox.com/v2/feed/market-data-feed');

ws.onopen = () => {
  ws.send(JSON.stringify({
    mode: 'full',
    instrumentKeys: ['NSE_EQ|INE002A01018']
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Update prices in real-time
};
```

---

## Rate Limits

- **Free Tier**: 250 requests/minute
- **Pro**: Higher limits available

---

## Testing

1. Click "Connect to Upstox" button
2. Login with Upstox credentials
3. Grant permissions
4. You'll be redirected back
5. Real NSE data will now flow into your app!

---

## Troubleshooting

### Issue: "Invalid redirect URI"
**Solution**: Make sure redirect URI in Upstox Developer Console matches exactly with your .env file

### Issue: "Token expired"
**Solution**: Tokens expire after 24 hours. User needs to re-authenticate.

### Issue: "WebSocket connection failed"
**Solution**: Check if access token is valid. WebSocket requires authenticated token.

---

## Alternative: Paper Trading Mode

If you don't have Upstox account yet, the app falls back to **simulated prices** automatically.

---

## Support

- [Upstox API Docs](https://upstox.com/developer/api-documentation)
- [Upstox Postman Collection](https://www.postman.com/upstox)
