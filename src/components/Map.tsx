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
import { decodePolyline } from "../utils/calculations";

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
				height: "100%",
				width: "100%",
				overflow: "hidden",
			}}
		>
			<MapContainer
				center={[originA.lat, originA.lng]}
				zoom={12}
				style={{ height: "100%", width: "100%" }}
				zoomControl={false} // We can add custom zoom controls later
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					className="map-tiles map-tiles-dark"
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
