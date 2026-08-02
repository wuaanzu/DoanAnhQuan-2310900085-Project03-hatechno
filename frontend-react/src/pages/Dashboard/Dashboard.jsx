import React, { useEffect, useState } from 'react';
import { dashboardAPI, employeeAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

export const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [salaryChartData, setSalaryChartData] = useState([]);
  const [deptChartData, setDeptChartData] = useState([]);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resStats, resSalary, resDept, resEmp] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getSalaryChart(),
          dashboardAPI.getDepartmentChart(),
          employeeAPI.getAll({ limit: 5 })
        ]);

        if (resStats.data?.data) setStats(resStats.data.data);
        if (resSalary.data?.data) setSalaryChartData(Array.isArray(resSalary.data.data) ? resSalary.data.data : []);
        if (resDept.data?.data) setDeptChartData(Array.isArray(resDept.data.data) ? resDept.data.data : []);

        if (resEmp.data?.data) {
          const raw = resEmp.data.data;
          const list = Array.isArray(raw) ? raw : (raw?.content || raw?.data || []);
          setRecentEmployees(list.slice(0, 5));
        }
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#2563EB', '#7C3AED', '#16A34A', '#D97706', '#0891B2', '#DC2626'];

  const formatVND = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

  const empCount = stats.tongNhanVien || stats.totalEmployees || stats.TongNhanVien || 0;
  const deptCount = stats.tongPhongBan || stats.soPhongBan || stats.totalDepartments || stats.TongPhongBan || 0;
  const totalSalary = stats.tongLuong || stats.tongThuNhap || stats.totalSalaryPool || stats.TongLuong || 0;
  const pendingLeaves = stats.choPhepNghiPhep || stats.donNghiChoDuyet || 0;

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '36px', color: 'var(--primary)' }}></i>
        <p style={{ marginTop: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Đang nạp dữ liệu bảng điều khiển...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(124,58,237,0.08) 100%)',
        border: '1px solid rgba(37,99,235,0.2)',
        padding: '24px 28px',
        marginBottom: '24px',
        borderRadius: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <i className="fa-solid fa-sparkles me-2"></i> HATECHNO HR MANAGEMENT
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '6px 0 4px 0', color: 'var(--text-main)' }}>
              Xin chào, {user?.hoTen || 'Nguyễn Văn An'}! 👋
            </h2>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Hệ thống theo dõi & quản lý tổng thể nhân sự doanh nghiệp thời gian thực.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary" onClick={() => navigate('/employees')}>
              <i className="fa-solid fa-user-plus"></i> Quản Lý Nhân Viên
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/reports')}>
              <i className="fa-solid fa-chart-line"></i> Báo Cáo Thống Kê
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '20px', marginBottom: 0, transition: 'all 0.2s ease-in-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Tổng Nhân Sự</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
                {empCount}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--success)', marginTop: '6px', fontWeight: '600' }}>
                <i className="fa-solid fa-circle-check me-1"></i> Đang hoạt động
              </div>
            </div>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(37,99,235,0.12)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              <i className="fa-solid fa-users"></i>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Số Phòng Ban</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#7C3AED', marginTop: '4px' }}>
                {deptCount}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                <i className="fa-solid fa-building me-1"></i> Đơn vị trực thuộc
              </div>
            </div>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(124,58,237,0.12)', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              <i className="fa-solid fa-sitemap"></i>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Quỹ Lương Hàng Tháng</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--success)', marginTop: '4px' }}>
                {formatVND(totalSalary)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--success)', marginTop: '6px', fontWeight: '600' }}>
                <i className="fa-solid fa-money-bill-transfer me-1"></i> Định kỳ chi trả
              </div>
            </div>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(22,163,74,0.12)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              <i className="fa-solid fa-wallet"></i>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Nghỉ Phép Chờ Duyệt</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--warning)', marginTop: '4px' }}>
                {pendingLeaves}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--warning)', marginTop: '6px', fontWeight: '600' }}>
                <i className="fa-solid fa-clock-rotate-left me-1"></i> Đơn cần xử lý
              </div>
            </div>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(217,119,6,0.12)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              <i className="fa-solid fa-calendar-minus"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Department Distribution Chart */}
        <div className="card">
          <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <div className="card-title"><i className="fa-solid fa-chart-pie me-2" style={{ color: 'var(--primary)' }}></i> Phân Bổ Nhân Sự Theo Phòng Ban</div>
          </div>
          <div className="card-body" style={{ height: '320px', paddingTop: '16px' }}>
            {deptChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deptChartData}
                    dataKey="soLuong"
                    nameKey="tenPhongBan"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    label={(entry) => `${entry.tenPhongBan || entry.TenPhongBan}: ${entry.soLuong || entry.SoLuong}`}
                  >
                    {deptChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <i className="fa-solid fa-chart-pie"></i>
                Chưa có dữ liệu biểu đồ phòng ban
              </div>
            )}
          </div>
        </div>

        {/* Salary Trend Chart */}
        <div className="card">
          <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <div className="card-title"><i className="fa-solid fa-chart-column me-2" style={{ color: '#7C3AED' }}></i> Biến Động Quỹ Lương Theo Tháng</div>
          </div>
          <div className="card-body" style={{ height: '320px', paddingTop: '16px' }}>
            {salaryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryChartData}>
                  <XAxis dataKey="thang" label={{ value: 'Tháng', position: 'insideBottom', offset: -5 }} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatVND(value)} />
                  <Bar dataKey="tongLuong" fill="#2563EB" radius={[6, 6, 0, 0]} name="Tổng chi trả" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <i className="fa-solid fa-chart-column"></i>
                Chưa có dữ liệu biểu đồ lương
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Employees & Quick Shortcuts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Recent Employees */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="card-title"><i className="fa-solid fa-user-group me-2" style={{ color: 'var(--primary)' }}></i> Nhân Viên Mới Nhất</div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/employees')}>
              Xem tất cả <i className="fa-solid fa-arrow-right ms-1"></i>
            </button>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nhân viên</th>
                  <th>Phòng ban</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="empty-state">Chưa có thông tin nhân viên mới</td>
                  </tr>
                ) : (
                  recentEmployees.map((emp) => {
                    const id = emp.maNhanVien || emp.MaNhanVien;
                    const name = emp.hoTen || emp.HoTen;
                    const email = emp.email || emp.Email;
                    const avatar = emp.avatar || emp.Avatar;
                    const dept = emp.phongBan?.tenPhongBan || emp.tenPhongBan || emp.TenPhongBan || '--';

                    return (
                      <tr key={id}>
                        <td>
                          <div className="employee-cell">
                            {avatar ? (
                              <img src={avatar} alt="" className="employee-avatar" />
                            ) : (
                              <div className="employee-avatar-placeholder">
                                {name ? name.charAt(0).toUpperCase() : 'N'}
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
                          <span className="badge badge-active">Đang làm</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-bolt me-2" style={{ color: '#D97706' }}></i> Lối Tắt Quản Lý Nhanh</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', padding: '16px 0' }}>
            <div
              onClick={() => navigate('/employees')}
              style={{
                background: 'var(--bg-sidebar)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}
              className="quick-shortcut"
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(37,99,235,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                <i className="fa-solid fa-users"></i>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '14px', color: 'var(--text-main)' }}>Nhân Viên</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Quản lý hồ sơ</span>
              </div>
            </div>

            <div
              onClick={() => navigate('/departments')}
              style={{
                background: 'var(--bg-sidebar)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}
              className="quick-shortcut"
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(124,58,237,0.1)', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                <i className="fa-solid fa-building"></i>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '14px', color: 'var(--text-main)' }}>Phòng Ban</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Cơ cấu tổ chức</span>
              </div>
            </div>

            <div
              onClick={() => navigate('/attendance')}
              style={{
                background: 'var(--bg-sidebar)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}
              className="quick-shortcut"
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(22,163,74,0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                <i className="fa-solid fa-calendar-check"></i>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '14px', color: 'var(--text-main)' }}>Chấm Công</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Theo dõi vào/ra</span>
              </div>
            </div>

            <div
              onClick={() => navigate('/salary')}
              style={{
                background: 'var(--bg-sidebar)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}
              className="quick-shortcut"
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(217,119,6,0.1)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                <i className="fa-solid fa-sack-dollar"></i>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '14px', color: 'var(--text-main)' }}>Bảng Lương</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tính & chốt lương</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
