import React, { useEffect, useState } from 'react';
import { leaveAPI } from '../../services/api';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';
import { Pagination } from '../../components/common/Pagination';

export const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [trangThaiFilter, setTrangThaiFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Modal State for Request Leave
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    loaiNghi: 'Nghỉ phép năm',
    ngayBatDau: new Date().toISOString().split('T')[0],
    ngayKetThuc: new Date().toISOString().split('T')[0],
    lyDo: '',
  });

  const { addToast } = useToast();
  const { hasRole } = useAuth();

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await leaveAPI.getAll({ trangThai: trangThaiFilter || null });
      const raw = res.data?.data;
      setLeaves(Array.isArray(raw) ? raw : (raw?.data || []));
    } catch (err) {
      addToast('Lỗi khi tải danh sách nghỉ phép', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [trangThaiFilter]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await leaveAPI.create(formData);
      addToast('Nộp đơn xin nghỉ phép thành công!', 'success');
      setIsModalOpen(false);
      fetchLeaves();
    } catch (err) {
      addToast('Lỗi khi gửi đơn xin nghỉ phép', 'error');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await leaveAPI.updateStatus(id, status);
      addToast(`Đã ${status === 'DaDuyet' ? 'duyệt' : 'từ chối'} đơn nghỉ phép!`, 'success');
      fetchLeaves();
    } catch (err) {
      addToast('Lỗi khi cập nhật trạng thái đơn', 'error');
    }
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(leaves.length / itemsPerPage) || 1;
  const currentItems = leaves.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <i className="fa-solid fa-calendar-xmark" style={{ color: 'var(--primary)' }}></i> Quản Lý Nghỉ Phép
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <i className="fa-solid fa-plus"></i> Tạo Đơn Xin Nghỉ Phép
        </button>
      </div>

      <div className="card">
        <div className="filter-bar">
          <select className="form-control" style={{ width: '200px' }} value={trangThaiFilter} onChange={(e) => setTrangThaiFilter(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            <option value="ChoDuyet">Chờ duyệt</option>
            <option value="DaDuyet">Đã duyệt</option>
            <option value="TuChoi">Từ chối</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã Đơn</th>
                <th>Nhân viên</th>
                <th>Loại nghỉ</th>
                <th>Từ ngày</th>
                <th>Đến ngày</th>
                <th>Lý do</th>
                <th>Trạng thái</th>
                {hasRole(['Admin', 'QuanLy']) && <th style={{ textAlign: 'right' }}>Duyệt đơn</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px' }}>
                    <i className="fa-solid fa-spinner fa-spin me-2"></i> Đang tải danh sách đơn...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    <i className="fa-solid fa-calendar-xmark"></i> Không tìm thấy đơn xin nghỉ phép nào
                  </td>
                </tr>
              ) : (
                currentItems.map((lv, idx) => {
                  const id = lv.maNghiPhep || lv.maDon || idx;
                  const nv = lv.nhanVien || {};
                  const name = nv.hoTen || nv.HoTen || lv.hoTen || lv.HoTen || '--';
                  const avatar = nv.avatar || nv.Avatar || lv.avatar || lv.Avatar;
                  const dept = nv.tenPhongBan || nv.TenPhongBan || nv.phongBan?.tenPhongBan || lv.tenPhongBan || lv.TenPhongBan || '--';
                  const loai = lv.loaiNghi || lv.LoaiNghi || 'Nghỉ phép năm';
                  const ngayBD = lv.ngayBatDau || lv.NgayBatDau || '--';
                  const ngayKT = lv.ngayKetThuc || lv.NgayKetThuc || '--';
                  const lyDo = lv.lyDo || lv.LyDo || '--';
                  const status = lv.trangThai || lv.TrangThai;

                  return (
                    <tr key={id}>
                      <td><strong>NP{id}</strong></td>
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
                            <div className="employee-code">{dept}</div>
                          </div>
                        </div>
                      </td>
                      <td><strong style={{ color: 'var(--primary)' }}>{loai}</strong></td>
                      <td>{ngayBD}</td>
                      <td>{ngayKT}</td>
                      <td>{lyDo}</td>
                      <td>
                        <span className={`badge ${
                          status === 'DaDuyet' ? 'badge-approved' :
                          status === 'TuChoi' ? 'badge-rejected' : 'badge-pending'
                        }`}>
                          {status === 'DaDuyet' ? 'Đã duyệt' : status === 'TuChoi' ? 'Từ chối' : 'Chờ duyệt'}
                        </span>
                      </td>
                      {hasRole(['Admin', 'QuanLy']) && (
                        <td style={{ textAlign: 'right' }}>
                          {status === 'ChoDuyet' ? (
                            <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                              <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(id, 'DaDuyet')}>
                                <i className="fa-solid fa-check me-1"></i> Duyệt
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleUpdateStatus(id, 'TuChoi')}>
                                <i className="fa-solid fa-xmark me-1"></i> Từ chối
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Đã xử lý</span>
                          )}
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
          totalItems={leaves.length}
          limit={10}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {isModalOpen && (
        <div className="modal-backdrop-custom" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog-custom" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <div className="modal-title-custom">
                <i className="fa-solid fa-paper-plane"></i> Đơn Xin Nghỉ Phép
              </div>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body-custom">
                <div className="form-group">
                  <label className="form-label">Loại nghỉ phép <span className="required">*</span></label>
                  <select
                    className="form-control"
                    value={formData.loaiNghi}
                    onChange={(e) => setFormData({ ...formData, loaiNghi: e.target.value })}
                  >
                    <option value="Nghỉ phép năm">Nghỉ phép năm</option>
                    <option value="Nghỉ ốm đau">Nghỉ ốm đau</option>
                    <option value="Nghỉ thai sản">Nghỉ thai sản</option>
                    <option value="Nghỉ việc riêng (không lương)">Nghỉ việc riêng (không lương)</option>
                  </select>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Từ ngày <span className="required">*</span></label>
                    <input
                      type="date"
                      className="form-control"
                      required
                      value={formData.ngayBatDau}
                      onChange={(e) => setFormData({ ...formData, ngayBatDau: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Đến ngày <span className="required">*</span></label>
                    <input
                      type="date"
                      className="form-control"
                      required
                      value={formData.ngayKetThuc}
                      onChange={(e) => setFormData({ ...formData, ngayKetThuc: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Lý do nghỉ phép <span className="required">*</span></label>
                  <textarea
                    className="form-control"
                    rows="3"
                    required
                    value={formData.lyDo}
                    onChange={(e) => setFormData({ ...formData, lyDo: e.target.value })}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer-custom">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Gửi Đơn Xin Nghỉ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
