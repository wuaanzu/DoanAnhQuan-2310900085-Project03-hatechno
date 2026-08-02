import React, { useEffect, useState } from 'react';
import { attendanceAPI } from '../../services/api';
import { useToast } from '../../components/common/Toast';

export const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToast } = useToast();

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await attendanceAPI.getDailyList(selectedDate);
      const raw = res.data?.data;
      const list = Array.isArray(raw) ? raw : (raw?.data || []);
      setSchedules(list);
    } catch (err) {
      addToast('Lỗi khi tải lịch làm việc', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [selectedDate]);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <i className="fa-solid fa-calendar-days" style={{ color: 'var(--primary)' }}></i> Theo Dõi Lịch Làm Việc & Phân Ca
        </div>
      </div>

      <div className="card">
        <div className="filter-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: '600', fontSize: '13.5px', color: 'var(--text-secondary)' }}>Chọn ngày làm việc:</span>
            <input
              type="date"
              className="form-control"
              style={{ width: '180px' }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã Nhật Ký</th>
                <th>Nhân viên</th>
                <th>Phòng ban</th>
                <th>Ngày làm việc</th>
                <th>Giờ vào</th>
                <th>Giờ ra</th>
                <th>Ca / Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>
                    <i className="fa-solid fa-spinner fa-spin me-2"></i> Đang tải dữ liệu...
                  </td>
                </tr>
              ) : schedules.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <i className="fa-solid fa-calendar-days"></i> Chưa có dữ liệu phân ca/chấm công cho ngày này
                  </td>
                </tr>
              ) : (
                schedules.map((sch) => {
                  const id = sch.maChamCong || sch.MaChamCong;
                  const nv = sch.nhanVien || {};
                  const name = nv.hoTen || nv.HoTen || sch.hoTen || sch.HoTen || 'N/A';
                  const email = nv.email || nv.Email || '';
                  const dept = nv.tenPhongBan || nv.TenPhongBan || nv.phongBan?.tenPhongBan || sch.tenPhongBan || sch.TenPhongBan || '--';
                  const ngay = sch.ngay || sch.Ngay || selectedDate;
                  const gioVao = sch.gioVao || sch.GioVao || '08:00';
                  const gioRa = sch.gioRa || sch.GioRa || '17:00';
                  const status = sch.trangThai || sch.TrangThai || 'DungGio';

                  return (
                    <tr key={id}>
                      <td><strong>LL{id}</strong></td>
                      <td>
                        <div className="employee-cell">
                          {nv.avatar || sch.avatar ? (
                            <img src={nv.avatar || sch.avatar} alt="" className="employee-avatar" />
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
                      <td><strong>{ngay}</strong></td>
                      <td><strong style={{ color: 'var(--success)' }}>{gioVao}</strong></td>
                      <td><strong style={{ color: 'var(--danger)' }}>{gioRa}</strong></td>
                      <td>
                        <span className={`badge ${status === 'DungGio' ? 'badge-active' : 'badge-pending'}`}>
                          {status === 'DungGio' ? 'Ca Hành Chính (Đúng giờ)' : status}
                        </span>
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
  );
};
