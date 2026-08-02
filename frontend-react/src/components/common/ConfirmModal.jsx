import React from 'react';

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onClose, confirmText = 'Xác nhận', cancelText = 'Hủy' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-dialog-custom" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-custom" style={{ background: 'var(--danger)', color: '#fff', borderTopLeftRadius: 'var(--radius)', borderTopRightRadius: 'var(--radius)' }}>
          <div className="modal-title-custom" style={{ color: '#fff' }}>
            <i className="fa-solid fa-triangle-exclamation"></i> {title || 'Xác nhận'}
          </div>
          <button className="modal-close-btn" style={{ color: '#fff' }} onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="modal-body-custom">
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.5' }}>{message}</p>
        </div>
        <div className="modal-footer-custom">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            {cancelText}
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => { onConfirm(); onClose(); }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
