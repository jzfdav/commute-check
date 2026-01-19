import type { RouteData } from "../types";

export const calculateMonthlySavings = (
	routeA: RouteData | null,
	routeB: RouteData | null,
): number => {
	if (!routeA || !routeB) return 0;
	const diffSeconds = Math.abs(routeA.duration - routeB.duration);
	const roundTripDaily = diffSeconds * 2;
	const monthlySeconds = roundTripDaily * 22;
	return Math.round(monthlySeconds / 3600);
};

export function decodePolyline(str: string): [number, number][] {
	let index = 0,
		lat = 0,
		lng = 0,
		coordinates: [number, number][] = [],
		shift = 0,
		result = 0,
		byte: number | null = null,
		latitude_change: number,
		longitude_change: number;

	while (index < str.length) {
		byte = null;
		shift = 0;
		result = 0;

		do {
			byte = str.charCodeAt(index++) - 63;
			result |= (byte & 0x1f) << shift;
			shift += 5;
		} while (byte >= 0x20);

		latitude_change = result & 1 ? ~(result >> 1) : result >> 1;

		shift = 0;
		result = 0;

		do {
			byte = str.charCodeAt(index++) - 63;
			result |= (byte & 0x1f) << shift;
			shift += 5;
		} while (byte >= 0x20);

		longitude_change = result & 1 ? ~(result >> 1) : result >> 1;

		lat += latitude_change;
		lng += longitude_change;

		coordinates.push([lat / 1e5, lng / 1e5]);
	}

	return coordinates;
}
export function getShortName(fullName: string): string {
	if (!fullName) return "Unknown";
	// Extract the first part of the name (before the first comma)
	const shortName = fullName.split(",")[0].trim();
	// If it's too short (like a house number), try getting the next part if available
	if (shortName.length < 3 && fullName.includes(",")) {
		return fullName.split(",")[1].trim();
	}
	return shortName;
}
