import { CONFIG } from "../config";
import type { Location } from "../types";

/**
 * Searches for a location using the Nominatim (OpenStreetMap) API.
 *
 * @param {string} query - The address or place name to search for.
 * @returns {Promise<Location[]>} A promise that resolves to an array of found locations.
 * @throws {Error} If the network request fails.
 *
 * @example
 * const results = await searchLocation("New York");
 * console.log(results[0].lat, results[0].lng);
 */
export async function searchLocation(query: string): Promise<Location[]> {
	if (!query || query.length < 3) return [];

	const cacheKey = `geo_${query.toLowerCase()}`;
	const cached = localStorage.getItem(cacheKey);

	if (cached) {
		return JSON.parse(cached);
	}

	const url = `${CONFIG.NOMINATIM_BASE_URL}?q=${encodeURIComponent(query)}&format=json&limit=5`;

	try {
		const response = await fetch(url, {
			headers: {
				"Accept-Language": "en-US,en;q=0.9",
			},
		});

		if (!response.ok) {
			throw new Error("Geocoding error");
		}

		const data = await response.json();
		const results: Location[] = data.map(
			(item: { display_name: string; lat: string; lon: string }) => ({
				name: item.display_name,
				lat: parseFloat(item.lat),
				lng: parseFloat(item.lon),
			}),
		);

		localStorage.setItem(cacheKey, JSON.stringify(results));
		return results;
	} catch (error) {
		console.error("Geocoding failed", error);
		return [];
	}
}
