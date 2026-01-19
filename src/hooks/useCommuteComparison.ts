import { useEffect, useState } from "preact/hooks";
import { toast } from "sonner";
import { fetchRoute } from "../services/osrm";
import type { ComparisonMode, Location, RouteData } from "../types";

// Default mock locations (Bengaluru)
const DEFAULT_ORIGIN: Location = {
	name: "BEL Layout, Vidyaranyapura",
	lat: 13.0819,
	lng: 77.5534,
};
const DEFAULT_DEST_A: Location = {
	name: "EGL (Embassy GolfLinks), Bengaluru",
	lat: 12.9468,
	lng: 77.648,
};
const DEFAULT_DEST_B: Location = {
	name: "Bagmane Solarium, Bengaluru",
	lat: 12.9936,
	lng: 77.6965,
};

export function useCommuteComparison() {
	const [mode, setMode] = useState<ComparisonMode>("destinations");
	const [originA, setOriginA] = useState<Location>(DEFAULT_ORIGIN);
	const [originB, setOriginB] = useState<Location>(DEFAULT_ORIGIN);
	const [destA, setDestA] = useState<Location>(DEFAULT_DEST_A);
	const [destB, setDestB] = useState<Location>(DEFAULT_DEST_B);

	const [routeA, setRouteA] = useState<RouteData | null>(null);
	const [routeB, setRouteB] = useState<RouteData | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		updateRoutes();
	}, [originA, originB, destA, destB, mode]);

	const updateRoutes = async () => {
		setIsLoading(true);
		try {
			const p1 = fetchRoute([originA.lat, originA.lng], [destA.lat, destA.lng]);
			const p2 = fetchRoute(
				mode === "destinations"
					? [originA.lat, originA.lng]
					: [originB.lat, originB.lng],
				mode === "destinations"
					? [destB.lat, destB.lng]
					: [destA.lat, destA.lng],
			);

			const [rA, rB] = await Promise.all([p1, p2]);

			setRouteA(rA);
			setRouteB(rB);
		} catch (err) {
			console.error(err);
			toast.error("Failed to fetch routes. Please check your connection.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleModeSwitch = (newMode: ComparisonMode) => {
		console.log(
			`[useCommuteComparison] Comparison mode switched to: ${newMode}`,
		);
		setMode(newMode);
	};

	return {
		mode,
		handleModeSwitch,
		originA,
		setOriginA,
		originB,
		setOriginB,
		destA,
		setDestA,
		destB,
		setDestB,
		routeA,
		routeB,
		isLoading,
	};
}
