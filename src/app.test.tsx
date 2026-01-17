import { fireEvent, render, screen } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { App } from "./app";

// Mock services
vi.mock("./services/osrm", () => ({
	fetchRoute: vi.fn().mockResolvedValue({
		distance: 1000,
		duration: 600,
		geometry: "encoded_polyline",
	}),
}));

// Mock child components to isolate App logic
vi.mock("./components/Map", () => ({
	CommuteMap: () => <div data-testid="commute-map" />,
}));

vi.mock("./components/LocationSearch", () => ({
	LocationSearch: () => <div data-testid="location-search" />,
}));

vi.mock("sonner", () => ({
	Toaster: () => <div data-testid="toaster" />,
	toast: { error: vi.fn() },
}));

describe("App", () => {
	it("renders the header correctly", () => {
		render(<App />);

		// Check for title
		expect(screen.getByText("Commute Check")).toBeInTheDocument();

		// Check for toggle buttons
		expect(screen.getByText("Destinations")).toBeInTheDocument();
		expect(screen.getByText("Origins")).toBeInTheDocument();
	});

	it("switches mode and logs event", async () => {
		const consoleSpy = vi.spyOn(console, "log");
		render(<App />);

		const originsBtn = screen.getByText("Origins");
		fireEvent.click(originsBtn);

		// Verify logging
		expect(consoleSpy).toHaveBeenCalledWith(
			"[App] Comparison mode switched to: origins",
		);

		// Verify active state (class check)
		expect(originsBtn).toHaveClass("active");
	});
});
