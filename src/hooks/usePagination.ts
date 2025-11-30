import { useState } from "react";

export function usePagination<T>(data: T[], itemsPerPage = 9) {
  const safeData = Array.isArray(data) ? data : [];
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(safeData.length / itemsPerPage);

  const paginatedData = safeData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    setCurrentPage,
  };
}