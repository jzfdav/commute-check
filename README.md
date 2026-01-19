# Commute Check

**Commute Check** is a decision-support tool that helps you choose the best place to live or work by mathematically comparing your daily commute options. Built as an ultra-lightweight, offline-capable Progressive Web App using Preact.

## Features
*   **Compare Two Scenarios:** Toggle between comparing destinations or origins.
*   **🏙️ Multi-City Support**: Pre-configured for **Bengaluru** and **Pune** with city-specific defaults and map centering.
*   **🚀 Smart Search**: Advanced geocoding supporting **Photon** (fuzzy), **Google Plus Codes**, and a local **Location Catalog** with ~40 tech parks and residential hubs.
*   **🏢🏠 Visual Categories**: Search results are visually distinguished with icons (🏢 Office, 🏠 Residential).
*   **The "Verdict" Engine:** Instantly see hours saved per month in a consolidated card.
*   **Traffic Stress Score:** Identify stressful routes with color-coded badges (Worst Peak 2.8x multiplier).
*   **📱 Mobile Ergonomics**: Optimized bottom-pinned, collapsible panels for one-handed map navigation.
*   **Visual Map Comparison:** Dual-route visualization (Blue vs. Purple).
*   **Offline Ready:** Installable on iOS/Android. Works without internet.

## Tech Stack
*   **Core:** Preact, Vite, TypeScript
*   **Maps:** Leaflet, OpenStreetMap, OSRM (Routing)
*   **PWA:** Service Workers, Web Manifest
*   **CI/CD:** GitHub Actions

## Installation

### Prerequisites
*   Node.js (v18 or higher)
*   pnpm (v8 or higher)

### Local Setup
1.  Clone the repository:
    ```bash
    git clone https://github.com/jzfdav/commute-check.git
    cd commute-check
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Start the development server:
    ```bash
    pnpm run dev
    ```
4.  Open your browser at `http://localhost:5173`.

## Deployment
This project is automatically deployed to GitHub Pages via GitHub Actions.
**Live URL:** [https://jzfdav.github.io/commute-check/](https://jzfdav.github.io/commute-check/)

## Contributing
1.  Fork the repository.
2.  Create a feature branch.
3.  Commit and push changes.
4.  Open a Pull Request.

## License
Distributed under the MIT License. See `LICENSE` for more information.