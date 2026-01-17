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

export const getTrafficStress = (route: RouteData) => {
	// Stress score based on speed (distance / duration)
	// Low speed = high stress
	// duration is in seconds, distance in meters
	// speed = (distance / 1000) / (duration / 3600) = km/h

	if (route.duration === 0)
		return { label: "Unknown", color: "var(--text-dim)" };

	const speedKmh = route.distance / 1000 / (route.duration / 3600);

	if (speedKmh < 15) return { label: "High", color: "var(--error-red)" };
	if (speedKmh < 30)
		return { label: "Moderate", color: "var(--warning-amber)" };
	return { label: "Low", color: "var(--success-green)" };
};
