import React, { useEffect, useState } from 'react';
import { salaryAPI, employeeAPI } from '../../services/api';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';
import { Pagination } from '../../components/common/Pagination';

export const MySalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState('');
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const { addToast } = useToast();
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole(['Admin']);

  const fetchSalaries = async (p = 1) => {
    setLoading(true);
    try {
      const res = await salaryAPI.getAll({
        page: p,
        limit: 10,
        maNhanVien: selectedEmp || null
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
      addToast('Không thể tải lịch sử nhận tiền', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries(1);
  }, [selectedEmp]);

  useEffect(() => {
    if (isAdmin) {
      employeeAPI.getAll().then((res) => {
        const raw = res.data?.data;
        setEmployees(Array.isArray(raw) ? raw : (raw?.data || []));
      }).catch(() => {});
    }
  }, [isAdmin]);

  const formatVND = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <i className="fa-solid fa-wallet" style={{ color: 'var(--primary)' }}></i>
          {isAdmin ? ' Quản Lý Lịch Sử Nhận Tiền Lương Toàn Bộ Nhân Viên' : ' Lịch Sử Nhận Tiền Cá Nhân'}
        </div>
      </div>

      <div className="card">
        {isAdmin && (
          <div className="filter-bar" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-secondary)' }}>Lọc theo nhân viên (Quyền Admin):</span>
              <select
                className="form-control"
                style={{ width: '250px' }}
                value={selectedEmp}
                onChange={(e) => setSelectedEmp(e.target.value)}
              >
                <option value="">-- Tất cả người nhận tiền --</option>
                {employees.map((emp) => {
                  const id = emp.maNhanVien || emp.MaNhanVien;
                  const name = emp.hoTen || emp.HoTen;
                  return (
                    <option key={id} value={id}>
                      {name} (NV{id})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        )}

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã BL</th>
                <th>Tên người nhận</th>
                <th>Kỳ Lương</th>
                <th>Tổng thu nhập</th>
                <th>Tổng khấu trừ</th>
                <th>Lương thực nhận</th>
                <th>Ngày lập</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px' }}>
                    <i className="fa-solid fa-spinner fa-spin me-2"></i> Đang tải dữ liệu...
                  </td>
                </tr>
              ) : salaries.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    <i className="fa-solid fa-wallet"></i> Chưa có lịch sử nhận tiền nào
                  </td>
                </tr>
              ) : (
                salaries.map((sl) => {
                  const id = sl.maBangLuong || sl.MaBangLuong;
                  const thang = sl.thang || sl.Thang;
                  const nam = sl.nam || sl.Nam;
                  const tongThuNhap = sl.tongThuNhap || sl.TongThuNhap || 0;
                  const tongKhauTru = sl.tongKhauTru || sl.TongKhauTru || 0;
                  const luongThucNhan = sl.luongThucNhan || sl.LuongThucNhan || 0;
                  const ngayLap = sl.ngayLap || sl.NgayLap || '--';
                  const trangThai = sl.trangThai || sl.TrangThai;

                  const nv = sl.nhanVien || {};
                  const recipientName = nv.hoTen || nv.HoTen || sl.hoTen || sl.HoTen || user?.hoTen || 'N/A';
                  const recipientEmail = nv.email || nv.Email || user?.email || '';
                  const recipientAvatar = nv.avatar || nv.Avatar;

                  return (
                    <tr key={id}>
                      <td><strong>BL{id}</strong></td>
                      <td>
                        <div className="employee-cell">
                          {recipientAvatar ? (
                            <img src={recipientAvatar} alt="" className="employee-avatar" />
                          ) : (
                            <div className="employee-avatar-placeholder">
                              {recipientName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="employee-name">{recipientName}</div>
                            <div className="employee-code">{recipientEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td><strong>Tháng {thang}/{nam}</strong></td>
                      <td className="money positive">+{formatVND(tongThuNhap)}</td>
                      <td className="money negative">-{formatVND(tongKhauTru)}</td>
                      <td className="money" style={{ fontSize: '15px', color: 'var(--primary)' }}>
                        {formatVND(luongThucNhan)}
                      </td>
                      <td>{ngayLap}</td>
                      <td>
                        <span className={`badge ${trangThai === 'DaChot' ? 'badge-finalized' : 'badge-pending'}`}>
                          {trangThai === 'DaChot' ? 'Đã chốt' : 'Tạm tính'}
                        </span>
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
    </div>
  );
};
