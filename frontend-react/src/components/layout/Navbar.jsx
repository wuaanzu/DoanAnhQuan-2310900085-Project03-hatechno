import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';

export const Navbar = ({ toggleSidebar, title = 'HATECHNO HRM' }) => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogout = () => {
    logout();
    addToast('Đã đăng xuất thành công', 'success');
    navigate('/login');
  };

  const avatarUrl = user?.avatar
    ? (user.avatar.startsWith('http') ? user.avatar : `${user.avatar}`)
    : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.hoTen || 'User') + '&background=2563EB&color=fff';

  return (
    <nav className="navbar-top">
      <button className="navbar-toggle" onClick={toggleSidebar}>
        <i className="fa-solid fa-bars"></i>
      </button>
      <span className="navbar-title">{title}</span>

      <div className="navbar-actions">
        <button className="theme-toggle" onClick={toggleTheme} title="Đổi giao diện Sáng/Tối">
          <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
        </button>

        <div className="dropdown">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="navbar-avatar"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`} onMouseLeave={() => setDropdownOpen(false)}>
            <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
              <i className="fa-solid fa-user"></i> Hồ sơ cá nhân
            </Link>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item danger" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
