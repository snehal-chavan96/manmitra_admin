// src/main.tsx
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/globals.css"; // add this line

// Capture token from URL (hash or query) provided by Portal
(() => {
  try {
    const hash = window.location.hash || "";
    const search = window.location.search || "";
    const hashMatch = hash.match(/[#&]token=([^&]+)/);
    const queryMatch = search.match(/[?&]token=([^&]+)/);
    const raw = (queryMatch && queryMatch[1]) || (hashMatch && hashMatch[1]);
    if (raw) {
      const token = decodeURIComponent(raw);
      // Store in role-specific key and a generic fallback for older code
      localStorage.setItem("mm_admin_token", token);
      localStorage.setItem("token", token);
      // Clean token from URL
      const { protocol, host, pathname } = window.location;
      window.history.replaceState({}, document.title, `${protocol}//${host}${pathname}`);
      // Redirect to dashboard
      if (!pathname.includes("/admins/dashboard")) {
        window.location.replace("/admins/dashboard");
        return;
      }
    }
  } catch {
    // no-op
  }
})();

createRoot(document.getElementById("root")!).render(<App />);
