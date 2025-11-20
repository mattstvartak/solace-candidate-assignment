"use client";

import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useAdvocatesStore } from "@/store/advocatesStore";
import { useAdvocates } from "@/hooks/useAdvocates";

export function SearchBar() {
  const {
    searchTerm,
    totalCount,
    isLoading,
    advocates,
    error,
    setSearchTerm,
    setCurrentPage,
    resetSearch,
  } = useAdvocatesStore();

  const { fetchAdvocates } = useAdvocates();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initial fetch on mount
  useEffect(() => {
    fetchAdvocates(1, searchTerm);
  }, []); // Only run once on mount

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchAdvocates(1, value);
    }, 300);
  };

  const clearSearch = () => {
    resetSearch();
    fetchAdvocates(1, "");
  };

  const hasNoResults = advocates.length === 0;

  return (
    <>
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search by name, city, specialty, degree, or experience..."
            value={searchTerm}
            onChange={onChange}
            className="pl-12 pr-12 h-14 text-base shadow-lg border-gray-200 rounded-xl focus-visible:ring-[#285e50]"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {searchTerm && !error && (
          <p className="text-sm text-gray-600 mt-3 text-center">
            Found <span className="font-semibold text-[#285e50]">{totalCount}</span> advocate{totalCount !== 1 ? 's' : ''} matching "{searchTerm}"
          </p>
        )}
        {error && (
          <p className="text-sm text-red-600 mt-3 text-center">
            {error}
          </p>
        )}
      </div>

      {/* No Results State */}
      {hasNoResults && !isLoading && !error && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md mx-auto border border-gray-100 mb-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No advocates found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria or clear filters to see all advocates.
          </p>
          <Button
            onClick={clearSearch}
            variant="outline"
            className="border-[#285e50] text-[#285e50] hover:bg-[#285e50] hover:text-white"
          >
            Clear Search
          </Button>
        </div>
      )}
    </>
  );
}
