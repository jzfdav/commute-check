import { useEffect, useState } from "preact/hooks";
import { Toaster, toast } from "sonner";
import { LocationSearch } from "./components/LocationSearch";
import { CommuteMap } from "./components/Map";
import { fetchRoute } from "./services/osrm";
import type { ComparisonMode, Location, RouteData } from "./types";
import {
	calculateMonthlySavings,
	getTrafficStress,
} from "./utils/calculations";
import "./app.css";

// Default mock locations (Bengaluru)
const DEFAULT_ORIGIN: Location = {
	name: "HSR Layout, Bengaluru",
	lat: 12.9121,
	lng: 77.6446,
};
const DEFAULT_DEST_A: Location = {
	name: "EGL (Embassy GolfLinks), Bengaluru",
	lat: 12.9468,
	lng: 77.648,
};
const DEFAULT_DEST_B: Location = {
	name: "Manyata Tech Park, Bengaluru",
	lat: 13.0451,
	lng: 77.6266,
};

export function App() {
	const [mode, setMode] = useState<ComparisonMode>("destinations");
	const [originA, setOriginA] = useState<Location>(DEFAULT_ORIGIN);
	const [originB, setOriginB] = useState<Location>(DEFAULT_ORIGIN);
	const [destA, setDestA] = useState<Location>(DEFAULT_DEST_A);
	const [destB, setDestB] = useState<Location>(DEFAULT_DEST_B);

	const [routeA, setRouteA] = useState<RouteData | null>(null);
	const [routeB, setRouteB] = useState<RouteData | null>(null);

	useEffect(() => {
		updateRoutes();
	}, [originA, originB, destA, destB, mode]);

	const updateRoutes = async () => {
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
		}
	};

	return (
		<div className="container">
			<Toaster position="bottom-center" theme="dark" />
			<header className="flex justify-between items-center mb-4 mt-4">
				<h1>Commute Check</h1>
				<div className="tabs card flex gap-2">
					<button
						type="button"
						className={mode === "destinations" ? "active" : ""}
						onClick={() => setMode("destinations")}
					>
						Compare Destinations
					</button>
					<button
						type="button"
						className={mode === "origins" ? "active" : ""}
						onClick={() => setMode("origins")}
					>
						Compare Origins
					</button>
				</div>
			</header>

			<main className="grid-layout">
				<section className="inputs-panel card">
					<h2>Locations</h2>
					<div className="flex flex-col gap-4 mt-4">
						{mode === "destinations" ? (
							<>
								<LocationSearch
									label="Start (Home)"
									value={originA}
									onChange={setOriginA}
								/>
								<LocationSearch
									label="Option A (Work)"
									value={destA}
									onChange={setDestA}
								/>
								<LocationSearch
									label="Option B (Work)"
									value={destB}
									onChange={setDestB}
								/>
							</>
						) : (
							<>
								<LocationSearch
									label="Option A (Home)"
									value={originA}
									onChange={setOriginA}
								/>
								<LocationSearch
									label="Option B (Home)"
									value={originB}
									onChange={setOriginB}
								/>
								<LocationSearch
									label="Destination (Work)"
									value={destA}
									onChange={setDestA}
								/>
							</>
						)}
					</div>
				</section>

				<section className="results-panel flex flex-col gap-4">
					<CommuteMap
						originA={originA}
						originB={originB}
						destA={destA}
						destB={destB}
						routeA={routeA}
						routeB={routeB}
						mode={mode}
					/>
					<div className="comparison-cards flex gap-4">
						{routeA && (
							<div className="card flex-1 border-A">
								<h3>Option A</h3>
								<div className="metric">
									<span className="label">Time:</span>
									<span className="value">
										{Math.round(routeA.duration / 60)} mins
									</span>
								</div>
								<div className="metric">
									<span className="label">Distance:</span>
									<span className="value">
										{(routeA.distance / 1000).toFixed(1)} km
									</span>
								</div>
								<div className="metric">
									<span className="label">Stress:</span>
									<span
										className="value"
										style={{ color: getTrafficStress(routeA).color }}
									>
										{getTrafficStress(routeA).label}
									</span>
								</div>
							</div>
						)}
						{routeB && (
							<div className="card flex-1 border-B">
								<h3>Option B</h3>
								<div className="metric">
									<span className="label">Time:</span>
									<span className="value">
										{Math.round(routeB.duration / 60)} mins
									</span>
								</div>
								<div className="metric">
									<span className="label">Distance:</span>
									<span className="value">
										{(routeB.distance / 1000).toFixed(1)} km
									</span>
								</div>
								<div className="metric">
									<span className="label">Stress:</span>
									<span
										className="value"
										style={{ color: getTrafficStress(routeB).color }}
									>
										{getTrafficStress(routeB).label}
									</span>
								</div>
							</div>
						)}
					</div>

					<div className="verdict-card card">
						<h2>The Verdict</h2>
						{routeA && routeB ? (
							<div className="verdict-content">
								<p>
									{routeA.duration < routeB.duration ? (
										<span className="success">Option A is faster.</span>
									) : (
										<span className="success">Option B is faster.</span>
									)}
								</p>
								<p className="savings">
									You save approximately{" "}
									<strong>
										{calculateMonthlySavings(routeA, routeB)} hours
									</strong>{" "}
									per month!
								</p>
							</div>
						) : (
							<p>Calculating...</p>
						)}
					</div>
				</section>
			</main>

			<footer className="mt-4 text-dim text-center">
				<p>Built with Preact & OpenStreetMap</p>
			</footer>
		</div>
	);
}
