import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ConfigurationCheck } from './components/ConfigurationCheck';

// Suppress extension connection errors
if (typeof window !== 'undefined' && typeof (window as any).chrome !== 'undefined') {
  const originalAddListener = (window as any).chrome?.runtime?.onMessage?.addListener;
  if (originalAddListener) {
    originalAddListener.call(
      (window as any).chrome.runtime.onMessage,
      (message: any, sender: any, sendResponse: (response?: any) => void) => {
        // Respond synchronously to prevent "channel closed" errors
        try {
          sendResponse({ received: true });
        } catch {
          // Ignore errors from closed channels
        }
        return false; // Don't keep the channel open
      }
    );
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ConfigurationCheck>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ConfigurationCheck>
  </React.StrictMode>
);
