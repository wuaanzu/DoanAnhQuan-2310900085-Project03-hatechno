import React, { useEffect, useState } from 'react';
import { profileAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';

export const Profile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({
    hoTen: '',
    email: '',
    soDienThoai: '',
    ngaySinh: '',
    gioiTinh: 'Nam',
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    profileAPI.getProfile()
      .then((res) => {
        const data = res.data?.data;
        if (data) {
          setProfile({
            hoTen: data.hoTen || '',
            email: data.email || '',
            soDienThoai: data.soDienThoai || '',
            ngaySinh: data.ngaySinh || '',
            gioiTinh: data.gioiTinh || 'Nam',
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await profileAPI.updateProfile(profile);
      if (res.data?.data) {
        setUser((prev) => ({ ...prev, ...res.data.data }));
      }
      addToast('Cập nhật hồ sơ cá nhân thành công!', 'success');
    } catch (err) {
      addToast('Lỗi khi cập nhật hồ sơ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast('Mật khẩu mới nhập lại không khớp', 'warning');
      return;
    }
    try {
      await profileAPI.changePassword({
        matKhauCu: passwordData.oldPassword,
        matKhauMoi: passwordData.newPassword,
      });
      addToast('Đổi mật khẩu thành công!', 'success');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      addToast('Lỗi đổi mật khẩu! Mật khẩu cũ không chính xác', 'error');
    }
  };

  const avatarUrl = user?.avatar
    ? (user.avatar.startsWith('http') ? user.avatar : `${user.avatar}`)
    : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.hoTen || 'User') + '&background=2563EB&color=fff';

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <i className="fa-solid fa-circle-user" style={{ color: 'var(--primary)' }}></i> Hồ Sơ Cá Nhân
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* User Card */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div className="card-body" style={{ textAlign: 'center', padding: '30px' }}>
            <img
              src={avatarUrl}
              alt="Avatar"
              style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary)', marginBottom: '16px' }}
            />
            <h3 style={{ margin: '0 0 6px', fontSize: '18px', color: 'var(--text-main)' }}>{user?.hoTen || user?.tenDangNhap}</h3>
            <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--text-muted)' }}>{user?.email}</p>
            <span className="badge badge-bonus" style={{ fontSize: '13px', padding: '6px 14px' }}>
              {user?.tenQuyen || 'Nhân Viên'}
            </span>
          </div>
        </div>

        {/* Profile Info Form */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="fa-solid fa-pen-to-square me-2"></i> Thông Tin Cá Nhân</div>
          </div>
          <div className="card-body">
            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label className="form-label">Họ và tên</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={profile.hoTen}
                  onChange={(e) => setProfile({ ...profile, hoTen: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.soDienThoai}
                    onChange={(e) => setProfile({ ...profile, soDienThoai: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Ngày sinh</label>
                  <input
                    type="date"
                    className="form-control"
                    value={profile.ngaySinh}
                    onChange={(e) => setProfile({ ...profile, ngaySinh: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Giới tính</label>
                  <select
                    className="form-control"
                    value={profile.gioiTinh}
                    onChange={(e) => setProfile({ ...profile, gioiTinh: e.target.value })}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <i className="fa-solid fa-spinner fa-spin me-1"></i> : <i className="fa-solid fa-floppy-disk me-1"></i>}
                Lưu Thay Đổi
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Password Change Card */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <div className="card-title"><i className="fa-solid fa-key me-2"></i> Đổi Mật Khẩu</div>
        </div>
        <div className="card-body">
          <form onSubmit={handleChangePassword}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Mật khẩu hiện tại <span className="required">*</span></label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mật khẩu mới <span className="required">*</span></label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Xác nhận mật khẩu mới <span className="required">*</span></label>
              <input
                type="password"
                className="form-control"
                required
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-warning">
              <i className="fa-solid fa-shield-halved me-1"></i> Cập Nhật Mật Khẩu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
