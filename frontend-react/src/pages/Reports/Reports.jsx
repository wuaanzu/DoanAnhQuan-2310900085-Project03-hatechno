import React, { useEffect, useState } from 'react';
import { dashboardAPI, reportAPI, salaryAPI } from '../../services/api';
import { useToast } from '../../components/common/Toast';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

export const Reports = () => {
  const [stats, setStats] = useState({});
  const [salaryReport, setSalaryReport] = useState([]);
  const [topEmployees, setTopEmployees] = useState([]);
  const [deptReport, setDeptReport] = useState([]);
  const [costReport, setCostReport] = useState([]);
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  const { addToast } = useToast();

  const fetchReports = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        dashboardAPI.getStats(),
        reportAPI.getSalaryReport(yearFilter),
        reportAPI.getEmployeeReport(),
        reportAPI.getTopEmployees(null, yearFilter),
        reportAPI.getTotalCost()
      ]);

      if (results[0].status === 'fulfilled' && results[0].value.data?.data) {
        setStats(results[0].value.data.data);
      }

      if (results[1].status === 'fulfilled' && results[1].value.data?.data) {
        const raw = results[1].value.data.data;
        setSalaryReport(Array.isArray(raw) ? raw : (raw?.data || []));
      }

      if (results[2].status === 'fulfilled' && results[2].value.data?.data) {
        const raw = results[2].value.data.data;
        setDeptReport(Array.isArray(raw) ? raw : (raw?.data || []));
      }

      if (results[3].status === 'fulfilled' && results[3].value.data?.data) {
        const raw = results[3].value.data.data;
        setTopEmployees(Array.isArray(raw) ? raw : (raw?.data || []));
      }

      if (results[4].status === 'fulfilled' && results[4].value.data?.data) {
        const raw = results[4].value.data.data;
        setCostReport(Array.isArray(raw) ? raw : (raw?.data || []));
      }
    } catch (err) {
      addToast('Không thể kết nối máy chủ báo cáo', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [yearFilter]);

  const handleExportExcel = async () => {
    try {
      addToast('Đang tạo và tải về tệp Excel báo cáo...', 'info');
      const res = await salaryAPI.exportExcel({ nam: yearFilter });
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BaoCao_TongHop_Nam_${yearFilter}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      addToast('Tải về báo cáo Excel thành công!', 'success');
    } catch (err) {
      addToast('Lỗi khi xuất file Excel báo cáo', 'error');
    }
  };

  const formatVND = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

  const COLORS = ['#2563EB', '#7C3AED', '#16A34A', '#D97706', '#0891B2', '#DC2626'];

  const tongNhanVien = stats.tongNhanVien || stats.totalEmployees || stats.TongNhanVien || 0;
  const tongPhongBan = stats.tongPhongBan || stats.soPhongBan || stats.totalDepartments || stats.TongPhongBan || 0;
  const tongQuyLuong = stats.tongLuong || stats.tongThuNhap || stats.totalSalaryPool || stats.TongLuong || 0;
  const donNghiChoDuyet = stats.choPhepNghiPhep || stats.donNghiChoDuyet || 0;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <i className="fa-solid fa-chart-pie" style={{ color: 'var(--primary)' }}></i> Báo Cáo & Thống Kê Tổng Hợp Doanh Nghiệp
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={handleExportExcel}>
            <i className="fa-solid fa-file-excel" style={{ color: '#16A34A' }}></i> Xuất Excel
          </button>
          <button className="btn btn-primary" onClick={() => window.print()}>
            <i className="fa-solid fa-print"></i> In / Export PDF
          </button>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Kỳ Báo Cáo Năm:</span>
            <select
              className="form-control"
              style={{ width: '130px' }}
              value={yearFilter}
              onChange={(e) => setYearFilter(parseInt(e.target.value))}
            >
              <option value={2026}>Năm 2026</option>
              <option value={2025}>Năm 2025</option>
              <option value={2024}>Năm 2024</option>
            </select>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-clock me-1"></i> Báo cáo tổng hợp tự động cập nhật từ CSDL MySQL
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '32px', color: 'var(--primary)' }}></i>
          <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Đang tổng hợp báo cáo dữ liệu...</p>
        </div>
      ) : (
        <div>
          {/* KPI Stat Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="card" style={{ padding: '20px', marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Tổng Nhân Sự</div>
                  <div style={{ fontSize: '26px', fontWeight: '700', color: 'var(--text-main)', marginTop: '4px' }}>
                    {tongNhanVien} <span style={{ fontSize: '13px', fontWeight: '400', color: 'var(--text-muted)' }}>người</span>
                  </div>
                </div>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(37,99,235,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  <i className="fa-solid fa-users"></i>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '20px', marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Phòng Ban</div>
                  <div style={{ fontSize: '26px', fontWeight: '700', color: '#7C3AED', marginTop: '4px' }}>
                    {tongPhongBan} <span style={{ fontSize: '13px', fontWeight: '400', color: 'var(--text-muted)' }}>đơn vị</span>
                  </div>
                </div>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(124,58,237,0.1)', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  <i className="fa-solid fa-building"></i>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '20px', marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Quỹ Lương Hàng Tháng</div>
                  <div style={{ fontSize: '22px', fontWeight: '700', color: 'var(--success)', marginTop: '4px' }}>
                    {formatVND(tongQuyLuong)}
                  </div>
                </div>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(22,163,74,0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  <i className="fa-solid fa-sack-dollar"></i>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '20px', marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Đơn Nghỉ Chờ Duyệt</div>
                  <div style={{ fontSize: '26px', fontWeight: '700', color: 'var(--warning)', marginTop: '4px' }}>
                    {donNghiChoDuyet} <span style={{ fontSize: '13px', fontWeight: '400', color: 'var(--text-muted)' }}>đơn</span>
                  </div>
                </div>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(217,119,6,0.1)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  <i className="fa-solid fa-calendar-minus"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Analytical Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title"><i className="fa-solid fa-chart-column me-2"></i> Biến Động Biểu Đồ Lương Năm {yearFilter}</div>
              </div>
              <div className="card-body" style={{ height: '300px' }}>
                {salaryReport.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salaryReport}>
                      <XAxis dataKey="thang" label={{ value: 'Tháng', position: 'insideBottom', offset: -5 }} />
                      <YAxis />
                      <Tooltip formatter={(val) => formatVND(val)} />
                      <Bar dataKey="tongLuong" fill="#2563EB" name="Tổng chi trả" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-state">Chưa có dữ liệu biểu đồ chi phí lương</div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title"><i className="fa-solid fa-pie-chart me-2"></i> Cơ Cấu Nhân Sự Theo Phòng Ban</div>
              </div>
              <div className="card-body" style={{ height: '300px' }}>
                {deptReport.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deptReport}
                        dataKey="soLuong"
                        nameKey="tenPhongBan"
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        label={(e) => `${e.tenPhongBan || e.TenPhongBan}: ${e.soLuong || e.SoLuong}`}
                      >
                        {deptReport.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-state">Chưa có dữ liệu biểu đồ phân bổ nhân sự</div>
                )}
              </div>
            </div>
          </div>

          {/* Tables Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            {/* Monthly Cost Report Breakdown */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <i className="fa-solid fa-table-list me-2"></i> Báo Cáo Tổng Hợp Chi Phí Lương Theo Các Kỳ Lương
                </div>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Kỳ Lương</th>
                      <th>Số nhân viên</th>
                      <th>Tổng thu nhập</th>
                      <th>Tổng khấu trừ</th>
                      <th>Lương thực nhận</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costReport.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="empty-state">Chưa có dữ liệu báo cáo chi phí lương</td>
                      </tr>
                    ) : (
                      costReport.map((row, idx) => {
                        const thang = row.thang || row.Thang;
                        const nam = row.nam || row.Nam;
                        const count = row.soNhanVien || row.SoNhanVien || tongNhanVien;
                        const thuNhap = row.tongThuNhap || row.TongThuNhap || 0;
                        const khauTru = row.tongKhauTru || row.TongKhauTru || 0;
                        const luong = row.tongLuong || row.TongLuong || row.luongThucNhan || 0;

                        return (
                          <tr key={idx}>
                            <td><strong>Tháng {thang}/{nam}</strong></td>
                            <td>
                              <span className="badge badge-bonus">
                                <i className="fa-solid fa-users me-1"></i> {count} NV
                              </span>
                            </td>
                            <td className="money positive">+{formatVND(thuNhap)}</td>
                            <td className="money negative">-{formatVND(khauTru)}</td>
                            <td className="money" style={{ fontSize: '15px', color: 'var(--primary)' }}>
                              {formatVND(luong)}
                            </td>
                            <td>
                              <span className="badge badge-finalized">Đã Tổng Hợp</span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Employees High Income Report */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <i className="fa-solid fa-trophy me-2" style={{ color: '#D97706' }}></i> Top 10 Nhân Viên Xuất Sắc & Mức Thu Nhập Cao Nhất
                </div>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Hạng</th>
                      <th>Họ và tên</th>
                      <th>Phòng ban</th>
                      <th>Chức vụ</th>
                      <th style={{ textAlign: 'right' }}>Lương thực nhận</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topEmployees.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="empty-state">
                          Chưa có dữ liệu thống kê top nhân viên
                        </td>
                      </tr>
                    ) : (
                      topEmployees.map((emp, idx) => {
                        const name = emp.hoTen || emp.HoTen || '--';
                        const dept = emp.tenPhongBan || emp.TenPhongBan || '--';
                        const cv = emp.tenChucVu || emp.TenChucVu || '--';
                        const luong = emp.luongThucNhan || emp.LuongThucNhan || 0;

                        return (
                          <tr key={idx}>
                            <td>
                              <span className={`badge ${idx === 0 ? 'badge-bonus' : (idx < 3 ? 'badge-active' : 'badge-pending')}`}>
                                Top #{idx + 1}
                              </span>
                            </td>
                            <td><strong style={{ color: 'var(--text-main)' }}>{name}</strong></td>
                            <td>{dept}</td>
                            <td>{cv}</td>
                            <td className="money" style={{ textAlign: 'right', color: 'var(--primary)' }}>
                              {formatVND(luong)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
