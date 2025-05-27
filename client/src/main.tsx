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

// Enhanced error logging and debugging
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args[0];
  
  // Log detailed information about ResizeObserver errors
  if (typeof message === 'string' && message.includes('ResizeObserver loop completed')) {
    console.log('🔍 DEBUGGING ResizeObserver Error:', {
      message: message,
      stack: new Error().stack,
      timestamp: new Date().toISOString(),
      args: args
    });
    return; // Still suppress the error overlay
  }
  
  if (message?.message?.includes?.('ResizeObserver loop completed')) {
    console.log('🔍 DEBUGGING ResizeObserver Error Object:', {
      message: message.message,
      stack: message.stack,
      timestamp: new Date().toISOString(),
      fullError: message
    });
    return; // Still suppress the error overlay
  }
  
  // Log all other errors normally
  originalConsoleError.apply(console, args);
};

// Add window error event listener with detailed logging
window.addEventListener('error', (event) => {
  if (event.message?.includes('ResizeObserver loop completed')) {
    console.log('🔍 DEBUGGING Window Error Event:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      timestamp: new Date().toISOString()
    });
    event.preventDefault();
    event.stopImmediatePropagation();
  }
});

// Add unhandled rejection listener
window.addEventListener('unhandledrejection', (event) => {
  console.log('🔍 DEBUGGING Unhandled Rejection:', {
    reason: event.reason,
    timestamp: new Date().toISOString()
  });
});

createRoot(document.getElementById("root")!).render(<App />);
