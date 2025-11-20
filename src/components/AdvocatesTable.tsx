"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Award } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useAdvocatesStore } from "@/store/advocatesStore";
import { useAdvocates } from "@/hooks/useAdvocates";
import { memo, useMemo } from "react";
import type { Advocate } from "@/db/schema";

const ITEMS_PER_PAGE = 10;

// Memoized table row component to prevent unnecessary re-renders
const AdvocateRow = memo(({
  advocate,
  index,
  selectedSpecialties
}: {
  advocate: Advocate;
  index: number;
  selectedSpecialties: string[];
}) => {
  const specialtiesArray = Array.isArray(advocate.specialties)
    ? advocate.specialties
    : [];

  // Sort specialties: filtered ones first (highlighted), then alphabetically
  const sortedSpecialties = useMemo(() => {
    return [...specialtiesArray]
      .map((s) => String(s))
      .sort((a, b) => {
        const aIsFiltered = selectedSpecialties.includes(a);
        const bIsFiltered = selectedSpecialties.includes(b);

        if (aIsFiltered && !bIsFiltered) return -1;
        if (!aIsFiltered && bIsFiltered) return 1;
        return a.localeCompare(b);
      });
  }, [specialtiesArray, selectedSpecialties]);

  const formatPhoneNumber = (phone: number | null | undefined): string => {
    if (phone == null) {
      return "N/A";
    }

    const phoneStr = phone.toString();

    if (phoneStr.length !== 10) {
      return phoneStr;
    }

    return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(6)}`;
  };

  return (
    <TableRow
      className="hover:bg-teal-50/50 transition-colors border-b border-gray-100 last:border-0"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <TableCell className="font-medium py-4 text-gray-900 pl-6">
        {advocate.firstName} {advocate.lastName}
      </TableCell>
      <TableCell className="pl-6">
        <Badge
          variant="secondary"
          className="bg-[#285e50]/10 text-[#285e50] hover:bg-[#285e50]/10 font-medium"
        >
          {advocate.degree}
        </Badge>
      </TableCell>
      <TableCell className="text-gray-700 pl-6">{advocate.city}</TableCell>
      <TableCell className="text-gray-700 pl-6">
        <div className="flex items-center gap-1.5">
          <Award className="h-3.5 w-3.5 text-amber-500" />
          <span>
            <span className="font-semibold text-gray-900">
              {advocate.yearsOfExperience}
            </span>{" "}
            years
          </span>
        </div>
      </TableCell>
      <TableCell className="pl-6">
        <div className="flex flex-wrap gap-1.5 max-w-xs">
          {sortedSpecialties.slice(0, 2).map((specialty, idx) => {
            const isFiltered = selectedSpecialties.includes(specialty);
            return (
              <Badge
                key={idx}
                className={`text-xs font-medium ${
                  isFiltered
                    ? 'bg-[#285e50] text-white hover:bg-[#285e50]'
                    : ''
                }`}
              >
                {specialty}
              </Badge>
            );
          })}
          {sortedSpecialties.length > 2 && (
            <Badge variant="secondary" className="text-xs font-medium">
              +{sortedSpecialties.length - 2}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="text-gray-700 font-mono text-sm pl-6">
        {formatPhoneNumber(advocate.phoneNumber)}
      </TableCell>
    </TableRow>
  );
});

AdvocateRow.displayName = 'AdvocateRow';

export function AdvocatesTable() {
  const {
    advocates,
    searchTerm,
    selectedDegrees,
    selectedSpecialties,
    currentPage,
    totalCount,
    totalPages,
    isLoading,
    setCurrentPage,
  } = useAdvocatesStore();

  const { fetchAdvocates } = useAdvocates();

  const goToPage = (page: number) => {
    setCurrentPage(page);
    fetchAdvocates(page, searchTerm, selectedDegrees, selectedSpecialties);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalCount);

  const hasNoResults = advocates.length === 0;

  return (
    <>
      {/* Table */}
      {!hasNoResults && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <Table className="table-fixed">
              <colgroup>
                <col className="w-[180px]" />
                <col className="w-[100px]" />
                <col className="w-[140px]" />
                <col className="w-[120px]" />
                <col className="w-[280px]" />
                <col className="w-[140px]" />
              </colgroup>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-50 hover:to-gray-100 border-b border-gray-200">
                  <TableHead className="font-semibold text-gray-900 py-4 pl-6">Name</TableHead>
                  <TableHead className="font-semibold text-gray-900 pl-6">Degree</TableHead>
                  <TableHead className="font-semibold text-gray-900 pl-6">City</TableHead>
                  <TableHead className="font-semibold text-gray-900 pl-6">Experience</TableHead>
                  <TableHead className="font-semibold text-gray-900 pl-6">Specialties</TableHead>
                  <TableHead className="font-semibold text-gray-900 pl-6">Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="pl-6">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Spinner className="text-[#285e50]" />
                        <p className="text-gray-600 font-medium">Loading advocates...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  advocates.map((advocate, index) => (
                    <AdvocateRow
                      key={advocate.id}
                      advocate={advocate}
                      index={index}
                      selectedSpecialties={selectedSpecialties}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {!isLoading && advocates.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 border-t bg-gray-50">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{startIndex + 1}</span> to{" "}
                <span className="font-semibold text-gray-900">{endIndex}</span> of{" "}
                <span className="font-semibold text-gray-900">{totalCount}</span> advocates
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="gap-1.5 border-gray-300 hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-md">
                  <span className="text-sm text-gray-700">
                    Page <span className="font-semibold text-[#285e50]">{currentPage}</span> of{" "}
                    <span className="font-semibold">{totalPages}</span>
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="gap-1.5 border-gray-300 hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
