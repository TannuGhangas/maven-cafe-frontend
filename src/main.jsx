// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Basic global style reset
const globalStyles = `
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #f7f7f7; }
    h1, h2, h3 { color: #333; }
    button { cursor: pointer; }
    main { max-width: 600px; margin: 0 auto; min-height: calc(100vh - 60px); background-color: white; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// ✅ ADD THIS FOR PWA (service worker registration)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => console.log("Service Worker Registered"))
      .catch(err => console.log("SW registration failed:", err));
  });
}
