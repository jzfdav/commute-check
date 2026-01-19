/**
 * Traffic Heuristic Service
 * Provides multipliers for travel time based on traffic conditions.
 */

export const TRAFFIC_MULTIPLIERS = {
	NORMAL: 1.2,
	WORST: 5.5,
};

export type TrafficMode = "normal" | "worst";

export interface TrafficInfo {
	multiplier: number;
	label: string;
	isPeak: boolean;
}

export function getTrafficInfo(mode: TrafficMode): TrafficInfo {
	const isWorst = mode === "worst";
	return {
		multiplier: isWorst
			? TRAFFIC_MULTIPLIERS.WORST
			: TRAFFIC_MULTIPLIERS.NORMAL,
		label: isWorst ? "Avg-Worst Peak" : "Normal Traffic",
		isPeak: isWorst,
	};
}

/**
 * @deprecated Use getTrafficInfo with a mode instead.
 */
export function getTrafficHeuristic(): TrafficInfo {
	return getTrafficInfo("worst");
}
