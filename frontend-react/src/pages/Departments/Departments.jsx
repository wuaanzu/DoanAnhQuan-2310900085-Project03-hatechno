import React, { useEffect, useState } from 'react';
import { departmentAPI } from '../../services/api';
import { useToast } from '../../components/common/Toast';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Pagination } from '../../components/common/Pagination';

export const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({ tenPhongBan: '', moTa: '' });
  const [deletingId, setDeletingId] = useState(null);

  const { addToast } = useToast();

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await departmentAPI.getAll();
      const raw = res.data?.data;
      setDepartments(Array.isArray(raw) ? raw : (raw?.data || []));
    } catch (err) {
      addToast('Lỗi khi tải danh sách phòng ban', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleOpenModal = (dept = null) => {
    if (dept) {
      setEditingDept(dept);
      setFormData({
        tenPhongBan: dept.tenPhongBan || dept.TenPhongBan || '',
        moTa: dept.moTa || dept.MoTa || ''
      });
    } else {
      setEditingDept(null);
      setFormData({ tenPhongBan: '', moTa: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await departmentAPI.update(editingDept.maPhongBan || editingDept.MaPhongBan, formData);
        addToast('Cập nhật phòng ban thành công!', 'success');
      } else {
        await departmentAPI.create(formData);
        addToast('Thêm phòng ban thành công!', 'success');
      }
      setIsModalOpen(false);
      fetchDepartments();
    } catch (err) {
      addToast('Lỗi khi lưu phòng ban', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await departmentAPI.delete(deletingId);
      addToast('Đã xóa phòng ban', 'success');
      fetchDepartments();
    } catch (err) {
      addToast('Không thể xóa phòng ban đang có nhân viên', 'error');
    }
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(departments.length / itemsPerPage) || 1;
  const currentItems = departments.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <i className="fa-solid fa-building" style={{ color: 'var(--primary)' }}></i> Quản Lý Phòng Ban
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <i className="fa-solid fa-plus"></i> Thêm Phòng Ban
        </button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã PB</th>
                <th>Tên phòng ban</th>
                <th>Mô tả</th>
                <th>Số nhân viên</th>
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
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">
                    <i className="fa-solid fa-building"></i> Chưa có phòng ban nào
                  </td>
                </tr>
              ) : (
                currentItems.map((dept) => {
                  const id = dept.maPhongBan || dept.MaPhongBan;
                  const name = dept.tenPhongBan || dept.TenPhongBan;
                  const desc = dept.moTa || dept.MoTa || 'Chưa có mô tả';
                  const empCount = dept.soNhanVien || dept.SoNhanVien || 0;

                  return (
                    <tr key={id}>
                      <td><strong>PB{id}</strong></td>
                      <td><strong style={{ color: 'var(--primary)' }}>{name}</strong></td>
                      <td>{desc}</td>
                      <td>
                        <span className="badge badge-bonus">
                          <i className="fa-solid fa-users me-1"></i> {empCount} Nhân viên
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleOpenModal(dept)}>
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => setDeletingId(id)}>
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={departments.length}
          limit={10}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {isModalOpen && (
        <div className="modal-backdrop-custom" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog-custom" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <div className="modal-title-custom">
                <i className="fa-solid fa-building"></i> {editingDept ? 'Sửa Phòng Ban' : 'Thêm Phòng Ban'}
              </div>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body-custom">
                <div className="form-group">
                  <label className="form-label">Tên phòng ban <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.tenPhongBan}
                    onChange={(e) => setFormData({ ...formData, tenPhongBan: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mô tả phòng ban</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.moTa}
                    onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                  ></textarea>
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
        title="Xóa Phòng Ban"
        message="Bạn có chắc muốn xóa phòng ban này?"
        onConfirm={handleDelete}
        onClose={() => setDeletingId(null)}
      />
    </div>
  );
};
