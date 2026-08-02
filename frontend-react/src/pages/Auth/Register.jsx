import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, departmentAPI, positionAPI } from '../../services/api';
import { useToast } from '../../components/common/Toast';

export const Register = () => {
  const [formData, setFormData] = useState({
    tenDangNhap: '',
    matKhau: '',
    confirmPassword: '',
    hoTen: '',
    email: '',
    soDienThoai: '',
    ngaySinh: '',
    gioiTinh: 'Nam',
    maPhongBan: '',
    maChucVu: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    departmentAPI.getAll().then((res) => setDepartments(res.data?.data || [])).catch(() => {});
    positionAPI.getAll().then((res) => setPositions(res.data?.data || [])).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.matKhau !== formData.confirmPassword) {
      addToast('Mật khẩu nhập lại không khớp!', 'warning');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== 'confirmPassword' && formData[key]) {
          data.append(key, formData[key]);
        }
      });
      if (avatar) data.append('avatar', avatar);

      const res = await authAPI.register(data);
      if (res.data && res.data.success) {
        addToast('Đăng ký tài khoản thành công! Vui lòng đăng nhập.', 'success');
        navigate('/login');
      } else {
        addToast(res.data?.message || 'Đăng ký thất bại', 'error');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Đã xảy ra lỗi đăng ký', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      padding: '40px 20px'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '640px', padding: '32px', borderRadius: '16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: '700', color: 'var(--text-main)' }}>Đăng Ký Tài Khoản</h2>
          <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-muted)' }}>Tạo tài khoản hồ sơ nhân viên HATECHNO</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Tên đăng nhập <span className="required">*</span></label>
              <input type="text" name="tenDangNhap" className="form-control" required value={formData.tenDangNhap} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Họ và tên <span className="required">*</span></label>
              <input type="text" name="hoTen" className="form-control" required value={formData.hoTen} onChange={handleChange} />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Mật khẩu <span className="required">*</span></label>
              <input type="password" name="matKhau" className="form-control" required value={formData.matKhau} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Xác nhận mật khẩu <span className="required">*</span></label>
              <input type="password" name="confirmPassword" className="form-control" required value={formData.confirmPassword} onChange={handleChange} />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Email <span className="required">*</span></label>
              <input type="email" name="email" className="form-control" required value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input type="text" name="soDienThoai" className="form-control" value={formData.soDienThoai} onChange={handleChange} />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Phòng ban</label>
              <select name="maPhongBan" className="form-control" value={formData.maPhongBan} onChange={handleChange}>
                <option value="">-- Chọn phòng ban --</option>
                {departments.map((d) => (
                  <option key={d.maPhongBan} value={d.maPhongBan}>{d.tenPhongBan}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Chức vụ</label>
              <select name="maChucVu" className="form-control" value={formData.maChucVu} onChange={handleChange}>
                <option value="">-- Chọn chức vụ --</option>
                {positions.map((p) => (
                  <option key={p.maChucVu} value={p.maChucVu}>{p.tenChucVu}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Ảnh đại diện (Avatar)</label>
            <input type="file" accept="image/*" className="form-control" onChange={(e) => setAvatar(e.target.files[0])} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '14px', marginTop: '12px' }} disabled={loading}>
            {loading ? <i className="fa-solid fa-spinner fa-spin me-2"></i> : <i className="fa-solid fa-user-plus me-2"></i>}
            Đăng Ký Hồ Sơ
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Đã có tài khoản? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};
