import {
	Activity,
	ChevronDown,
	ChevronUp,
	Map as MapIcon,
	MapPin,
	Timer,
	TrendingUp,
	X,
} from "lucide-preact";
import { useEffect, useState } from "preact/hooks";
import { Toaster } from "sonner";
import { LocationSearch } from "./components/LocationSearch";
import { CommuteMap } from "./components/Map";
import { useCommuteComparison } from "./hooks/useCommuteComparison";
import type { RouteData } from "./types";
import {
	calculateMonthlySavings,
	getShortName,
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

	const [showDetails, setShowDetails] = useState(false);
	const [isInputCollapsed, setIsInputCollapsed] = useState(false);
	const [isResultsCollapsed, setIsResultsCollapsed] = useState(false);

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

	const StressBadge = ({ route }: { route: RouteData }) => {
		const stress = getTrafficStress(route);
		return (
			<span className={`stress-badge stress-${stress.label.toLowerCase()}`}>
				{stress.label}
			</span>
		);
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
					<div className="toggle-header">
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
					</div>
					<p
						className="text-xs text-dim mb-4"
						style={{ padding: "0 4px", opacity: 0.8 }}
					>
						{mode === "destinations"
							? "Comparing 2 destinations from 1 starting point."
							: "Comparing 2 starting points to 1 destination."}
					</p>
				</header>

				<div className="panels-container">
					{/* Floating Input Panel */}
					<aside
						className={`floating-panel input-panel animate-in ${isInputCollapsed ? "collapsed" : ""}`}
					>
						{isInputCollapsed ? (
							<button
								type="button"
								className="input-summary"
								onClick={() => {
									setIsInputCollapsed(false);
									setIsResultsCollapsed(true);
								}}
							>
								<div className="flex items-center gap-3">
									<MapPin size={16} color="var(--primary-color)" />
									<span className="text-xs font-bold uppercase tracking-wider">
										{mode === "destinations"
											? `${getShortName(originA.name)} → ${getShortName(destA.name)} vs ${getShortName(destB.name)}`
											: `${getShortName(originA.name)} vs ${getShortName(originB.name)} → ${getShortName(destA.name)}`}
									</span>
								</div>
								<div className="toggle-button">
									<ChevronDown size={18} />
								</div>
							</button>
						) : (
							<>
								<div className="flex justify-between items-center mb-4">
									<div className="flex items-center gap-2">
										<MapPin size={18} color="var(--primary-color)" />
										<h2 className="text-sm uppercase tracking-wider font-bold">
											Locations
										</h2>
									</div>
									{routeA && routeB && (
										<button
											type="button"
											className="toggle-button"
											onClick={() => {
												setIsInputCollapsed(true);
												setIsResultsCollapsed(false); // Mutual exclusivity
											}}
										>
											<ChevronUp size={18} />
										</button>
									)}
								</div>
								<div className="flex flex-col gap-4">
									{mode === "destinations" ? (
										<>
											<LocationSearch
												label="Starting Point"
												value={originA}
												onChange={setOriginA}
											/>
											<LocationSearch
												label="Option A"
												value={destA}
												onChange={setDestA}
											/>
											<LocationSearch
												label="Option B"
												value={destB}
												onChange={setDestB}
											/>
										</>
									) : (
										<>
											<LocationSearch
												label="Option A"
												value={originA}
												onChange={setOriginA}
											/>
											<LocationSearch
												label="Option B"
												value={originB}
												onChange={setOriginB}
											/>
											<LocationSearch
												label="Destination"
												value={destA}
												onChange={setDestA}
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
							<button
								type="button"
								className="verdict-card animate-in text-left w-full"
								onClick={() => setShowDetails(true)}
								onMouseMove={handleMouseMove}
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
										<div
											className="toggle-button"
											onClick={(e) => {
												e.stopPropagation();
												const newState = !isResultsCollapsed;
												setIsResultsCollapsed(newState);
												if (!newState) {
													setIsInputCollapsed(true);
												}
											}}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.stopPropagation();
													const newState = !isResultsCollapsed;
													setIsResultsCollapsed(newState);
													if (!newState) {
														setIsInputCollapsed(true);
													}
												}
											}}
											// biome-ignore lint/a11y/useSemanticElements: Nesting buttons causes issues, using role="button"
											role="button"
											tabIndex={0}
										>
											{isResultsCollapsed ? (
												<ChevronUp size={18} />
											) : (
												<ChevronDown size={18} />
											)}
										</div>
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
											<h4
												title={
													mode === "destinations" ? destA.name : originA.name
												}
											>
												{getShortName(
													mode === "destinations" ? destA.name : originA.name,
												)}
											</h4>
											<div className="flex items-center gap-2">
												<span className="text-xs font-bold">
													{Math.round(routeA.duration / 60)}m
												</span>
												<StressBadge route={routeA} />
											</div>
										</div>
										<div
											className="footer-column"
											style={{
												borderLeft: "1px solid rgba(255,255,255,0.08)",
												paddingLeft: "12px",
											}}
										>
											<h4
												title={
													mode === "destinations" ? destB.name : originB.name
												}
											>
												{getShortName(
													mode === "destinations" ? destB.name : originB.name,
												)}
											</h4>
											<div className="flex items-center gap-2">
												<span className="text-xs font-bold">
													{Math.round(routeB.duration / 60)}m
												</span>
												<StressBadge route={routeB} />
											</div>
										</div>
									</div>
								)}
							</button>
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
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-lg font-black uppercase">
								Comparison Details
							</h2>
							<button
								type="button"
								onClick={() => setShowDetails(false)}
								style={{ background: "transparent" }}
							>
								<X size={24} color="var(--text-dim)" />
							</button>
						</div>

						<div className="flex flex-col gap-6">
							<div className="details-grid">
								<div className="route-details-card border-A">
									<div className="route-badge">Option A</div>
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
										<div className="detail-metric">
											<Activity size={16} />
											<div className="metric-info">
												<span className="label">Stress Level</span>
												<div className="flex items-center gap-2">
													<span className="value uppercase">
														{getTrafficStress(routeA).label}
													</span>
													<StressBadge route={routeA} />
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="route-details-card border-B">
									<div className="route-badge">Option B</div>
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
										<div className="detail-metric">
											<Activity size={16} />
											<div className="metric-info">
												<span className="label">Stress Level</span>
												<div className="flex items-center gap-2">
													<span className="value uppercase">
														{getTrafficStress(routeB).label}
													</span>
													<StressBadge route={routeB} />
												</div>
											</div>
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
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
