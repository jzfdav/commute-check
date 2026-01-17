# Session Handoff - Commute Check

## Agent Information
*   **Role:** Implementation Agent
*   **Current State:** Project initialization and planning phase complete. Documentation updated for Preact migration.
*   **Context:** User requested high-performance PWA. We have switched from React to Preact to optimize bundle size and load time.

## Task Overview
The goal is to build "Commute Check", a Preact-based PWA that helps users compare two commute options.
*   **Input:** Two locations (Origin A/B or Destination A/B).
*   **Output:** Comparison of time, distance, stress score, and monthly time savings.

## Key Decisions & Constraints
1.  **Stack:** Preact + Vite + TypeScript.
    *   *Crucial:* Use `preact/compat` aliasing in `vite.config.ts` to support `react-leaflet`.
2.  **Maps:** React Leaflet (running on Preact) + OpenStreetMap tiles.
3.  **Routing:** OSRM Public API (Free).
    *   *Constraint:* Handle API failures gracefully; aggressive caching.
4.  **Styling:** CSS Modules. Dark Mode default.
5.  **PWA:** `vite-plugin-pwa` for offline capabilities.
6.  **Mock Data:** Default to Bengaluru (HSR Layout vs EGL/Manyata).

## Next Steps (For the Next Agent)
1.  **Scaffold Project:** Initialize the Vite project using the Preact preset: `npm init vite@latest commute-check -- --template preact-ts`.
2.  **Install Dependencies:** `react-leaflet`, `leaflet`, `vite-plugin-pwa`.
    *   *Note:* Ensure `preact` and `preact-render-to-string` are set up correctly.
3.  **Configure Aliases:** Update `vite.config.ts` to alias `react` -> `preact/compat` and `react-dom` -> `preact/compat`.
4.  **Implement UI Shell:** Create the layout with Tabs and Split View.
5.  **Integrate Map:** Set up Leaflet map.
6.  **Connect API:** Implement OSRM fetch with caching.

## Open Questions / Ambiguities
*   **Geocoding:** Need a strategy for searching addresses (Nominatim API recommended with debouncing).

## User Preferences
*   **Performance:** Preact chosen for smaller footprint.
*   **FOSS Only:** No paid APIs.
*   **Offline First:** PWA functionality is paramount.