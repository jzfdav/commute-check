import {
	MapContainer,
	Marker,
	Polyline,
	Popup,
	TileLayer,
	useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// Fix for default marker icons in Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useEffect, useMemo } from "preact/hooks";
import type { Location, RouteData } from "../types";

const DefaultIcon = L.Icon.Default as unknown as {
	prototype: { _getIconUrl?: string };
	mergeOptions: (options: object) => void;
};

delete DefaultIcon.prototype._getIconUrl;
DefaultIcon.mergeOptions({
	iconUrl: markerIcon,
	iconRetinaUrl: markerIcon2x,
	shadowUrl: markerShadow,
});

interface MapProps {
	originA: Location;
	originB: Location;
	destA: Location;
	destB: Location;
	routeA: RouteData | null;
	routeB: RouteData | null;
	mode: "destinations" | "origins";
}

function ChangeView({ bounds }: { bounds: L.LatLngBoundsExpression }) {
	const map = useMap();
	useEffect(() => {
		if (bounds) {
			map.fitBounds(bounds, { padding: [50, 50] });
		}
	}, [bounds, map]);
	return null;
}

function decodePolyline(str: string): [number, number][] {
	let index = 0,
		lat = 0,
		lng = 0,
		coordinates: [number, number][] = [],
		shift = 0,
		result = 0,
		byte: number | null = null,
		latitude_change: number,
		longitude_change: number;

	while (index < str.length) {
		byte = null;
		shift = 0;
		result = 0;

		do {
			byte = str.charCodeAt(index++) - 63;
			result |= (byte & 0x1f) << shift;
			shift += 5;
		} while (byte >= 0x20);

		latitude_change = result & 1 ? ~(result >> 1) : result >> 1;

		shift = 0;
		result = 0;

		do {
			byte = str.charCodeAt(index++) - 63;
			result |= (byte & 0x1f) << shift;
			shift += 5;
		} while (byte >= 0x20);

		longitude_change = result & 1 ? ~(result >> 1) : result >> 1;

		lat += latitude_change;
		lng += longitude_change;

		coordinates.push([lat / 1e5, lng / 1e5]);
	}

	return coordinates;
}

export function CommuteMap({
	originA,
	originB,
	destA,
	destB,
	routeA,
	routeB,
	mode,
}: MapProps) {
	const polylineA = useMemo(
		() => (routeA ? decodePolyline(routeA.geometry) : []),
		[routeA],
	);
	const polylineB = useMemo(
		() => (routeB ? decodePolyline(routeB.geometry) : []),
		[routeB],
	);

	const bounds = useMemo(() => {
		const points = [
			[originA.lat, originA.lng],
			[destA.lat, destA.lng],
			[
				mode === "destinations" ? destB.lat : originB.lat,
				mode === "destinations" ? destB.lng : originB.lng,
			],
		].filter((p) => p[0] !== 0) as [number, number][];

		return points.length > 0
			? L.latLngBounds(points)
			: L.latLngBounds([[12.97, 77.59]]);
	}, [originA, originB, destA, destB, mode]);

	return (
		<div
			style={{
				height: "400px",
				width: "100%",
				borderRadius: "8px",
				overflow: "hidden",
			}}
		>
			<MapContainer
				center={[originA.lat, originA.lng]}
				zoom={12}
				style={{ height: "100%", width: "100%" }}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					className="map-tiles"
				/>

				{routeA && (
					<Polyline
						positions={polylineA}
						pathOptions={{ color: "#3f51b5", weight: 5, opacity: 0.7 }}
					/>
				)}

				{routeB && (
					<Polyline
						positions={polylineB}
						pathOptions={{ color: "#9c27b0", weight: 5, opacity: 0.7 }}
					/>
				)}

				<Marker position={[originA.lat, originA.lng]}>
					<Popup>{mode === "destinations" ? "Start" : "Option A Start"}</Popup>
				</Marker>

				{mode === "origins" && (
					<Marker position={[originB.lat, originB.lng]}>
						<Popup>Option B Start</Popup>
					</Marker>
				)}

				<Marker position={[destA.lat, destA.lng]}>
					<Popup>
						{mode === "destinations" ? "Option A End" : "Destination"}
					</Popup>
				</Marker>

				{mode === "destinations" && (
					<Marker position={[destB.lat, destB.lng]}>
						<Popup>Option B End</Popup>
					</Marker>
				)}

				<ChangeView bounds={bounds} />
			</MapContainer>
		</div>
	);
}
