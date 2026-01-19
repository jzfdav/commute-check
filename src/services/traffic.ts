/**
 * Traffic Heuristic Service
 * Provides multipliers for travel time based on time-of-day in major Indian cities.
 */

export interface TrafficInfo {
	multiplier: number;
	label: string;
	isPeak: boolean;
}

/**
 * Peak windows (Bengaluru/Pune context):
 * Morning Peak: 08:30 - 10:30 (2.5x)
 * Morning Shoulder: 08:00 - 08:30, 10:30 - 11:30 (1.6x)
 * Evening Peak: 17:30 - 20:30 (2.8x)
 * Evening Shoulder: 17:00 - 17:30, 20:30 - 21:30 (1.8x)
 * Night/Early Morning: 22:30 - 07:00 (1.0x) - basically free-flow
 * Normal: All other times (1.3x) - baseline city traffic
 */
export function getTrafficHeuristic(date: Date = new Date()): TrafficInfo {
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const time = hours + minutes / 60;

	// Weekend heuristic (lighter traffic baseline)
	const isWeekend = date.getDay() === 0 || date.getDay() === 6;
	const baseline = isWeekend ? 1.1 : 1.3;

	// Morning Peak
	if (time >= 8.5 && time <= 10.5) {
		return {
			multiplier: 2.5 * (isWeekend ? 0.7 : 1),
			label: "Morning Peak",
			isPeak: true,
		};
	}
	// Morning Shoulder
	if ((time >= 8.0 && time < 8.5) || (time > 10.5 && time <= 11.5)) {
		return {
			multiplier: 1.6 * (isWeekend ? 0.8 : 1),
			label: "Heavy Traffic",
			isPeak: false,
		};
	}

	// Evening Peak
	if (time >= 17.5 && time <= 20.5) {
		return {
			multiplier: 2.8 * (isWeekend ? 0.7 : 1),
			label: "Evening Peak",
			isPeak: true,
		};
	}
	// Evening Shoulder
	if ((time >= 17.0 && time < 17.5) || (time > 20.5 && time <= 21.5)) {
		return {
			multiplier: 1.8 * (isWeekend ? 0.8 : 1),
			label: "Heavy Traffic",
			isPeak: false,
		};
	}

	// Night free-flow
	if (time >= 22.5 || time <= 7.0) {
		return { multiplier: 1.0, label: "Free Flow", isPeak: false };
	}

	// Default transition/baseline
	return { multiplier: baseline, label: "Moderate Traffic", isPeak: false };
}
