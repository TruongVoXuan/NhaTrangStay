import "./Pagination.scss";
import { ChevronLeft, ChevronRight } from "lucide-react";
 
function Pagination({
  currentPage = 0,
  totalPages = 0,
  onPageChange = () => {},
}) {
  if (totalPages <= 1) return null;
 
  const goTo = (page) => {
    if (page !== currentPage && page >= 0 && page <= totalPages - 1) {
      onPageChange(page);
    }
  };
 
  // Generate page numbers to display (max 5 visible, with ellipses)
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);
 
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }
 
    const pages = [];
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };
 
  const pageNumbers = getPageNumbers();
 
  return (
    <nav className="pagination" aria-label="Phân trang">
      <button
        className="pagination-arrow"
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 0}
        aria-label="Trang trước"
      >
        <ChevronLeft size={18} />
      </button>
 
      <div className="page-numbers">
        {pageNumbers[0] > 0 && (
          <>
            <button className="page-num" onClick={() => goTo(0)}>
              1
            </button>
            {pageNumbers[0] > 1 && <span className="ellipsis">···</span>}
          </>
        )}
 
        {pageNumbers.map((page) => (
          <button
            key={page}
            className={`page-num ${page === currentPage ? "active" : ""}`}
            onClick={() => goTo(page)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page + 1}
          </button>
        ))}
 
        {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 2 && (
              <span className="ellipsis">···</span>
            )}
            <button className="page-num" onClick={() => goTo(totalPages - 1)}>
              {totalPages}
            </button>
          </>
        )}
      </div>
 
      <button
        className="pagination-arrow"
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        aria-label="Trang sau"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
 
export default Pagination;