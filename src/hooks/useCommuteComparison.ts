import { useEffect, useMemo, useState } from "preact/hooks";
import { toast } from "sonner";
import { CITY_DEFAULTS } from "../constants/cities";
import { fetchRoute } from "../services/osrm";
import { getTrafficHeuristic } from "../services/traffic";
import type { ComparisonMode, Location, RouteData } from "../types";

// Default mock locations (Bengaluru)
const DEFAULT_LOCS = CITY_DEFAULTS.Bengaluru;

export function useCommuteComparison() {
	const [mode, setMode] = useState<ComparisonMode>("destinations");
	const [originA, setOriginA] = useState<Location>(DEFAULT_LOCS.origin);
	const [originB, setOriginB] = useState<Location>(DEFAULT_LOCS.origin);
	const [destA, setDestA] = useState<Location>(DEFAULT_LOCS.destA);
	const [destB, setDestB] = useState<Location>(DEFAULT_LOCS.destB);

	const [routeA, setRouteA] = useState<RouteData | null>(null);
	const [routeB, setRouteB] = useState<RouteData | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const setCityDefaults = (cityName: string) => {
		const defaults = CITY_DEFAULTS[cityName];
		if (defaults) {
			setOriginA(defaults.origin);
			setOriginB(defaults.origin);
			setDestA(defaults.destA);
			setDestB(defaults.destB);
		}
	};

	const trafficInfo = useMemo(() => getTrafficHeuristic(), []);

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
		setCityDefaults,
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
		trafficInfo,
	};
}
