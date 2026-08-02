import React, { useEffect, useState } from 'react';
import { attendanceAPI, employeeAPI } from '../../services/api';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';
import { Pagination } from '../../components/common/Pagination';

export const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(1);

  // Modal State for Admin Manual Check-in
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({
    maNhanVien: '',
    ngay: new Date().toISOString().split('T')[0],
    gioVao: '08:00',
    gioRa: '17:00',
    trangThai: 'DungGio',
  });

  const { addToast } = useToast();
  const { hasRole } = useAuth();

  const fetchDailyList = async () => {
    setLoading(true);
    try {
      const res = await attendanceAPI.getDailyList(selectedDate);
      const raw = res.data?.data;
      setAttendanceList(Array.isArray(raw) ? raw : (raw?.data || []));
    } catch (err) {
      addToast('Lỗi khi tải danh sách chấm công', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyList();
  }, [selectedDate]);

  useEffect(() => {
    if (hasRole(['Admin', 'QuanLy'])) {
      employeeAPI.getAll().then((res) => {
        const raw = res.data?.data;
        setEmployees(Array.isArray(raw) ? raw : (raw?.data || []));
      }).catch(() => {});
    }
  }, []);

  const handleCheckIn = async () => {
    try {
      await attendanceAPI.checkIn();
      addToast('Điểm danh vào thành công!', 'success');
      fetchDailyList();
    } catch (err) {
      addToast(err.response?.data?.message || 'Không thể điểm danh vào', 'error');
    }
  };

  const handleCheckOut = async () => {
    try {
      await attendanceAPI.checkOut();
      addToast('Điểm danh ra thành công!', 'success');
      fetchDailyList();
    } catch (err) {
      addToast(err.response?.data?.message || 'Không thể điểm danh ra', 'error');
    }
  };

  const handleAdminCheckIn = async (e) => {
    e.preventDefault();
    try {
      await attendanceAPI.adminCheckIn(adminForm);
      addToast('Chấm công thủ công thành công!', 'success');
      setIsModalOpen(false);
      fetchDailyList();
    } catch (err) {
      addToast('Lỗi khi chấm công thủ công', 'error');
    }
  };

  // Client-side pagination limit 10 items
  const itemsPerPage = 10;
  const totalPages = Math.ceil(attendanceList.length / itemsPerPage) || 1;
  const currentItems = attendanceList.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <i className="fa-solid fa-calendar-check" style={{ color: 'var(--primary)' }}></i> Quản Lý Chấm Công
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-success" onClick={handleCheckIn}>
            <i className="fa-solid fa-right-to-bracket"></i> Check-in Vào
          </button>
          <button className="btn btn-danger" onClick={handleCheckOut}>
            <i className="fa-solid fa-right-from-bracket"></i> Check-out Ra
          </button>
          {hasRole(['Admin', 'QuanLy']) && (
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              <i className="fa-solid fa-pen"></i> Chấm Công Thủ Công
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="filter-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: '600', fontSize: '13.5px', color: 'var(--text-secondary)' }}>Chọn ngày xem:</span>
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
                <th>Mã CC</th>
                <th>Nhân viên</th>
                <th>Phòng ban</th>
                <th>Ngày</th>
                <th>Giờ vào</th>
                <th>Giờ ra</th>
                <th>Số giờ làm</th>
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
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    <i className="fa-solid fa-calendar-check"></i> Không có dữ liệu chấm công cho ngày này
                  </td>
                </tr>
              ) : (
                currentItems.map((att, idx) => {
                  const id = att.maChamCong || att.MaChamCong || idx;
                  const nv = att.nhanVien || {};
                  const name = nv.hoTen || nv.HoTen || att.hoTen || att.HoTen || 'N/A';
                  const email = nv.email || nv.Email || att.email || att.Email || '';
                  const avatar = nv.avatar || nv.Avatar || att.avatar || att.Avatar;
                  const dept = nv.tenPhongBan || nv.TenPhongBan || nv.phongBan?.tenPhongBan || att.tenPhongBan || att.TenPhongBan || '--';
                  const ngay = att.ngay || att.Ngay || att.ngayLam || selectedDate;
                  const gioVao = att.gioVao || att.GioVao || '--:--';
                  const gioRa = att.gioRa || att.GioRa || '--:--';
                  const soGioLam = att.soGioLam || att.SoGioLam;
                  const status = att.trangThai || att.TrangThai || 'DungGio';

                  return (
                    <tr key={id}>
                      <td><strong>CC{id}</strong></td>
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
                      <td>{ngay}</td>
                      <td><strong style={{ color: 'var(--success)' }}>{gioVao}</strong></td>
                      <td><strong style={{ color: 'var(--danger)' }}>{gioRa}</strong></td>
                      <td><strong>{soGioLam != null ? `${soGioLam} giờ` : '--'}</strong></td>
                      <td>
                        <span className={`badge ${status === 'DungGio' || status === 'Đúng giờ' ? 'badge-active' : 'badge-pending'}`}>
                          {status === 'DungGio' || status === 'Đúng giờ' ? 'Đúng giờ' : status}
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
          totalItems={attendanceList.length}
          limit={10}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {isModalOpen && (
        <div className="modal-backdrop-custom" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog-custom" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <div className="modal-title-custom">
                <i className="fa-solid fa-pen"></i> Chấm Công Thủ Công (Admin)
              </div>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleAdminCheckIn}>
              <div className="modal-body-custom">
                <div className="form-group">
                  <label className="form-label">Chọn Nhân Viên <span className="required">*</span></label>
                  <select
                    className="form-control"
                    required
                    value={adminForm.maNhanVien}
                    onChange={(e) => setAdminForm({ ...adminForm, maNhanVien: e.target.value })}
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
                    <label className="form-label">Ngày chấm công</label>
                    <input
                      type="date"
                      className="form-control"
                      value={adminForm.ngay}
                      onChange={(e) => setAdminForm({ ...adminForm, ngay: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Trạng thái</label>
                    <select
                      className="form-control"
                      value={adminForm.trangThai}
                      onChange={(e) => setAdminForm({ ...adminForm, trangThai: e.target.value })}
                    >
                      <option value="DungGio">Đúng giờ</option>
                      <option value="DiMuon">Đi muộn</option>
                      <option value="VeSom">Về sớm</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Giờ vào</label>
                    <input
                      type="time"
                      className="form-control"
                      value={adminForm.gioVao}
                      onChange={(e) => setAdminForm({ ...adminForm, gioVao: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Giờ ra</label>
                    <input
                      type="time"
                      className="form-control"
                      value={adminForm.gioRa}
                      onChange={(e) => setAdminForm({ ...adminForm, gioRa: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer-custom">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Xác Nhận Chấm Công</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
