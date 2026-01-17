import { describe, expect, it } from "vitest";
import type { RouteData } from "../types";
import { calculateMonthlySavings, getTrafficStress } from "./calculations";

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

	const mockRouteModerate: RouteData = {
		distance: 10000, // 10km
		duration: 1800, // 30 mins (20km/h)
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

	describe("getTrafficStress", () => {
		it("should identify High stress (low speed)", () => {
			// 10km in 60mins = 10km/h (< 15)
			expect(getTrafficStress(mockRouteSlow).label).toBe("High");
			expect(getTrafficStress(mockRouteSlow).color).toContain("error-red");
		});

		it("should identify Moderate stress", () => {
			// 10km in 30mins = 20km/h (< 30)
			expect(getTrafficStress(mockRouteModerate).label).toBe("Moderate");
			expect(getTrafficStress(mockRouteModerate).color).toContain(
				"warning-amber",
			);
		});

		it("should identify Low stress (high speed)", () => {
			// 10km in 10mins = 60km/h (> 30)
			expect(getTrafficStress(mockRouteFast).label).toBe("Low");
			expect(getTrafficStress(mockRouteFast).color).toContain("success-green");
		});
	});
});
