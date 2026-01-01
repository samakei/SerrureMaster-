import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Suppress extension connection errors
if (typeof window !== 'undefined' && typeof (window as any).chrome !== 'undefined') {
  (window as any).chrome?.runtime?.onMessage?.addListener(
    (message: any, sender: any, sendResponse: (response?: any) => void) => {
      // Respond immediately to avoid "channel closed" errors
      sendResponse({ received: true });
      return false;
    }
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
