# Commute Check - Project Plan

## App Purpose
Commute Check is a Progressive Web App (PWA) designed to help users make informed decisions about living or working arrangements based on commute efficiency. It allows users to compare two competing routes (e.g., "Home to Office A" vs. "Home to Office B") and visualizes the long-term impact on their time and stress levels.

## Core Features
1.  **Dual Comparison Modes:**
    *   **Compare Destinations:** One starting point (e.g., Home) -> Two different destinations (e.g., Job Offer A vs. Job Offer B).
    *   **Compare Origins:** Two different starting points (e.g., Apartment A vs. Apartment B) -> One destination (e.g., Current Office).
2.  **Interactive Split-Map:**
    *   Unified map view displaying both routes simultaneously using distinct colors (e.g., Blue for Option A, Purple for Option B).
3.  **Smart Metrics:**
    *   **ETA & Distance:** Real-time estimates for both options.
    *   **Traffic Stress Score:** A calculated metric derived from the ratio of travel time to distance (identifying congestion).
    *   **The Verdict:** A summary widget calculating "Hours Saved Per Month" (based on standard 22 workdays/month, round trip).
4.  **Offline Capability:**
    *   Full PWA installability (manifest.json).
    *   Offline access to the app shell.
    *   Caching of recent route comparisons for review without an internet connection.
5.  **Responsive Design:**
    *   Mobile-first UI that adapts to desktop split-views.
    *   Dark mode theme with high-contrast status colors (Green for "Better", Amber for "Worse").

## Tech Stack
*   **Frontend Framework:** Preact (v10+) with Vite.
    *   *Rationale:* Significantly smaller bundle size (3kB vs 40kB+) and faster parsing/execution, ideal for mobile PWAs.
    *   *Compatibility:* Will use `preact/compat` to ensure compatibility with the React ecosystem (specifically `react-leaflet`).
*   **Language:** TypeScript.
*   **Styling:** CSS Modules or Tailwind CSS (Minimal dependencies preferred). *Decision: Standard CSS/Modules for simplicity.*
*   **Map Integration:** Leaflet (via `react-leaflet`) for rendering maps.
*   **Routing API:** Open Source Routing Machine (OSRM) public API.
*   **PWA & Offline:** `vite-plugin-pwa` (powered by Workbox).
*   **Deployment:** GitHub Pages via GitHub Actions.

## Map API Strategy (Free & Open Source)
*   **Tiles:** OpenStreetMap (OSM) standard tiles.
*   **Routing:** OSRM (Open Source Routing Machine) Public API.
    *   *Note:* Strictly free APIs often have rate limits. We will implement aggressive local caching.

## Offline Strategy
*   **App Shell:** Cache `index.html`, JS bundles, and CSS via Service Worker.
*   **Data:** Persist the state of the last comparison in `localStorage`.
*   **Maps:** Fallback "List View" if map tiles cannot load offline.