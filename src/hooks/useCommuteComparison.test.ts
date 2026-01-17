import { act, renderHook, waitFor } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import * as osrmService from "../services/osrm";
import { useCommuteComparison } from "./useCommuteComparison";

// Mock the service
vi.mock("../services/osrm", () => ({
	fetchRoute: vi.fn(),
}));

describe("useCommuteComparison", () => {
	it("should initialize with default values", () => {
		const { result } = renderHook(() => useCommuteComparison());

		expect(result.current.mode).toBe("destinations");
		expect(result.current.originA).toBeDefined();
		expect(result.current.routeA).toBeNull();
		expect(result.current.routeB).toBeNull();
		expect(result.current.isLoading).toBe(true); // Initially true because effect runs
	});

	it("should switch mode", () => {
		const { result } = renderHook(() => useCommuteComparison());

		act(() => {
			result.current.handleModeSwitch("origins");
		});

		expect(result.current.mode).toBe("origins");
	});

	it("should fetch routes on initialization", async () => {
		const mockRoute = {
			distance: 1000,
			duration: 600,
			geometry: "abc",
		};
		vi.mocked(osrmService.fetchRoute).mockResolvedValue(mockRoute);

		const { result } = renderHook(() => useCommuteComparison());

		await waitFor(() => expect(result.current.isLoading).toBe(false));

		expect(result.current.routeA).toEqual(mockRoute);
		expect(result.current.routeB).toEqual(mockRoute);
	});
});
