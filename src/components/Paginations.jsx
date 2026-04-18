import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export function Pagination({ currentPage, totalPages, onPageChange, loading }) {
  const maxVisiblePages = 5;
  const halfVisible = Math.floor(maxVisiblePages / 2);

  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const showEllipsisStart = startPage > 1;
  const showEllipsisEnd = endPage < totalPages;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className="border-slate-300 hover:border-emerald-400 hover:bg-emerald-50"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center gap-2">
        {showEllipsisStart && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              className="border-slate-300 hover:border-emerald-400 hover:bg-emerald-50"
            >
              1
            </Button>
            <MoreHorizontal className="h-4 w-4 text-slate-400" />
          </>
        )}

        {pages.map(page => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            disabled={loading}
            className={currentPage === page
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
              : "border-slate-300 hover:border-emerald-400 hover:bg-emerald-50"
            }
          >
            {page}
          </Button>
        ))}

        {showEllipsisEnd && (
          <>
            <MoreHorizontal className="h-4 w-4 text-slate-400" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              className="border-slate-300 hover:border-emerald-400 hover:bg-emerald-50"
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className="border-slate-300 hover:border-emerald-400 hover:bg-emerald-50"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}