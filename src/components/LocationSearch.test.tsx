import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import * as geocodingService from "../services/geocoding";
import { LocationSearch } from "./LocationSearch";

// Mock the geocoding service
vi.mock("../services/geocoding", () => ({
	searchLocation: vi.fn(),
}));

describe("LocationSearch", () => {
	const mockLocation = { name: "Current Place", lat: 10, lng: 20 };
	const mockOnChange = vi.fn();

	it("renders correctly with initial value", () => {
		render(
			<LocationSearch
				label="Test Label"
				value={mockLocation}
				onChange={mockOnChange}
			/>,
		);
		expect(screen.getByLabelText("Test Label")).toHaveValue("Current Place");
	});

	it("updates input value on user type", () => {
		render(
			<LocationSearch
				label="Search"
				value={mockLocation}
				onChange={mockOnChange}
			/>,
		);
		const input = screen.getByLabelText("Search");
		fireEvent.input(input, { target: { value: "New Query" } });
		expect(input).toHaveValue("New Query");
	});

	it("searches and displays results", async () => {
		const mockResults = [{ name: "Result 1", lat: 1, lng: 1 }];
		vi.mocked(geocodingService.searchLocation).mockResolvedValue(mockResults);

		render(
			<LocationSearch
				label="Search"
				value={mockLocation}
				onChange={mockOnChange}
			/>,
		);

		const input = screen.getByLabelText("Search");
		fireEvent.input(input, { target: { value: "Result" } });
		fireEvent.focus(input);

		await waitFor(() => {
			expect(geocodingService.searchLocation).toHaveBeenCalledWith(
				"Result",
				undefined,
			);
		});

		await waitFor(() => {
			expect(screen.getByText("Result 1")).toBeInTheDocument();
		});
	});

	it("selects a location from dropdown", async () => {
		const mockResults = [{ name: "Selected Place", lat: 30, lng: 40 }];
		vi.mocked(geocodingService.searchLocation).mockResolvedValue(mockResults);

		render(
			<LocationSearch
				label="Search"
				value={mockLocation}
				onChange={mockOnChange}
			/>,
		);

		const input = screen.getByLabelText("Search");
		fireEvent.input(input, { target: { value: "Select" } });
		fireEvent.focus(input);

		await waitFor(() =>
			expect(screen.getByText("Selected Place")).toBeInTheDocument(),
		);

		fireEvent.click(screen.getByText("Selected Place"));

		expect(mockOnChange).toHaveBeenCalledWith(mockResults[0]);
		// Input should update to selected name (this might need checking internal state or re-render)
	});
});
