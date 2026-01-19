import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { searchLocation } from "./geocoding";

describe("searchLocation", () => {
	beforeEach(() => {
		localStorage.clear();
		globalThis.fetch = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should return empty array for very short query", async () => {
		const results = await searchLocation("a");
		expect(results).toEqual([]);
		expect(fetch).not.toHaveBeenCalled();
	});

	it("should return cached results if available", async () => {
		const mockData = [{ name: "Cached Place", lat: 10, lng: 20 }];
		// Note the new cache key prefix geoV2_
		localStorage.setItem("geoV2_cached place", JSON.stringify(mockData));

		const results = await searchLocation("Cached Place");
		expect(results).toEqual(mockData);
		expect(fetch).not.toHaveBeenCalled();
	});

	it("should fetch and return results from Photon API", async () => {
		const mockResponse = {
			features: [
				{
					properties: {
						name: "New Place",
						city: "Bengaluru",
					},
					geometry: {
						coordinates: [56.78, 12.34], // [lon, lat]
					},
				},
			],
		};

		vi.mocked(fetch).mockResolvedValue({
			ok: true,
			json: async () => mockResponse,
		} as Response);

		const results = await searchLocation("New Place");

		expect(results).toHaveLength(1);
		expect(results[0].name).toContain("New Place");
		expect(results[0].lat).toBe(12.34);
		expect(results[0].lng).toBe(56.78);
		expect(localStorage.getItem("geoV2_new place")).toBeTruthy();
	});

	it("should handle API errors gracefully", async () => {
		vi.mocked(fetch).mockResolvedValue({
			ok: false,
		} as Response);

		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const results = await searchLocation("Error Place");

		expect(results).toEqual([]);
		expect(consoleSpy).toHaveBeenCalled();
	});

	it("should handle network errors gracefully", async () => {
		vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const results = await searchLocation("Network Error");

		expect(results).toEqual([]);
		expect(consoleSpy).toHaveBeenCalled();
	});

	it("should return tech park from local catalog without fetch", async () => {
		const results = await searchLocation("Manyata");
		expect(results.length).toBeGreaterThan(0);
		expect(results[0].name).toContain("Manyata Tech Park");
		expect(fetch).not.toHaveBeenCalled();
	});

	it("should decode Plus Codes without fetch", async () => {
		const results = await searchLocation("3HC4+76W");
		expect(results).toHaveLength(1);
		expect(results[0].name).toContain("Plus Code");
		// Allowing a bit more tolerance or using the specific library output
		expect(results[0].lat).toBeCloseTo(13.0707, 2);
		expect(fetch).not.toHaveBeenCalled();
	});
});
