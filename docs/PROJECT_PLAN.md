# Commute Check - Project Plan

## App Purpose
Commute Check is a Progressive Web App (PWA) designed to help users make informed decisions about living or working arrangements based on commute efficiency. It allows users to compare two competing routes (e.g., "Home to Office A" vs. "Home to Office B") and visualizes the long-term impact on their time and stress levels.

## Core Features
1.  **Dual Comparison Modes:**
    *   **Compare Destinations:** One starting point (e.g., Home) -> Two different destinations (e.g., Job Offer A vs. Job Offer B).
    *   **Compare Origins:** Two different starting points (e.g., Apartment A vs. Apartment B) -> One destination (e.g., Current Office).
2.  **Interactive Split-Map:**
    *   Unified map view displaying both routes simultaneously using distinct colors (Blue for Option A, Purple for Option B).
3.  **Smart Metrics & "The Verdict":**
    *   **The Verdict:** A consolidated executive summary card calculating "Hours Saved Per Month".
    *   **Comparison Details:** Side-by-side modal for deep dives into duration, distance, and stress.
    *   **Traffic Stress Score:** Derived from travel time to distance ratio (identifying congestion).
4.  **Smart Geocoding Strategy:**
    *   **Photon API:** High-quality fuzzy search for landmarks and addresses.
    *   **Google Plus Codes:** Local decoding for precision without API costs.
    *   **Tech Park Catalog:** Hardcoded catalog for instant Bangalore business park matching.
5.  **Offline Capability:**
    *   Full PWA installability.
    *   Aggressive local caching of geocoding and routing results.
6.  **Responsive Design:**
    *   Mobile-first UI with bottom-pinned, collapsible panels for one-handed map interactivity.

## Tech Stack
*   **Core:** Preact (v10+) with Vite.
*   **Package Manager:** pnpm.
*   **Language:** TypeScript.
*   **Styling:** Vanilla CSS. Dark Mode default.
*   **Map Integration:** Leaflet (via `react-leaflet`).
*   **Routing API:** Open Source Routing Machine (OSRM) public API.
*   **Geocoding:** Photon API + `open-location-code`.
*   **PWA & Offline:** `vite-plugin-pwa` (Workbox).
*   **Deployment:** GitHub Pages (GitHub Actions).

## Map API Strategy (Free & Open Source)
*   **Tiles:** OpenStreetMap (OSM) standard tiles.
*   **Routing:** OSRM (Open Source Routing Machine) Public API.
*   **Geocoding:** Photon API (OpenStreetMap-based fuzzy search), Google Plus Codes (Local decoding), and custom Tech Park catalog.

## Offline Strategy
*   **App Shell:** Cache `index.html`, JS bundles, and CSS via Service Worker.
*   **Data:** Persist the state of the last comparison in `localStorage`.
*   **Maps:** Fallback "List View" if map tiles cannot load offline.