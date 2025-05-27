import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Disable Vite's HMR error overlay for ResizeObserver warnings
if (import.meta.hot) {
  import.meta.hot.on('vite:error', (err) => {
    if (err.message?.includes('ResizeObserver loop completed with undelivered notifications')) {
      return;
    }
  });
}

// Suppress ResizeObserver warnings globally
const originalError = window.Error;
window.Error = class extends originalError {
  constructor(message?: string) {
    if (message?.includes('ResizeObserver loop completed with undelivered notifications')) {
      super(''); // Empty message to suppress
      this.name = 'SuppressedResizeObserverError';
      this.stack = '';
      return this;
    }
    super(message);
  }
};

// Override console.error to filter ResizeObserver warnings
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args[0];
  if (typeof message === 'string' && message.includes('ResizeObserver loop completed')) {
    return;
  }
  if (message?.message?.includes?.('ResizeObserver loop completed')) {
    return;
  }
  originalConsoleError.apply(console, args);
};

createRoot(document.getElementById("root")!).render(<App />);
