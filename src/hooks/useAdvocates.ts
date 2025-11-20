import { useCallback, useRef } from "react";
import { useAdvocatesStore, type SortField, type SortDirection } from "@/store/advocatesStore";

const ITEMS_PER_PAGE = 10;

export function useAdvocates() {
  const {
    setAdvocates,
    setTotalCount,
    setTotalPages,
    setIsLoading,
    setError,
  } = useAdvocatesStore();

  const abortControllerRef = useRef<AbortController | null>(null);
  const pendingRequestRef = useRef<string>("");

  const fetchAdvocates = useCallback(
    async (
      page: number,
      search: string,
      degrees: string[] = [],
      specialties: string[] = [],
      sortField: SortField | null = null,
      sortDirection: SortDirection = "asc"
    ) => {
      // Create unique key for request deduplication
      const requestKey = `${page}-${search}-${degrees.join(",")}-${specialties.join(",")}-${sortField}-${sortDirection}`;

      // Skip if this exact request is already pending
      if (pendingRequestRef.current === requestKey) {
        return;
      }

      pendingRequestRef.current = requestKey;

      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: ITEMS_PER_PAGE.toString(),
          ...(search && { search }),
          ...(sortField && { sortField, sortDirection }),
        });

        // Add degree filters
        degrees.forEach((degree) => {
          params.append("degrees", degree);
        });

        // Add specialty filters
        specialties.forEach((specialty) => {
          params.append("specialties", specialty);
        });

        const response = await fetch(`/api/advocates?${params}`, {
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch advocates: ${response.statusText}`);
        }

        const jsonResponse = await response.json();

        setAdvocates(jsonResponse.data);
        setTotalCount(jsonResponse.pagination.total);
        setTotalPages(jsonResponse.pagination.totalPages);
      } catch (error) {
        // Don't set error state for aborted requests
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        const errorMessage = error instanceof Error ? error.message : "Failed to fetch advocates";
        setError(errorMessage);
        setAdvocates([]);
        setTotalCount(0);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
        // Clear pending request after completion
        if (pendingRequestRef.current === requestKey) {
          pendingRequestRef.current = "";
        }
      }
    },
    [setAdvocates, setTotalCount, setTotalPages, setIsLoading, setError]
  );

  return { fetchAdvocates };
}
