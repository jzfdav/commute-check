import type { Location } from "../types";

export interface City {
	name: string;
	lat: number;
	lng: number;
}

export const CITIES: City[] = [
	{ name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
	{ name: "Pune", lat: 18.5204, lng: 73.8567 },
];

export const DEFAULT_CITY = CITIES[0]; // Bengaluru

export const CITY_DEFAULTS: Record<
	string,
	{ origin: Location; destA: Location; destB: Location }
> = {
	Bengaluru: {
		origin: {
			name: "BEL Layout, Vidyaranyapura",
			lat: 13.0819,
			lng: 77.5534,
		},
		destA: {
			name: "EGL (Embassy GolfLinks), Bengaluru",
			lat: 12.9468,
			lng: 77.648,
		},
		destB: {
			name: "Bagmane Solarium, Bengaluru",
			lat: 12.9936,
			lng: 77.6965,
		},
	},
	Pune: {
		origin: {
			name: "Baner, Pune",
			lat: 18.559,
			lng: 73.7797,
		},
		destA: {
			name: "IBM Embassy Techzone (ETZ), Hinjewadi",
			lat: 18.5913,
			lng: 73.7191,
		},
		destB: {
			name: "IBM Panchshil Tech Park, Yerwada",
			lat: 18.5516,
			lng: 73.8935,
		},
	},
};
