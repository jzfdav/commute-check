import { CONFIG } from "../config";
import type { RouteData } from "../types";

/**
 * Fetches driving route data between two coordinates using the OSRM API.
 * Applies a traffic heuristic based on the provided multiplier.
 */
export async function fetchRoute(
	start: [number, number],
	end: [number, number],
	trafficMultiplier = 1.0,
): Promise<RouteData> {
	const cacheKey = `route_${start.join(",")}_${end.join(",")}_traffic_${trafficMultiplier.toFixed(2)}`;
	const cached = localStorage.getItem(cacheKey);

	if (cached) {
		try {
			return JSON.parse(cached);
		} catch (e) {
			console.error("Failed to parse cached route", e);
		}
	}

	const url = `${CONFIG.OSRM_BASE_URL}/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=polyline`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error("OSRM API error");
		}

		const data = await response.json();

		if (!data.routes || data.routes.length === 0) {
			throw new Error("No route found");
		}

		const route = data.routes[0];

		// Apply traffic multiplier to duration
		const adjustedDuration = route.duration * trafficMultiplier;

		const result: RouteData = {
			distance: route.distance,
			duration: adjustedDuration,
			geometry: route.geometry,
		};

		localStorage.setItem(cacheKey, JSON.stringify(result));
		return result;
	} catch (error) {
		console.error("Fetch route failed", error);
		throw error;
	}
}
