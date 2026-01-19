import { OpenLocationCode as OLC } from "open-location-code";
import { CONFIG } from "../config";
import { TECH_PARKS } from "../constants/techParks";
import type { Location } from "../types";

// Handle CJS/ESM interop
// @ts-expect-error
// biome-ignore lint/suspicious/noExplicitAny: Necessary for obscure CJS interop
const OpenLocationCodeClass = (OLC.OpenLocationCode || OLC) as unknown as {
	new (): any;
};
const olc = new OpenLocationCodeClass();

/**
 * Searches for a location using Photon (fuzzy search), Plus Codes, or local catalog.
 */
export async function searchLocation(query: string): Promise<Location[]> {
	if (!query || query.length < 2) return [];

	// 1. Check Local Tech Parks Catalog
	const localMatches = TECH_PARKS.filter((park) =>
		park.name.toLowerCase().includes(query.toLowerCase()),
	);
	if (localMatches.length > 0) {
		return localMatches.map((m) => ({ ...m, name: `🏢 ${m.name}` }));
	}

	// 2. Check for Plus Codes (e.g., 3HC4+76W)
	if (olc.isValid(query.trim())) {
		try {
			let code = query.trim();
			// If it's a short code (like 3HC4+76W), we assume Bangalore context for now
			// Global prefix for Bangalore area is 9C3V
			if (olc.isShort(code)) {
				code = olc.recoverNearest(code, 12.9716, 77.5946);
			}
			const decoded = olc.decode(code);
			return [
				{
					name: `📍 Plus Code: ${query.trim()}`,
					lat: decoded.latitudeCenter,
					lng: decoded.longitudeCenter,
				},
			];
		} catch (e) {
			console.error("Plus code decoding failed", e);
		}
	}

	// 3. Fallback to Photon Fuzzy Search (biased towards Bengaluru)
	const cacheKey = `geoV2_${query.toLowerCase()}`;
	const cached = localStorage.getItem(cacheKey);
	if (cached) return JSON.parse(cached);

	// Bias search towards Bengaluru, India (lat: 12.9716, lon: 77.5946)
	const url = `${CONFIG.PHOTON_BASE_URL}/?q=${encodeURIComponent(query)}&limit=5&lat=12.9716&lon=77.5946`;

	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error("Geocoding error");

		const data = await response.json();
		const results: Location[] = data.features.map(
			(feature: {
				properties: {
					name?: string;
					street?: string;
					district?: string;
					city?: string;
					state?: string;
				};
				geometry: { coordinates: [number, number] };
			}) => {
				const p = feature.properties;
				const nameParts = [p.name, p.street, p.district, p.city, p.state]
					.filter(Boolean)
					.slice(0, 3);
				return {
					name: nameParts.join(", "),
					lat: feature.geometry.coordinates[1],
					lng: feature.geometry.coordinates[0],
				};
			},
		);

		localStorage.setItem(cacheKey, JSON.stringify(results));
		return results;
	} catch (error) {
		console.error("Geocoding failed", error);
		return [];
	}
}
