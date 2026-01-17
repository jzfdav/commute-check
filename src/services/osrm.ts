import type { RouteData } from "../types";

const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving";

/**
 * Fetches driving route data between two coordinates using the OSRM API.
 *
 * @param {[number, number]} start - The starting [latitude, longitude].
 * @param {[number, number]} end - The ending [latitude, longitude].
 * @returns {Promise<RouteData>} A promise that resolves to the route data (distance, duration, geometry).
 * @throws {Error} If the API request fails or no route is found.
 *
 * @example
 * const route = await fetchRoute([12.91, 77.64], [12.95, 77.65]);
 * console.log(route.duration); // seconds
 */
export async function fetchRoute(
	start: [number, number],
	end: [number, number],
): Promise<RouteData> {
	const cacheKey = `route_${start.join(",")}_${end.join(",")}`;
	const cached = localStorage.getItem(cacheKey);

	if (cached) {
		try {
			return JSON.parse(cached);
		} catch (e) {
			console.error("Failed to parse cached route", e);
		}
	}

	const url = `${OSRM_BASE_URL}/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=polyline`;

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
		const result: RouteData = {
			distance: route.distance,
			duration: route.duration,
			geometry: route.geometry,
		};

		localStorage.setItem(cacheKey, JSON.stringify(result));
		return result;
	} catch (error) {
		console.error("Fetch route failed", error);
		throw error;
	}
}
