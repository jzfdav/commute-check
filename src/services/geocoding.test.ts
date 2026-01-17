import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { searchLocation } from "./geocoding";

describe("searchLocation", () => {
	beforeEach(() => {
		localStorage.clear();
		vi.spyOn(global, "fetch");
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should return empty array for short query", async () => {
		const results = await searchLocation("ab");
		expect(results).toEqual([]);
		expect(fetch).not.toHaveBeenCalled();
	});

	it("should return cached results if available", async () => {
		const mockData = [{ name: "Cached Place", lat: 10, lng: 20 }];
		localStorage.setItem("geo_cached place", JSON.stringify(mockData));

		const results = await searchLocation("Cached Place");
		expect(results).toEqual(mockData);
		expect(fetch).not.toHaveBeenCalled();
	});

	it("should fetch and return results from API", async () => {
		const mockResponse = [
			{ display_name: "New Place", lat: "12.34", lon: "56.78" },
		];

		(fetch as any).mockResolvedValue({
			ok: true,
			json: async () => mockResponse,
		});

		const results = await searchLocation("New Place");

		expect(results).toHaveLength(1);
		expect(results[0].name).toBe("New Place");
		expect(results[0].lat).toBe(12.34);
		expect(results[0].lng).toBe(56.78);
		expect(localStorage.getItem("geo_new place")).toBeTruthy();
	});

	it("should handle API errors gracefully", async () => {
		(fetch as any).mockResolvedValue({
			ok: false,
		});

		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const results = await searchLocation("Error Place");

		expect(results).toEqual([]);
		expect(consoleSpy).toHaveBeenCalled();
	});

	it("should handle network errors gracefully", async () => {
		(fetch as any).mockRejectedValue(new Error("Network error"));

		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const results = await searchLocation("Network Error");

		expect(results).toEqual([]);
		expect(consoleSpy).toHaveBeenCalled();
	});
});
