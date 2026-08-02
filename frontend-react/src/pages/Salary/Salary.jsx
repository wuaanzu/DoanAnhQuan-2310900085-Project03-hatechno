import React, { useEffect, useState } from 'react';
import { salaryAPI } from '../../services/api';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';
import { Pagination } from '../../components/common/Pagination';

export const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const [thang, setThang] = useState(() => new Date().getMonth() + 1);
  const [nam, setNam] = useState(() => new Date().getFullYear());
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Pagination State (10 items limit)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Detail Modal State
  const [selectedSalary, setSelectedSalary] = useState(null);

  const { addToast } = useToast();
  const { hasRole } = useAuth();

  const fetchSalaries = async (p = 1) => {
    setLoading(true);
    try {
      const res = await salaryAPI.getAll({
        page: p,
        limit: 10,
        thang,
        nam,
        search
      });
      const raw = res.data?.data;
      const list = Array.isArray(raw) ? raw : (raw?.content || raw?.data || []);
      setSalaries(list);

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
      addToast('Lỗi khi tải bảng lương', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries(1);
  }, [thang, nam, search]);

  const handleSyncSalary = async () => {
    try {
      const res = await salaryAPI.syncFromAttendance(thang, nam);
      addToast(`Đã tính toán đồng bộ ${res.data?.data?.length || 0} bảng lương thành công!`, 'success');
      fetchSalaries(page);
    } catch (err) {
      addToast('Lỗi khi đồng bộ tính lương từ chấm công', 'error');
    }
  };

  const handleFinalizeOne = async (id) => {
    try {
      await salaryAPI.finalizeSalary(id);
      addToast('Đã chốt bảng lương!', 'success');
      fetchSalaries(page);
    } catch (err) {
      addToast('Lỗi khi chốt bảng lương', 'error');
    }
  };

  const handleFinalizeAll = async () => {
    try {
      await salaryAPI.finalizeAll(thang, nam);
      addToast('Đã chốt tất cả bảng lương tháng này!', 'success');
      fetchSalaries(page);
    } catch (err) {
      addToast('Lỗi khi chốt bảng lương', 'error');
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const res = await salaryAPI.getOne(id);
      setSelectedSalary(res.data?.data || null);
    } catch (err) {
      addToast('Không thể tải chi tiết bảng lương', 'error');
    }
  };

  const formatVND = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <i className="fa-solid fa-money-bill-wave" style={{ color: 'var(--primary)' }}></i> Quản Lý Bảng Lương
        </div>
        {hasRole(['Admin', 'QuanLy']) && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-success" onClick={handleSyncSalary}>
              <i className="fa-solid fa-rotate"></i> Tính Lương Tự Động
            </button>
            <button className="btn btn-primary" onClick={handleFinalizeAll}>
              <i className="fa-solid fa-lock"></i> Chốt Tất Cả Tháng {thang}/{nam}
            </button>
          </div>
        )}
      </div>

      <div className="card">
        {/* Filter Bar */}
        <div className="filter-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-secondary)' }}>Tháng:</span>
            <select className="form-control" style={{ width: '90px' }} value={thang} onChange={(e) => setThang(parseInt(e.target.value))}>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-secondary)' }}>Năm:</span>
            <input
              type="number"
              className="form-control"
              style={{ width: '100px' }}
              value={nam}
              onChange={(e) => setNam(parseInt(e.target.value))}
            />
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm nhân viên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã BL</th>
                <th>Tên người nhận</th>
                <th>Tháng/Năm</th>
                <th>Tổng thu nhập</th>
                <th>Tổng khấu trừ</th>
                <th>Lương thực nhận</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px' }}>
                    <i className="fa-solid fa-spinner fa-spin me-2"></i> Đang tải bảng lương...
                  </td>
                </tr>
              ) : salaries.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    <i className="fa-solid fa-money-bill-wave"></i> Chưa có dữ liệu bảng lương tháng {thang}/{nam}
                  </td>
                </tr>
              ) : (
                salaries.map((sl) => {
                  const id = sl.maBangLuong || sl.MaBangLuong;
                  const nv = sl.nhanVien || {};
                  const name = nv.hoTen || nv.HoTen || sl.hoTen || sl.HoTen || 'N/A';
                  const email = nv.email || nv.Email || '';
                  const avatar = nv.avatar || nv.Avatar;
                  const dept = nv.tenPhongBan || nv.TenPhongBan || nv.phongBan?.tenPhongBan || sl.tenPhongBan || sl.TenPhongBan || '';
                  const tongThuNhap = sl.tongThuNhap || sl.TongThuNhap || 0;
                  const tongKhauTru = sl.tongKhauTru || sl.TongKhauTru || 0;
                  const luongThucNhan = sl.luongThucNhan || sl.LuongThucNhan || 0;
                  const trangThai = sl.trangThai || sl.TrangThai;

                  return (
                    <tr key={id}>
                      <td><strong>BL{id}</strong></td>
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
                            <div className="employee-code">{dept || email}</div>
                          </div>
                        </div>
                      </td>
                      <td>Tháng {sl.thang}/{sl.nam}</td>
                      <td className="money positive">+{formatVND(tongThuNhap)}</td>
                      <td className="money negative">-{formatVND(tongKhauTru)}</td>
                      <td className="money" style={{ fontSize: '14.5px', color: 'var(--primary)' }}>
                        {formatVND(luongThucNhan)}
                      </td>
                      <td>
                        <span className={`badge ${trangThai === 'DaChot' ? 'badge-finalized' : 'badge-pending'}`}>
                          {trangThai === 'DaChot' ? 'Đã chốt' : 'Chưa chốt'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleViewDetail(id)}>
                            <i className="fa-solid fa-eye me-1"></i> Chi tiết
                          </button>
                          {trangThai !== 'DaChot' && hasRole(['Admin', 'QuanLy']) && (
                            <button className="btn btn-primary btn-sm" onClick={() => handleFinalizeOne(id)}>
                              <i className="fa-solid fa-lock me-1"></i> Chốt
                            </button>
                          )}
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
          onPageChange={(p) => fetchSalaries(p)}
        />
      </div>

      {/* Salary Detail Modal */}
      {selectedSalary && (
        <div className="modal-backdrop-custom" onClick={() => setSelectedSalary(null)}>
          <div className="modal-dialog-custom" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <div className="modal-title-custom">
                <i className="fa-solid fa-file-invoice-dollar"></i> Phiếu Lương Chi Tiết #{selectedSalary.maBangLuong}
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedSalary(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body-custom">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                <div className="employee-avatar-placeholder" style={{ width: '48px', height: '48px', fontSize: '18px' }}>
                  {selectedSalary.nhanVien?.hoTen?.charAt(0) || 'N'}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '16px', color: 'var(--text-main)' }}>
                    {selectedSalary.nhanVien?.hoTen}
                  </h4>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                    Phòng ban: {selectedSalary.nhanVien?.phongBan?.tenPhongBan || '--'} | Kỳ lương: Tháng {selectedSalary.thang}/{selectedSalary.nam}
                  </p>
                </div>
              </div>

              <table className="data-table" style={{ marginBottom: '16px' }}>
                <tbody>
                  <tr>
                    <td>Lương Cơ Bản</td>
                    <td className="money" style={{ textAlign: 'right' }}>{formatVND(selectedSalary.nhanVien?.luongCoBan)}</td>
                  </tr>
                  <tr>
                    <td>Tổng Thu Nhập</td>
                    <td className="money positive" style={{ textAlign: 'right' }}>+{formatVND(selectedSalary.tongThuNhap)}</td>
                  </tr>
                  <tr>
                    <td>Tổng Khấu Trừ / Phạt</td>
                    <td className="money negative" style={{ textAlign: 'right' }}>-{formatVND(selectedSalary.tongKhauTru)}</td>
                  </tr>
                  <tr style={{ background: 'var(--bg-body)', fontWeight: '700' }}>
                    <td style={{ fontSize: '15px' }}>LƯƠNG THỰC NHẬN</td>
                    <td className="money" style={{ textAlign: 'right', fontSize: '17px', color: 'var(--primary)' }}>
                      {formatVND(selectedSalary.luongThucNhan)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {selectedSalary.chiTiet && selectedSalary.chiTiet.length > 0 && (
                <div>
                  <h5 style={{ margin: '14px 0 8px', fontSize: '14px' }}>Các Khoản Chi Tiết</h5>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Loại</th>
                        <th>Mô tả</th>
                        <th style={{ textAlign: 'right' }}>Số tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSalary.chiTiet.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.loaiKhoan}</td>
                          <td>{item.moTa}</td>
                          <td className={`money ${item.loaiKhoan === 'ThuNhap' ? 'positive' : 'negative'}`} style={{ textAlign: 'right' }}>
                            {item.loaiKhoan === 'ThuNhap' ? '+' : '-'}{formatVND(item.soTien)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-footer-custom">
              <button className="btn btn-secondary" onClick={() => setSelectedSalary(null)}>Đóng</button>
              <button className="btn btn-primary" onClick={() => window.print()}>
                <i className="fa-solid fa-print me-1"></i> In Phiếu Lương
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
