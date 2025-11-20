import { create } from "zustand";
import { Advocate } from "@/db/schema";

interface AdvocatesState {
  advocates: Advocate[];
  searchTerm: string;
  currentPage: number;
  totalCount: number;
  totalPages: number;
  isLoading: boolean;
  setAdvocates: (advocates: Advocate[]) => void;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
  setTotalCount: (count: number) => void;
  setTotalPages: (pages: number) => void;
  setIsLoading: (loading: boolean) => void;
  resetSearch: () => void;
}

export const useAdvocatesStore = create<AdvocatesState>((set) => ({
  advocates: [],
  searchTerm: "",
  currentPage: 1,
  totalCount: 0,
  totalPages: 0,
  isLoading: false,
  setAdvocates: (advocates) => set({ advocates }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalCount: (count) => set({ totalCount: count }),
  setTotalPages: (pages) => set({ totalPages: pages }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  resetSearch: () => set({ searchTerm: "", currentPage: 1 }),
}));
