import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/dashboard': return 'Dashboard Tổng Quan';
      case '/employees': return 'Quản Lý Nhân Viên';
      case '/departments': return 'Quản Lý Phòng Ban';
      case '/positions': return 'Quản Lý Chức Vụ';
      case '/attendance': return 'Quản Lý Chấm Công';
      case '/schedule': return 'Lịch Làm Việc';
      case '/salary': return 'Quản Lý Bảng Lương';
      case '/my-salary': return 'Lương Cá Nhân';
      case '/rewards': return 'Khen Thưởng & Kỷ Luật';
      case '/leaves': return 'Quản Lý Nghỉ Phép';
      case '/reports': return 'Báo Cáo & Thống Kê';
      case '/profile': return 'Hồ Sơ Cá Nhân';
      default: return 'HATECHNO HRM';
    }
  };

  return (
    <div className="app-wrapper">
      <Sidebar collapsed={collapsed} />
      <div className={`main-content ${collapsed ? 'expanded' : ''}`}>
        <Navbar toggleSidebar={() => setCollapsed(!collapsed)} title={getPageTitle(location.pathname)} />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
