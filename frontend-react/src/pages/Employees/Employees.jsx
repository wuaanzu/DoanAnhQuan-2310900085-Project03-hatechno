import React, { useEffect, useState } from 'react';
import { employeeAPI, departmentAPI, positionAPI } from '../../services/api';
import { useToast } from '../../components/common/Toast';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Pagination } from '../../components/common/Pagination';

export const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [posFilter, setPosFilter] = useState('');

  // Pagination State (10 items per page limit)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [formData, setFormData] = useState({
    hoTen: '',
    email: '',
    soDienThoai: '',
    ngaySinh: '',
    gioiTinh: 'Nam',
    maPhongBan: '',
    maChucVu: '',
    heSoLuong: 1.0,
    luongCoBan: 5000000,
    trangThai: 'DangLam',
  });

  // Delete State
  const [deletingId, setDeletingId] = useState(null);

  const { addToast } = useToast();

  const fetchEmployees = async (p = 1) => {
    setLoading(true);
    try {
      const res = await employeeAPI.getAll({
        page: p,
        limit: 10,
        search,
        maPhongBan: deptFilter || null,
        maChucVu: posFilter || null,
      });
      const raw = res.data?.data;
      const list = Array.isArray(raw) ? raw : (raw?.content || raw?.data || []);
      setEmployees(list);

      const pag = res.data?.pagination;
      if (pag) {
        setPage(pag.page || p);
        setTotalPages(pag.totalPages || 1);
        setTotalItems(pag.total || list.length);
      } else {
        setPage(p);
        setTotalPages(Math.ceil(list.length / 10) || 1);
        setTotalItems(list.length);
      }
    } catch (err) {
      addToast('Lỗi khi tải danh sách nhân viên', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    departmentAPI.getAll().then((res) => {
      const raw = res.data?.data;
      setDepartments(Array.isArray(raw) ? raw : (raw?.data || []));
    }).catch(() => {});

    positionAPI.getAll().then((res) => {
      const raw = res.data?.data;
      setPositions(Array.isArray(raw) ? raw : (raw?.data || []));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetchEmployees(1);
  }, [search, deptFilter, posFilter]);

  const handleOpenModal = (emp = null) => {
    if (emp) {
      setEditingEmp(emp);
      setFormData({
        hoTen: emp.hoTen || emp.HoTen || '',
        email: emp.email || emp.Email || '',
        soDienThoai: emp.soDienThoai || emp.dienThoai || emp.DienThoai || '',
        ngaySinh: emp.ngaySinh || emp.NgaySinh || '',
        gioiTinh: emp.gioiTinh || emp.GioiTinh || 'Nam',
        maPhongBan: emp.maPhongBan || emp.MaPhongBan || emp.phongBan?.maPhongBan || '',
        maChucVu: emp.maChucVu || emp.MaChucVu || emp.chucVu?.maChucVu || '',
        heSoLuong: emp.heSoLuong || emp.HeSoLuong || 1.0,
        luongCoBan: emp.luongCoBan || emp.LuongCoBan || 5000000,
        trangThai: emp.trangThai || emp.TrangThai || 'DangLam',
      });
    } else {
      setEditingEmp(null);
      setFormData({
        hoTen: '',
        email: '',
        soDienThoai: '',
        ngaySinh: '',
        gioiTinh: 'Nam',
        maPhongBan: departments[0]?.maPhongBan || departments[0]?.MaPhongBan || '',
        maChucVu: positions[0]?.maChucVu || positions[0]?.MaChucVu || '',
        heSoLuong: 1.0,
        luongCoBan: 5000000,
        trangThai: 'DangLam',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingEmp) {
        await employeeAPI.update(editingEmp.maNhanVien || editingEmp.MaNhanVien, formData);
        addToast('Cập nhật nhân viên thành công!', 'success');
      } else {
        await employeeAPI.create(formData);
        addToast('Thêm nhân viên thành công!', 'success');
      }
      setIsModalOpen(false);
      fetchEmployees(page);
    } catch (err) {
      addToast(err.response?.data?.message || 'Không thể lưu nhân viên', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await employeeAPI.delete(deletingId);
      addToast('Đã xóa nhân viên', 'success');
      fetchEmployees(page);
    } catch (err) {
      addToast('Lỗi khi xóa nhân viên', 'error');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <i className="fa-solid fa-users" style={{ color: 'var(--primary)' }}></i> Quản Lý Nhân Viên
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <i className="fa-solid fa-plus"></i> Thêm Nhân Viên
        </button>
      </div>

      <div className="card">
        {/* Filter bar */}
        <div className="filter-bar">
          <div style={{ flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm theo tên, email, sđt..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ minWidth: '180px' }}>
            <select className="form-control" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
              <option value="">Tất cả phòng ban</option>
              {departments.map((d) => (
                <option key={d.maPhongBan || d.MaPhongBan} value={d.maPhongBan || d.MaPhongBan}>
                  {d.tenPhongBan || d.TenPhongBan}
                </option>
              ))}
            </select>
          </div>

          <div style={{ minWidth: '180px' }}>
            <select className="form-control" value={posFilter} onChange={(e) => setPosFilter(e.target.value)}>
              <option value="">Tất cả chức vụ</option>
              {positions.map((p) => (
                <option key={p.maChucVu || p.MaChucVu} value={p.maChucVu || p.MaChucVu}>
                  {p.tenChucVu || p.TenChucVu}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Employee Table */}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã NV</th>
                <th>Nhân viên</th>
                <th>Phòng ban</th>
                <th>Chức vụ</th>
                <th>Số điện thoại</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>
                    <i className="fa-solid fa-spinner fa-spin me-2"></i> Đang tải dữ liệu nhân viên...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <i className="fa-solid fa-users"></i>
                    Không tìm thấy nhân viên nào trong CSDL
                  </td>
                </tr>
              ) : (
                employees.map((emp) => {
                  const id = emp.maNhanVien || emp.MaNhanVien;
                  const code = emp.maNV || emp.MaNV || `NV${id}`;
                  const name = emp.hoTen || emp.HoTen || 'N/A';
                  const email = emp.email || emp.Email || '';
                  const phone = emp.soDienThoai || emp.dienThoai || emp.DienThoai || '--';
                  const dept = emp.tenPhongBan || emp.TenPhongBan || emp.phongBan?.tenPhongBan || '--';
                  const pos = emp.tenChucVu || emp.TenChucVu || emp.chucVu?.tenChucVu || '--';
                  const avatar = emp.avatar || emp.Avatar;
                  const status = emp.trangThai || emp.TrangThai;

                  return (
                    <tr key={id}>
                      <td><strong>{code}</strong></td>
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
                      <td>{pos}</td>
                      <td>{phone}</td>
                      <td>
                        <span className={`badge ${status === 'DangLam' || status === 'HoatDong' ? 'badge-active' : 'badge-inactive'}`}>
                          {status === 'DangLam' || status === 'HoatDong' ? 'Đang làm việc' : 'Tạm nghỉ'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleOpenModal(emp)}>
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
          totalItems={totalItems}
          limit={10}
          onPageChange={(p) => fetchEmployees(p)}
        />
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-backdrop-custom" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog-custom" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <div className="modal-title-custom">
                <i className="fa-solid fa-user-gear"></i> {editingEmp ? 'Chỉnh Sửa Nhân Viên' : 'Thêm Nhân Viên Mới'}
              </div>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body-custom">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Họ và tên <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.hoTen}
                      onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email <span className="required">*</span></label>
                    <input
                      type="email"
                      className="form-control"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Số điện thoại</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.soDienThoai}
                      onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ngày sinh</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.ngaySinh}
                      onChange={(e) => setFormData({ ...formData, ngaySinh: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Phòng ban</label>
                    <select
                      className="form-control"
                      value={formData.maPhongBan}
                      onChange={(e) => setFormData({ ...formData, maPhongBan: e.target.value })}
                    >
                      <option value="">-- Chọn phòng ban --</option>
                      {departments.map((d) => (
                        <option key={d.maPhongBan || d.MaPhongBan} value={d.maPhongBan || d.MaPhongBan}>
                          {d.tenPhongBan || d.TenPhongBan}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Chức vụ</label>
                    <select
                      className="form-control"
                      value={formData.maChucVu}
                      onChange={(e) => setFormData({ ...formData, maChucVu: e.target.value })}
                    >
                      <option value="">-- Chọn chức vụ --</option>
                      {positions.map((p) => (
                        <option key={p.maChucVu || p.MaChucVu} value={p.maChucVu || p.MaChucVu}>
                          {p.tenChucVu || p.TenChucVu}
                        </option>
                      ))}
                    </select>
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
        title="Xóa Nhân Viên"
        message="Bạn có chắc chắn muốn xóa nhân viên này khỏi hệ thống?"
        onConfirm={handleDelete}
        onClose={() => setDeletingId(null)}
      />
    </div>
  );
};
