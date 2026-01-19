import {
	ArrowRight,
	ChevronDown,
	ChevronUp,
	Clock,
	Map as MapIcon,
	MapPin,
	Timer,
	TrendingUp,
} from "lucide-preact";
import { useEffect, useState } from "preact/hooks";
import { Toaster } from "sonner";
import { LocationSearch } from "./components/LocationSearch";
import { CommuteMap } from "./components/Map";
import { CITIES, type City, DEFAULT_CITY } from "./constants/cities";
import { useCommuteComparison } from "./hooks/useCommuteComparison";
import { calculateMonthlySavings, getShortName } from "./utils/calculations";
import "./app.css";

export function App() {
	const {
		mode,
		handleModeSwitch,
		setCityDefaults,
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
		trafficInfo,
	} = useCommuteComparison();

	const [showDetails, setShowDetails] = useState(false);
	const [isInputCollapsed, setIsInputCollapsed] = useState(true);
	const [isResultsCollapsed, setIsResultsCollapsed] = useState(true);
	const [selectedCity, setSelectedCity] = useState<City>(DEFAULT_CITY);

	// Auto-collapse when both routes are loaded
	useEffect(() => {
		if (routeA && routeB) {
			setIsInputCollapsed(true);
			setIsResultsCollapsed(false);
		}
	}, [!!routeA, !!routeB]);

	const isAFaster = routeA && routeB && routeA.duration < routeB.duration;
	const winner = isAFaster
		? mode === "destinations"
			? destA
			: originA
		: mode === "destinations"
			? destB
			: originB;
	const loser = isAFaster
		? mode === "destinations"
			? destB
			: originB
		: mode === "destinations"
			? destA
			: originA;

	const handleMouseMove = (e: MouseEvent) => {
		const card = e.currentTarget as HTMLElement;
		const rect = card.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		card.style.setProperty("--mouse-x", `${x}px`);
		card.style.setProperty("--mouse-y", `${y}px`);
	};

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
					<div className="city-selector">
						{CITIES.map((city) => (
							<button
								key={city.name}
								type="button"
								className={selectedCity.name === city.name ? "active" : ""}
								onClick={() => {
									setSelectedCity(city);
									setCityDefaults(city.name);
									setIsInputCollapsed(false);
									setIsResultsCollapsed(true);
								}}
							>
								{city.name}
							</button>
						))}
					</div>
				</header>

				<div className="panels-container">
					{/* Floating Input Panel */}
					<aside
						className={`floating-panel input-panel animate-in ${isInputCollapsed ? "collapsed" : ""}`}
					>
						{isInputCollapsed ? (
							<button
								type="button"
								className="input-summary grid-layout"
								onClick={() => {
									setIsInputCollapsed(false);
									setIsResultsCollapsed(true);
								}}
							>
								{mode === "destinations" ? (
									<>
										<div className="summary-col origin-col">
											<span className="summary-label">From</span>
											<span className="summary-value">
												{getShortName(originA.name)}
											</span>
										</div>
										<div className="summary-arrow">
											<ArrowRight size={16} />
										</div>
										<div className="summary-col dest-col">
											<div className="dest-row">
												<span className="summary-value">
													{getShortName(destA.name)}
												</span>
											</div>
											<div className="vs-divider">vs</div>
											<div className="dest-row">
												<span className="summary-value">
													{getShortName(destB.name)}
												</span>
											</div>
										</div>
									</>
								) : (
									<>
										<div className="summary-col origin-col">
											<div className="origin-row">
												<span className="summary-value">
													{getShortName(originA.name)}
												</span>
											</div>
											<div className="vs-divider">vs</div>
											<div className="origin-row">
												<span className="summary-value">
													{getShortName(originB.name)}
												</span>
											</div>
										</div>
										<div className="summary-arrow reversed">
											<ArrowRight size={16} />
										</div>
										<div className="summary-col dest-col">
											<span className="summary-label">To</span>
											<span className="summary-value">
												{getShortName(destA.name)}
											</span>
										</div>
									</>
								)}
								<div className="toggle-indicator">
									<ChevronDown size={14} />
								</div>
							</button>
						) : (
							<>
								<div className="flex flex-col mb-4">
									<div className="flex justify-between items-center mb-1">
										<div className="flex items-center gap-2">
											<MapPin size={18} color="var(--primary-color)" />
											<h2 className="text-sm uppercase tracking-wider font-bold">
												Locations
											</h2>
										</div>
										<div className="flex items-center gap-3">
											<div className="tabs compact">
												<button
													type="button"
													className={mode === "destinations" ? "active" : ""}
													onClick={() => handleModeSwitch("destinations")}
												>
													Dest.
												</button>
												<button
													type="button"
													className={mode === "origins" ? "active" : ""}
													onClick={() => handleModeSwitch("origins")}
												>
													Orig.
												</button>
											</div>
											{routeA && routeB && (
												<button
													type="button"
													className="toggle-button"
													onClick={() => {
														setIsInputCollapsed(true);
														setIsResultsCollapsed(false);
													}}
												>
													<ChevronUp size={18} />
												</button>
											)}
										</div>
									</div>
									<p className="text-[10px] text-dim opacity-70 px-1">
										{mode === "destinations"
											? "2 destinations · 1 starting point"
											: "2 starting points · 1 destination"}
									</p>
								</div>
								<div className="flex flex-col gap-4">
									{mode === "destinations" ? (
										<>
											<LocationSearch
												label="Starting Point"
												value={originA}
												onChange={setOriginA}
												cityBias={selectedCity}
											/>
											<LocationSearch
												label="Option A"
												value={destA}
												onChange={setDestA}
												cityBias={selectedCity}
											/>
											<LocationSearch
												label="Option B"
												value={destB}
												onChange={setDestB}
												cityBias={selectedCity}
											/>
										</>
									) : (
										<>
											<LocationSearch
												label="Option A"
												value={originA}
												onChange={setOriginA}
												cityBias={selectedCity}
											/>
											<LocationSearch
												label="Option B"
												value={originB}
												onChange={setOriginB}
												cityBias={selectedCity}
											/>
											<LocationSearch
												label="Destination"
												value={destA}
												onChange={setDestA}
												cityBias={selectedCity}
											/>
										</>
									)}
								</div>
							</>
						)}
					</aside>

					{/* Floating Results Panel */}
					{routeA && routeB && (
						<div
							className={`results-container ${isResultsCollapsed ? "collapsed" : ""}`}
						>
							{/* biome-ignore lint/a11y/useSemanticElements: Using div for mouse-move tracking visual effects */}
							<div
								className="verdict-card animate-in text-left w-full"
								onClick={() => setShowDetails(true)}
								onMouseMove={handleMouseMove}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										setShowDetails(true);
									}
								}}
								role="button"
								tabIndex={0}
							>
								<div className="verdict-header">
									<div className="flex justify-between items-start">
										<h3 className="verdict-title">
											<span>🎉 </span>
											<span style={{ color: "var(--success-green)" }}>
												{getShortName(winner.name)}
											</span>
											<span> is faster</span>
										</h3>
										<button
											type="button"
											className="toggle-button"
											onClick={(e) => {
												e.stopPropagation();
												const newState = !isResultsCollapsed;
												setIsResultsCollapsed(newState);
												if (!newState) {
													setIsInputCollapsed(true);
												}
											}}
										>
											{isResultsCollapsed ? (
												<ChevronUp size={18} />
											) : (
												<ChevronDown size={18} />
											)}
										</button>
									</div>
									{!isResultsCollapsed && (
										<p className="verdict-subtext">
											Save{" "}
											<strong>
												{calculateMonthlySavings(routeA, routeB)} hours
											</strong>
											/mo compared to {getShortName(loser.name)}
										</p>
									)}
								</div>

								{!isResultsCollapsed && (
									<div className="comparison-footer">
										<div className="footer-column">
											<div className="flex items-center gap-2">
												<span className="text-xs font-bold">
													{Math.round(routeA.duration / 60)} mins
												</span>
											</div>
											<h4
												title={
													mode === "destinations" ? destA.name : originA.name
												}
											>
												{getShortName(
													mode === "destinations" ? destA.name : originA.name,
												)}
											</h4>
										</div>
										<div
											className="footer-column"
											style={{
												borderLeft: "1px solid rgba(255,255,255,0.08)",
												paddingLeft: "12px",
											}}
										>
											<div className="flex items-center gap-2">
												<span className="text-xs font-bold">
													{Math.round(routeB.duration / 60)} mins
												</span>
											</div>
											<h4
												title={
													mode === "destinations" ? destB.name : originB.name
												}
											>
												{getShortName(
													mode === "destinations" ? destB.name : originB.name,
												)}
											</h4>
										</div>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Comparison Details Modal */}
			{showDetails && routeA && routeB && (
				<div
					className="overlay"
					onClick={() => setShowDetails(false)}
					onKeyDown={(e) => e.key === "Escape" && setShowDetails(false)}
					role="none"
				>
					<div
						className="modal animate-in"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => e.stopPropagation()}
						role="dialog"
						aria-modal="true"
					>
						<div className="flex flex-col justify-between h-full">
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-black uppercase">
									Comparison Details
								</h2>
								<div
									className={`traffic-badge ${trafficInfo.isPeak ? "peak" : ""}`}
								>
									<Clock size={14} />
									<span>{trafficInfo.label}</span>
								</div>
							</div>
							<div className="route-details-card border-A">
								<h3 className="route-name">
									{getShortName(
										mode === "destinations" ? destA.name : originA.name,
									)}
								</h3>
								<div className="metrics-list">
									<div className="detail-metric">
										<Timer size={16} />
										<div className="metric-info">
											<span className="label">Travel Time</span>
											<span className="value">
												{Math.round(routeA.duration / 60)} mins
											</span>
										</div>
									</div>
									<div className="detail-metric">
										<MapPin size={16} />
										<div className="metric-info">
											<span className="label">Distance</span>
											<span className="value">
												{(routeA.distance / 1000).toFixed(1)} km
											</span>
										</div>
									</div>
								</div>
							</div>

							<div className="route-details-card border-B">
								<h3 className="route-name">
									{getShortName(
										mode === "destinations" ? destB.name : originB.name,
									)}
								</h3>
								<div className="metrics-list">
									<div className="detail-metric">
										<Timer size={16} />
										<div className="metric-info">
											<span className="label">Travel Time</span>
											<span className="value">
												{Math.round(routeB.duration / 60)} mins
											</span>
										</div>
									</div>
									<div className="detail-metric">
										<MapPin size={16} />
										<div className="metric-info">
											<span className="label">Distance</span>
											<span className="value">
												{(routeB.distance / 1000).toFixed(1)} km
											</span>
										</div>
									</div>
								</div>
							</div>

							<div className="bottom-line-card">
								<div className="flex items-center gap-3 mb-3">
									<TrendingUp size={24} className="success-icon" />
									<h3 className="text-md font-black uppercase tracking-wider">
										The Verdict
									</h3>
								</div>
								<div className="summary-text">
									By choosing{" "}
									<span className="winner-highlight">
										{getShortName(winner.name)}
									</span>
									, you recover approximately{" "}
									<span className="savings-highlight">
										{calculateMonthlySavings(routeA, routeB)} hours
									</span>{" "}
									every month.
								</div>
								<p className="text-xs opacity-70 mt-2">
									That's valuable time saved for what matters most to you!
								</p>
							</div>

							<button
								type="button"
								className="close-modal-btn"
								onClick={() => setShowDetails(false)}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
