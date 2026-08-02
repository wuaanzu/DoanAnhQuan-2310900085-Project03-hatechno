import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ collapsed }) => {
  const { user } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { path: '/employees', label: 'Nhân viên', icon: 'fa-users' },
    { path: '/departments', label: 'Phòng ban', icon: 'fa-building' },
    { path: '/positions', label: 'Chức vụ', icon: 'fa-briefcase' },
    { path: '/attendance', label: 'Chấm công', icon: 'fa-calendar-check' },
    { path: '/schedule', label: 'Theo dõi Lịch làm', icon: 'fa-calendar-days' },
    { path: '/salary', label: 'Bảng lương', icon: 'fa-money-bill-wave' },
    { path: '/my-salary', label: 'Lương cá nhân', icon: 'fa-wallet' },
    { path: '/rewards', label: 'Thưởng / KL', icon: 'fa-trophy' },
    { path: '/leaves', label: 'Nghỉ phép', icon: 'fa-calendar-xmark' },
    { path: '/reports', label: 'Báo cáo', icon: 'fa-chart-bar' },
    { path: '/profile', label: 'Hồ sơ cá nhân', icon: 'fa-circle-user' },
  ];

  const avatarUrl = user?.avatar
    ? (user.avatar.startsWith('http') ? user.avatar : `${user.avatar}`)
    : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.hoTen || 'User') + '&background=2563EB&color=fff';

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <i className="fa-solid fa-shield-halved"></i>
        </div>
        <div className="sidebar-brand">
          HATECHNO<span>HR Management</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="nav-icon">
              <i className={`fa-solid ${item.icon}`}></i>
            </div>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <img src={avatarUrl} alt="Avatar" className="sidebar-user-avatar" />
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.hoTen || user?.tenDangNhap || 'Người dùng'}</div>
            <div className="sidebar-user-role">{user?.tenQuyen || 'Nhân Viên'}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
