import React from 'react';

export const Pagination = ({ currentPage, totalPages, totalItems, limit = 10, onPageChange }) => {
  if (totalPages <= 1) return null;

  const startItem = Math.min((currentPage - 1) * limit + 1, totalItems);
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      marginTop: '16px',
      padding: '12px 16px',
      background: 'var(--bg-sidebar)',
      borderRadius: '8px',
      border: '1px solid var(--border-color)',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
        Hiển thị <strong style={{ color: 'var(--text-main)' }}>{startItem} - {endItem}</strong> trên tổng số <strong style={{ color: 'var(--text-main)' }}>{totalItems}</strong> bản ghi (10 bản ghi/trang)
      </div>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <button
          className="btn btn-secondary btn-sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          style={{ padding: '6px 12px' }}
        >
          <i className="fa-solid fa-chevron-left me-1"></i> Trước
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            className={`btn btn-sm ${p === currentPage ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => onPageChange(p)}
            style={{ minWidth: '32px', padding: '6px' }}
          >
            {p}
          </button>
        ))}

        <button
          className="btn btn-secondary btn-sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          style={{ padding: '6px 12px' }}
        >
          Sau <i className="fa-solid fa-chevron-right ms-1"></i>
        </button>
      </div>
    </div>
  );
};
