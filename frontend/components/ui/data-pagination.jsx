'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Reusable pagination component for data tables
 * @param {Object} pagination - Pagination state object
 * @param {number} pagination.page - Current page number (1-based)
 * @param {number} pagination.per_page - Items per page
 * @param {number} pagination.total - Total number of items
 * @param {number} pagination.last_page - Last page number
 * @param {Function} onPageChange - Callback function when page changes (receives new page number)
 * @param {Function} onPerPageChange - Optional callback function when per_page changes (receives new per_page number)
 * @param {number[]} perPageOptions - Optional array of per page options (default: [10, 25, 50, 100])
 * @param {string} className - Optional additional CSS classes
 */
export function DataPagination({
  pagination,
  onPageChange,
  onPerPageChange,
  perPageOptions = [10, 25, 50, 100],
  className = '',
}) {
  if (!pagination || pagination.last_page <= 1) {
    return null;
  }

  // Set default per_page to 10 if not provided
  const perPage = pagination.per_page || 10;

  const from = (pagination.page - 1) * perPage + 1;
  const to = Math.min(pagination.page * perPage, pagination.total);

  const handlePrevious = () => {
    if (pagination.page > 1) {
      onPageChange(pagination.page - 1);
    }
  };

  const handleNext = () => {
    if (pagination.page < pagination.last_page) {
      onPageChange(pagination.page + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page !== pagination.page && page >= 1 && page <= pagination.last_page) {
      onPageChange(page);
    }
  };

  const handlePerPageChange = (value) => {
    if (onPerPageChange) {
      onPerPageChange(parseInt(value));
    }
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.last_page;
    const currentPage = pagination.page;

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={`flex flex-col md:flex-row justify-between items-center gap-5 text-sm font-medium text-secondary-foreground ${className}`}
    >
      {/* Left: Show per page */}
      {onPerPageChange && (
        <div className="flex items-center gap-2">
          <span>Show</span>
          <Select
            value={perPage.toString()}
            onValueChange={handlePerPageChange}
          >
            <SelectTrigger className="w-16 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {perPageOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>per page</span>
        </div>
      )}

      {/* Center: Page info */}
      <div className="flex items-center">
        <span className="text-secondary-foreground">
          {from}-{to} of {pagination.total}
        </span>
      </div>

      {/* Right: Page navigation */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handlePrevious}
          disabled={pagination.page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-muted-foreground"
              >
                ...
              </span>
            );
          }
          return (
            <Button
              key={page}
              variant={pagination.page === page ? 'default' : 'outline'}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handlePageClick(page)}
            >
              {page}
            </Button>
          );
        })}
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleNext}
          disabled={pagination.page >= pagination.last_page}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

