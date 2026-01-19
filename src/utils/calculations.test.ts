import { describe, expect, it } from "vitest";
import type { RouteData } from "../types";
import { calculateMonthlySavings } from "./calculations";

describe("Calculations", () => {
	const mockRouteFast: RouteData = {
		distance: 10000, // 10km
		duration: 600, // 10 mins (60km/h)
		geometry: "",
	};

	const mockRouteSlow: RouteData = {
		distance: 10000, // 10km
		duration: 3600, // 60 mins (10km/h)
		geometry: "",
	};

	describe("calculateMonthlySavings", () => {
		it("should calculate correct savings between fast and slow routes", () => {
			// Diff: 50 mins (3000s)
			// Daily (round trip): 100 mins
			// Monthly (22 days): 2200 mins = ~36.6 hours
			const savings = calculateMonthlySavings(mockRouteFast, mockRouteSlow);
			expect(savings).toBe(37); // Math.round(36.66) -> 37
		});

		it("should return 0 if any route is missing", () => {
			expect(calculateMonthlySavings(null, mockRouteSlow)).toBe(0);
			expect(calculateMonthlySavings(mockRouteFast, null)).toBe(0);
		});
	});
});
