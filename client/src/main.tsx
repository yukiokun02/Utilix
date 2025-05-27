import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Fix ResizeObserver loop completed error - this is a known browser issue
const originalResizeObserver = window.ResizeObserver;
window.ResizeObserver = class extends originalResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    super((entries, observer) => {
      // Wrap callback in requestAnimationFrame to prevent the loop error
      window.requestAnimationFrame(() => {
        try {
          callback(entries, observer);
        } catch (error) {
          // Silently catch ResizeObserver errors
          if (error instanceof Error && error.message.includes('ResizeObserver loop completed')) {
            return;
          }
          throw error;
        }
      });
    });
  }
};

// Completely suppress ResizeObserver errors at the source
window.addEventListener('error', (event) => {
  if (event.message?.includes('ResizeObserver loop completed')) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return false;
  }
});

// Also suppress from console
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
