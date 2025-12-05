import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { TransactionProvider } from './context/TransactionContext';
import { GoalsProvider } from './context/GoalsContext';
import { LivePriceProvider } from './context/LivePriceContext';
import { NotificationProvider } from './context/NotificationContext';
import { PaperTradingProvider } from './context/PaperTradingContext';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

// Debugging: Intercept fetch to catch "Invalid value" errors
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  if (input === undefined || input === null) {
    console.error('CRITICAL: Fetch called with null/undefined input!', input);
    console.trace(); // This will show the call stack in the console
    // alert('CRITICAL ERROR: Fetch called with invalid input (null/undefined). Check console for stack trace.');
  }
  return originalFetch(input, init).catch(err => {
    if (err.message.includes('Invalid value')) {
      console.error('Fetch failed with "Invalid value" for input:', input);
      console.trace();
    }
    throw err;
  });
};


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <ThemeProvider>
          <AdminAuthProvider>
            <LivePriceProvider>
              <NotificationProvider>
                <PaperTradingProvider>
                  <TransactionProvider>
                    <GoalsProvider>
                      <App />
                    </GoalsProvider>
                  </TransactionProvider>
                </PaperTradingProvider>
              </NotificationProvider>
            </LivePriceProvider>
          </AdminAuthProvider>
        </ThemeProvider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>
);
