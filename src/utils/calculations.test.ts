import { describe, expect, it } from "vitest";
import type { RouteData } from "../types";
import { calculateMonthlySavings, formatDuration } from "./calculations";

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

	describe("formatDuration", () => {
		it("should format minutes correctly", () => {
			expect(formatDuration(600)).toBe("10 mins");
			expect(formatDuration(3540)).toBe("59 mins");
		});

		it("should format hours correctly", () => {
			expect(formatDuration(3600)).toBe("1h");
			expect(formatDuration(3660)).toBe("1h 1m");
			expect(formatDuration(5400)).toBe("1h 30m");
			expect(formatDuration(7200)).toBe("2h");
		});
	});
});
