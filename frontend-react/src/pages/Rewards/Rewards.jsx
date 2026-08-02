import React, { useEffect, useState } from 'react';
import { rewardAPI, employeeAPI } from '../../services/api';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Pagination } from '../../components/common/Pagination';

export const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loaiFilter, setLoaiFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    maNhanVien: '',
    loai: 'Thuong',
    soTien: 500000,
    lyDo: '',
    ngayQuyetDinh: new Date().toISOString().split('T')[0],
  });

  const [deletingId, setDeletingId] = useState(null);

  const { addToast } = useToast();
  const { hasRole } = useAuth();

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const res = await rewardAPI.getAll({ loai: loaiFilter || null });
      const raw = res.data?.data;
      setRewards(Array.isArray(raw) ? raw : (raw?.data || []));
    } catch (err) {
      addToast('Lỗi khi tải danh sách khen thưởng/kỷ luật', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, [loaiFilter]);

  useEffect(() => {
    if (hasRole(['Admin', 'QuanLy'])) {
      employeeAPI.getAll().then((res) => {
        const raw = res.data?.data;
        setEmployees(Array.isArray(raw) ? raw : (raw?.data || []));
      }).catch(() => {});
    }
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await rewardAPI.create(formData);
      addToast('Tạo quyết định khen thưởng/kỷ luật thành công!', 'success');
      setIsModalOpen(false);
      fetchRewards();
    } catch (err) {
      addToast('Lỗi khi thêm khen thưởng/kỷ luật', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await rewardAPI.delete(deletingId);
      addToast('Đã xóa quyết định', 'success');
      fetchRewards();
    } catch (err) {
      addToast('Lỗi khi xóa quyết định', 'error');
    }
  };

  const formatVND = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(rewards.length / itemsPerPage) || 1;
  const currentItems = rewards.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <i className="fa-solid fa-trophy" style={{ color: 'var(--primary)' }}></i> Khen Thưởng & Kỷ Luật
        </div>
        {hasRole(['Admin', 'QuanLy']) && (
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <i className="fa-solid fa-plus"></i> Thêm Quyết Định
          </button>
        )}
      </div>

      <div className="card">
        <div className="filter-bar">
          <select className="form-control" style={{ width: '200px' }} value={loaiFilter} onChange={(e) => setLoaiFilter(e.target.value)}>
            <option value="">Tất cả loại quyết định</option>
            <option value="Thuong">Khen Thưởng (+)</option>
            <option value="KyLuat">Kỷ Luật (-)</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã QĐ</th>
                <th>Nhân viên</th>
                <th>Phòng ban</th>
                <th>Loại quyết định</th>
                <th>Lý do / Nội dung</th>
                <th>Số tiền</th>
                <th>Ngày quyết định</th>
                {hasRole(['Admin', 'QuanLy']) && <th style={{ textAlign: 'right' }}>Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px' }}>
                    <i className="fa-solid fa-spinner fa-spin me-2"></i> Đang tải dữ liệu...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    <i className="fa-solid fa-trophy"></i> Chưa có quyết định khen thưởng/kỷ luật nào
                  </td>
                </tr>
              ) : (
                currentItems.map((rw, idx) => {
                  const id = rw.maKTKL || rw.MaKTKL || rw.maKhenThuongKyLuat || idx;
                  const name = rw.hoTen || rw.HoTen || rw.nhanVien?.hoTen || '--';
                  const email = rw.email || rw.Email || rw.nhanVien?.email || '';
                  const avatar = rw.avatar || rw.Avatar || rw.nhanVien?.avatar;
                  const dept = rw.tenPhongBan || rw.TenPhongBan || rw.nhanVien?.phongBan?.tenPhongBan || '--';
                  const isThuong = (rw.loai || rw.Loai) === 'Thuong' || (rw.loai || rw.Loai) === 'KhenThuong';
                  const soTien = rw.soTien || rw.SoTien || 0;
                  const lyDo = rw.lyDo || rw.LyDo || '--';
                  const ngay = rw.ngay || rw.Ngay || rw.ngayQuyetDinh || '--';

                  return (
                    <tr key={id}>
                      <td><strong>QĐ{id}</strong></td>
                      <td>
                        <div className="employee-cell">
                          {avatar ? (
                            <img src={avatar} alt="" className="employee-avatar" />
                          ) : (
                            <div className="employee-avatar-placeholder">
                              {name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="employee-name">{name}</div>
                            <div className="employee-code">{email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{dept}</td>
                      <td>
                        <span className={`badge ${isThuong ? 'badge-bonus' : 'badge-discipline'}`}>
                          {isThuong ? 'Khen Thưởng' : 'Kỷ Luật'}
                        </span>
                      </td>
                      <td>{lyDo}</td>
                      <td className={`money ${isThuong ? 'positive' : 'negative'}`}>
                        {isThuong ? '+' : '-'}{formatVND(soTien)}
                      </td>
                      <td>{ngay}</td>
                      {hasRole(['Admin', 'QuanLy']) && (
                        <td style={{ textAlign: 'right' }}>
                          <button className="btn btn-danger btn-sm" onClick={() => setDeletingId(id)}>
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      )}
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
          totalItems={rewards.length}
          limit={10}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {isModalOpen && (
        <div className="modal-backdrop-custom" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog-custom" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <div className="modal-title-custom">
                <i className="fa-solid fa-award"></i> Thêm Quyết Định Khen Thưởng / Kỷ Luật
              </div>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body-custom">
                <div className="form-group">
                  <label className="form-label">Chọn Nhân Viên <span className="required">*</span></label>
                  <select
                    className="form-control"
                    required
                    value={formData.maNhanVien}
                    onChange={(e) => setFormData({ ...formData, maNhanVien: e.target.value })}
                  >
                    <option value="">-- Chọn nhân viên --</option>
                    {employees.map((emp) => {
                      const empId = emp.maNhanVien || emp.MaNhanVien;
                      const empName = emp.hoTen || emp.HoTen;
                      return (
                        <option key={empId} value={empId}>
                          {empName} (NV{empId})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Loại quyết định</label>
                    <select
                      className="form-control"
                      value={formData.loai}
                      onChange={(e) => setFormData({ ...formData, loai: e.target.value })}
                    >
                      <option value="Thuong">Khen Thưởng (+)</option>
                      <option value="KyLuat">Kỷ Luật (-)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Số tiền (VND)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.soTien}
                      onChange={(e) => setFormData({ ...formData, soTien: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Lý do / Nội dung <span className="required">*</span></label>
                  <textarea
                    className="form-control"
                    rows="3"
                    required
                    value={formData.lyDo}
                    onChange={(e) => setFormData({ ...formData, lyDo: e.target.value })}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Ngày quyết định</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.ngayQuyetDinh}
                    onChange={(e) => setFormData({ ...formData, ngayQuyetDinh: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer-custom">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Tạo Quyết Định</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deletingId}
        title="Xóa Quyết Định"
        message="Bạn có chắc chắn muốn xóa quyết định này?"
        onConfirm={handleDelete}
        onClose={() => setDeletingId(null)}
      />
    </div>
  );
};
