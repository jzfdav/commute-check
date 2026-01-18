import {
	Activity,
	Map as MapIcon,
	MapPin,
	Timer,
	TrendingUp,
} from "lucide-preact";
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
		<div className="immersive-container">
			<Toaster position="bottom-center" theme="dark" />

			{/* Layer 0: Full Screen Map */}
			<div className="map-layer">
				<CommuteMap
					originA={originA}
					originB={originB}
					destA={destA}
					destB={destB}
					routeA={routeA}
					routeB={routeB}
					mode={mode}
				/>
			</div>

			{/* Layer 1: Floating UI */}
			<div className="ui-layer">
				<header className="app-header">
					<div className="brand">
						<MapIcon
							style={{
								width: "20px",
								height: "20px",
								color: "var(--primary-color)",
							}}
						/>
						<h1 className="text-lg tracking-tight uppercase font-black">
							Commute Check
						</h1>
					</div>
					<div className="tabs">
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

				<div className="panels-container">
					{/* Floating Input Panel */}
					<aside className="floating-panel input-panel animate-in">
						<div className="flex items-center gap-2 mb-4">
							<MapPin size={18} color="var(--primary-color)" />
							<h2 className="text-sm uppercase tracking-wider font-bold">
								Locations
							</h2>
						</div>
						<div className="flex flex-col gap-4">
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
					</aside>

					{/* Floating Results Panel */}
					{(routeA || routeB) && (
						<div className="results-container">
							{/* Verdict Pill */}
							{routeA && routeB && (
								<div
									className="floating-panel animate-in"
									style={{ marginBottom: "16px", minWidth: "200px" }}
								>
									<div className="flex items-center gap-2 mb-2">
										<TrendingUp size={14} color="var(--success-green)" />
										<h3 className="text-xs uppercase text-dim">Verdict</h3>
									</div>
									<div className="text-sm">
										{routeA.duration < routeB.duration ? (
											<span
												style={{
													color: "var(--success-green)",
													fontWeight: "bold",
												}}
											>
												Option A is faster.
											</span>
										) : (
											<span
												style={{
													color: "var(--success-green)",
													fontWeight: "bold",
												}}
											>
												Option B is faster.
											</span>
										)}
										<div className="mt-2 text-xs opacity-80">
											Save{" "}
											<strong>
												{calculateMonthlySavings(routeA, routeB)} hours
											</strong>{" "}
											per month.
										</div>
									</div>
								</div>
							)}

							{/* Comparison Cards */}
							{routeA && (
								<div className="result-card border-A animate-in">
									<div className="stress-header">
										<h3 className="text-sm font-bold">Option A</h3>
										{(() => {
											const stress = getTrafficStress(routeA);
											return (
												<span
													className={`stress-badge stress-${stress.label.toLowerCase()}`}
												>
													<Activity size={10} />
													{stress.label}
												</span>
											);
										})()}
									</div>
									<div className="metric">
										<span className="label">
											<Timer size={14} /> Time
										</span>
										<span className="value">
											{Math.round(routeA.duration / 60)}m
										</span>
									</div>
									<div className="metric">
										<span className="label">
											<MapPin size={14} /> Distance
										</span>
										<span className="value">
											{(routeA.distance / 1000).toFixed(1)}km
										</span>
									</div>
								</div>
							)}

							{routeB && (
								<div
									className="result-card border-B animate-in"
									style={{ animationDelay: "0.1s" }}
								>
									<div className="stress-header">
										<h3 className="text-sm font-bold">Option B</h3>
										{(() => {
											const stress = getTrafficStress(routeB);
											return (
												<span
													className={`stress-badge stress-${stress.label.toLowerCase()}`}
												>
													<Activity size={10} />
													{stress.label}
												</span>
											);
										})()}
									</div>
									<div className="metric">
										<span className="label">
											<Timer size={14} /> Time
										</span>
										<span className="value">
											{Math.round(routeB.duration / 60)}m
										</span>
									</div>
									<div className="metric">
										<span className="label">
											<MapPin size={14} /> Distance
										</span>
										<span className="value">
											{(routeB.distance / 1000).toFixed(1)}km
										</span>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
