/**
 * Traffic Heuristic Service
 * Provides multipliers for travel time based on worst-case peak traffic.
 */

export interface TrafficInfo {
	multiplier: number;
	label: string;
	isPeak: boolean;
}

/**
 * Deterministic worst-case peak traffic multiplier.
 * Always assumes heavy traffic (2.8x) for realistic planning.
 */
export function getTrafficHeuristic(_date: Date = new Date()): TrafficInfo {
	return {
		multiplier: 2.8,
		label: "Worst Peak",
		isPeak: true,
	};
}
