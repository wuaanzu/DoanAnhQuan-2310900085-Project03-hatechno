// =====================================================
// HATECHNO HRM - Server Entry Point
// Node.js + Express - Kiến trúc MVC
// Author: Đoàn Anh Quân - 2310900085
// =====================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const positionRoutes = require('./routes/positionRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const reportRoutes = require('./routes/reportRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files - Phục vụ file tĩnh (HTML, CSS, JS, Images)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== API Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/profile', profileRoutes);

// ===== Serve HTML Pages =====
// Trang chủ redirect về login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html'));
});

// Route cho các trang HTML
const pages = ['login', 'register', 'dashboard', 'employees', 'departments',
               'positions', 'attendance', 'salary', 'rewards', 'leaves',
               'reports', 'profile'];

pages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'pages', `${page}.html`));
    });
});

// ===== Error Handler =====
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Lỗi máy chủ nội bộ',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// 404 Handler
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ success: false, message: 'API không tồn tại' });
    }
    res.redirect('/');
});

// ===== Start Server =====
app.listen(PORT, () => {
    console.log('====================================');
    console.log('🚀 HATECHNO HRM System Started!');
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`👤 Login: http://localhost:${PORT}/login`);
    console.log('====================================');
});

module.exports = app;
