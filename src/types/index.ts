export interface Location {
	name: string;
	lat: number;
	lng: number;
}

export interface RouteData {
	distance: number; // in meters
	duration: number; // in seconds
	geometry: string; // polyline
}

export interface ComparisonResult {
	routeA: RouteData;
	routeB: RouteData;
	verdict: {
		winner: "A" | "B" | "Equal";
		hoursSavedPerMonth: number;
	};
}

export type ComparisonMode = "destinations" | "origins";
