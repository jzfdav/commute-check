# UI/UX Improvements & Findings

## 1. Analysis of Current Layout (OnePlus 13 / Mobile)
Based on visual inspection and screenshot analysis, several areas for improvement were identified to optimize the experience for modern, tall mobile displays (like the OnePlus 13).

### Key Findings
*   **Header Crowding:** The title "Commute Check" consumes significant vertical space. The "Compare Mode" toggle (Tabs) is disconnected and text-heavy.
*   **Input Dominance:** The "Locations" input card takes up ~50% of the viewport, pushing the primary value (Map & Results) below the fold.
*   **Map Visibility:** The map is cramped and feels secondary to the inputs.
*   **Ergonomics:** Top-right controls are hard to reach on tall screens.

## 2. Optimization Plan

### Phase 1: Compact Header (Immediate)
**Goal:** Recover vertical space and align controls.
*   **Action:** Convert the header to a single row.
*   **Action:** Simplify the "Compare Mode" toggle to a more compact design.
*   **Action:** Reduce title font size or usage of screen real estate.

### Phase 2: Immersive Map & Bottom Sheet (Future)
**Goal:** Make the map the hero.
*   **Concept:** The map should cover the full background.
*   **Interaction:** Inputs should live in a "Bottom Sheet" or a collapsible card overlaid on the map.
*   **Benefits:** Utilizes the tall aspect ratio of modern phones; feels more native.

### Phase 3: Result Verdict
**Goal:** Ensure the "answer" is always visible.
*   **Action:** Move "The Verdict" (Time Saved) to a sticky footer or floating pill above the bottom navigation area.

## 3. Technical Implementation Details
*   **CSS Framework:** Current project uses custom CSS + utility classes. Future implementations should maintain this lightweight approach.
*   **State Management:** Ensure map resizing triggers `map.invalidateSize()` when the input panel collapses/expands.
