import { Search } from "lucide-preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { searchLocation } from "../services/geocoding";
import type { Location } from "../types";

interface LocationSearchProps {
	label: string;
	value: Location;
	onChange: (loc: Location) => void;
	placeholder?: string;
}

export function LocationSearch({
	label,
	value,
	onChange,
	placeholder,
}: LocationSearchProps) {
	const [query, setQuery] = useState(value.name);
	const [results, setResults] = useState<Location[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Sync query with value prop
	useEffect(() => {
		setQuery(value.name);
	}, [value.name]);

	useEffect(() => {
		let active = true;
		const timer = setTimeout(async () => {
			if (query.length > 2 && query !== value.name) {
				setLoading(true);
				const res = await searchLocation(query);
				if (active) {
					setResults(res);
					setIsOpen(true);
					setLoading(false);
				}
			} else {
				if (active) {
					setResults([]);
					setIsOpen(false);
				}
			}
		}, 500);

		return () => {
			active = false;
			clearTimeout(timer);
		};
	}, [query, value.name]);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div
			className="input-group"
			style={{ position: "relative" }}
			ref={dropdownRef}
		>
			<label htmlFor={`search-${label}`}>{label}</label>
			<div style={{ position: "relative" }}>
				<input
					id={`search-${label}`}
					type="text"
					value={query}
					onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
					placeholder={placeholder}
					style={{ width: "100%", paddingRight: "30px" }}
					onFocus={() => query.length > 2 && setIsOpen(true)}
				/>
				<Search
					size={16}
					style={{
						position: "absolute",
						right: "8px",
						top: "10px",
						color: "var(--text-dim)",
					}}
				/>
			</div>

			{isOpen && (results.length > 0 || loading) && (
				<div
					className="dropdown card"
					style={{
						position: "absolute",
						top: "100%",
						left: 0,
						right: 0,
						zIndex: 2000,
						marginTop: "4px",
						maxHeight: "200px",
						overflowY: "auto",
						padding: "4px",
					}}
				>
					{loading ? (
						<div style={{ padding: "8px", fontSize: "12px" }}>Searching...</div>
					) : (
						results.map((loc, i) => (
							<button
								key={i}
								className="dropdown-item"
								type="button"
								onClick={() => {
									onChange(loc);
									setQuery(loc.name);
									setIsOpen(false);
								}}
								style={{
									display: "block",
									width: "100%",
									textAlign: "left",
									background: "transparent",
									color: "inherit",
									padding: "8px",
									cursor: "pointer",
									fontSize: "13px",
									border: "none",
									borderBottom:
										i < results.length - 1 ? "1px solid #333" : "none",
								}}
							>
								{loc.name}
							</button>
						))
					)}{" "}
				</div>
			)}
		</div>
	);
}
