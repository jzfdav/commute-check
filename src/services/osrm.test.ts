import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchRoute } from "./osrm";

describe("fetchRoute", () => {
	beforeEach(() => {
		localStorage.clear();
		vi.spyOn(global, "fetch");
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should return cached route if available", async () => {
		const mockRoute = { distance: 100, duration: 200, geometry: "xyz" };
		localStorage.setItem("route_10,20_30,40", JSON.stringify(mockRoute));

		const result = await fetchRoute([10, 20], [30, 40]);
		expect(result).toEqual(mockRoute);
		expect(fetch).not.toHaveBeenCalled();
	});

	it("should fetch and return route from API", async () => {
		const mockResponse = {
			routes: [{ distance: 500, duration: 60, geometry: "abc" }],
		};

		(fetch as any).mockResolvedValue({
			ok: true,
			json: async () => mockResponse,
		});

		const result = await fetchRoute([10, 20], [30, 40]);

		expect(result.distance).toBe(500);
		expect(result.duration).toBe(60);
		expect(result.geometry).toBe("abc");
		expect(localStorage.getItem("route_10,20_30,40")).toBeTruthy();
	});

	it("should throw error if API returns no routes", async () => {
		(fetch as any).mockResolvedValue({
			ok: true,
			json: async () => ({ routes: [] }),
		});

		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		await expect(fetchRoute([10, 20], [30, 40])).rejects.toThrow(
			"No route found",
		);
		expect(consoleSpy).toHaveBeenCalled();
	});

	it("should throw error on API failure", async () => {
		(fetch as any).mockResolvedValue({
			ok: false,
		});

		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		await expect(fetchRoute([10, 20], [30, 40])).rejects.toThrow(
			"OSRM API error",
		);
		expect(consoleSpy).toHaveBeenCalled();
	});

	it("should handle corrupt cache gracefully", async () => {
		localStorage.setItem("route_10,20_30,40", "invalid-json");
		const mockResponse = {
			routes: [{ distance: 500, duration: 60, geometry: "abc" }],
		};
		(fetch as any).mockResolvedValue({
			ok: true,
			json: async () => mockResponse,
		});

		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const result = await fetchRoute([10, 20], [30, 40]);

		expect(result.distance).toBe(500);
		expect(consoleSpy).toHaveBeenCalledWith(
			"Failed to parse cached route",
			expect.any(Error),
		);
	});
});
