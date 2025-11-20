import { create } from "zustand";
import { Advocate } from "@/db/schema";

export type SortField = "name" | "degree" | "city" | "experience";
export type SortDirection = "asc" | "desc";

interface AdvocatesState {
  advocates: Advocate[];
  searchTerm: string;
  selectedDegrees: string[];
  selectedSpecialties: string[];
  currentPage: number;
  totalCount: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  sortField: SortField | null;
  sortDirection: SortDirection;
  setAdvocates: (advocates: Advocate[]) => void;
  setSearchTerm: (term: string) => void;
  setSelectedDegrees: (degrees: string[]) => void;
  setSelectedSpecialties: (specialties: string[]) => void;
  setCurrentPage: (page: number) => void;
  setTotalCount: (count: number) => void;
  setTotalPages: (pages: number) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSorting: (field: SortField | null, direction: SortDirection) => void;
  resetSearch: () => void;
  clearFilters: () => void;
}

export const useAdvocatesStore = create<AdvocatesState>((set) => ({
  advocates: [],
  searchTerm: "",
  selectedDegrees: [],
  selectedSpecialties: [],
  currentPage: 1,
  totalCount: 0,
  totalPages: 0,
  isLoading: false,
  error: null,
  sortField: null,
  sortDirection: "asc",
  setAdvocates: (advocates) => set({ advocates }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedDegrees: (degrees) => set({ selectedDegrees: degrees }),
  setSelectedSpecialties: (specialties) => set({ selectedSpecialties: specialties }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalCount: (count) => set({ totalCount: count }),
  setTotalPages: (pages) => set({ totalPages: pages }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setSorting: (field, direction) => set({ sortField: field, sortDirection: direction }),
  resetSearch: () => set({ searchTerm: "", currentPage: 1 }),
  clearFilters: () => set({ searchTerm: "", selectedDegrees: [], selectedSpecialties: [], currentPage: 1 }),
}));
