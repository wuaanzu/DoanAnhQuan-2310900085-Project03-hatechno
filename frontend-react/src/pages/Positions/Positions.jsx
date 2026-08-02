import React, { useEffect, useState } from 'react';
import { positionAPI } from '../../services/api';
import { useToast } from '../../components/common/Toast';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPos, setEditingPos] = useState(null);
  const [formData, setFormData] = useState({ tenChucVu: '', phuCap: 0, luongCoBan: 5000000 });
  const [deletingId, setDeletingId] = useState(null);

  const { addToast } = useToast();

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const res = await positionAPI.getAll();
      setPositions(res.data?.data || []);
    } catch (err) {
      addToast('Lỗi khi tải danh sách chức vụ', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleOpenModal = (pos = null) => {
    if (pos) {
      setEditingPos(pos);
      setFormData({
        tenChucVu: pos.tenChucVu || '',
        phuCap: pos.phuCap || 0,
        luongCoBan: pos.luongCoBan || 5000000,
      });
    } else {
      setEditingPos(null);
      setFormData({ tenChucVu: '', phuCap: 0, luongCoBan: 5000000 });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingPos) {
        await positionAPI.update(editingPos.maChucVu, formData);
        addToast('Cập nhật chức vụ thành công!', 'success');
      } else {
        await positionAPI.create(formData);
        addToast('Thêm chức vụ thành công!', 'success');
      }
      setIsModalOpen(false);
      fetchPositions();
    } catch (err) {
      addToast('Lỗi khi lưu chức vụ', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await positionAPI.delete(deletingId);
      addToast('Đã xóa chức vụ', 'success');
      fetchPositions();
    } catch (err) {
      addToast('Không thể xóa chức vụ đang được gán cho nhân viên', 'error');
    }
  };

  const formatVND = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <i className="fa-solid fa-briefcase" style={{ color: 'var(--primary)' }}></i> Quản Lý Chức Vụ
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <i className="fa-solid fa-plus"></i> Thêm Chức Vụ
        </button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã CV</th>
                <th>Tên chức vụ</th>
                <th>Lương cơ bản</th>
                <th>Phụ cấp chức vụ</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>
                    <i className="fa-solid fa-spinner fa-spin me-2"></i> Đang tải dữ liệu...
                  </td>
                </tr>
              ) : positions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">
                    <i className="fa-solid fa-briefcase"></i> Chưa có chức vụ nào
                  </td>
                </tr>
              ) : (
                positions.map((pos) => (
                  <tr key={pos.maChucVu}>
                    <td><strong>CV{pos.maChucVu}</strong></td>
                    <td><strong style={{ color: 'var(--primary)' }}>{pos.tenChucVu}</strong></td>
                    <td className="money">{formatVND(pos.luongCoBan)}</td>
                    <td className="money positive">+{formatVND(pos.phuCap)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenModal(pos)}>
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeletingId(pos.maChucVu)}>
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop-custom" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog-custom" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <div className="modal-title-custom">
                <i className="fa-solid fa-briefcase"></i> {editingPos ? 'Chỉnh Sửa Chức Vụ' : 'Thêm Chức Vụ Mới'}
              </div>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body-custom">
                <div className="form-group">
                  <label className="form-label">Tên chức vụ <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.tenChucVu}
                    onChange={(e) => setFormData({ ...formData, tenChucVu: e.target.value })}
                  />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Lương cơ bản (VND)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.luongCoBan}
                      onChange={(e) => setFormData({ ...formData, luongCoBan: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phụ cấp chức vụ (VND)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.phuCap}
                      onChange={(e) => setFormData({ ...formData, phuCap: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer-custom">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu Thay Đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deletingId}
        title="Xóa Chức Vụ"
        message="Bạn có chắc chắn muốn xóa chức vụ này?"
        onConfirm={handleDelete}
        onClose={() => setDeletingId(null)}
      />
    </div>
  );
};
