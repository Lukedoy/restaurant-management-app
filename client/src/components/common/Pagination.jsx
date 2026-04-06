import React from 'react';
import '../../styles/Common.css';

const Pagination = ({ page, pages, total, onPageChange }) => {
  if (pages <= 1) return null;

  const getPageNumbers = () => {
    const nums = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(pages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      nums.push(i);
    }
    return nums;
  };

  return (
    <nav className="pagination" role="navigation" aria-label="Pagination">
      <div className="pagination-info">
        Showing page {page} of {pages} ({total} total)
      </div>
      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          ‹ Prev
        </button>
        {getPageNumbers().map(num => (
          <button
            key={num}
            className={`pagination-btn ${num === page ? 'active' : ''}`}
            onClick={() => onPageChange(num)}
            aria-label={`Page ${num}`}
            aria-current={num === page ? 'page' : undefined}
          >
            {num}
          </button>
        ))}
        <button
          className="pagination-btn"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          aria-label="Next page"
        >
          Next ›
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
