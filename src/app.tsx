import { Toaster } from "sonner";
import { LocationSearch } from "./components/LocationSearch";
import { CommuteMap } from "./components/Map";
import { useCommuteComparison } from "./hooks/useCommuteComparison";
import {
	calculateMonthlySavings,
	getTrafficStress,
} from "./utils/calculations";
import "./app.css";

export function App() {
	const {
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
	} = useCommuteComparison();

	return (
		<div className="container">
			<Toaster position="bottom-center" theme="dark" />
			<header className="app-header">
				<h1 className="text-lg tracking-tight uppercase font-black">
					Commute Check
				</h1>
				<div className="tabs card flex gap-1 p-1 text-xs">
					<button
						type="button"
						className={mode === "destinations" ? "active" : ""}
						onClick={() => handleModeSwitch("destinations")}
					>
						Destinations
					</button>
					<button
						type="button"
						className={mode === "origins" ? "active" : ""}
						onClick={() => handleModeSwitch("origins")}
					>
						Origins
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
