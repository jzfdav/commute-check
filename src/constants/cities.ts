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
