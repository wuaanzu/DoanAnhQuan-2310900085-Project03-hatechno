import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';

export const Login = () => {
  const [tenDangNhap, setTenDangNhap] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [ghiNho, setGhiNho] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tenDangNhap || !matKhau) {
      addToast('Vui lòng điền đầy đủ tên đăng nhập và mật khẩu', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.login({
        identifier: tenDangNhap,
        tenDangNhap: tenDangNhap,
        password: matKhau,
        matKhau: matKhau,
        rememberMe: ghiNho
      });
      if (res.data && res.data.token) {
        login(res.data.token, res.data.user);
        addToast('Đăng nhập thành công!', 'success');
        navigate('/dashboard');
      } else {
        addToast(res.data?.message || 'Đăng nhập thất bại', 'error');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Tài khoản hoặc mật khẩu không chính xác', 'error');
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
      padding: '20px'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '32px', borderRadius: '16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg,#2563EB,#7C3AED)',
            color: '#fff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            marginBottom: '12px'
          }}>
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: '700', color: 'var(--text-main)' }}>Đăng Nhập HATECHNO</h2>
          <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-muted)' }}>Hệ thống quản trị nhân sự tổng thể</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tên đăng nhập / Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập tên đăng nhập"
                value={tenDangNhap}
                onChange={(e) => setTenDangNhap(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              placeholder="Nhập mật khẩu"
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={ghiNho}
                onChange={(e) => setGhiNho(e.target.checked)}
              />
              Ghi nhớ đăng nhập
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '14px' }}
            disabled={loading}
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin me-2"></i> : <i className="fa-solid fa-right-to-bracket me-2"></i>}
            Đăng Nhập
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Chưa có tài khoản nhân viên?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
};
