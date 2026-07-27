// =====================================================
// Controller: Authentication (Đăng nhập / Đăng ký)
// =====================================================

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const UserModel = require('../models/userModel');
const db = require('../config/database');

require('dotenv').config();

/**
 * POST /api/auth/login
 * Đăng nhập bằng username/email + password
 */
const login = async (req, res) => {
    try {
        const { identifier, password, rememberMe } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập tên đăng nhập/email và mật khẩu'
            });
        }

        // Tìm theo username hoặc email
        let user = await UserModel.findByUsername(identifier);
        if (!user) {
            user = await UserModel.findByEmail(identifier);
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Tài khoản không tồn tại hoặc đã bị khóa'
            });
        }

        // Kiểm tra mật khẩu
        const isMatch = await UserModel.comparePassword(password, user.MatKhau);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Mật khẩu không chính xác'
            });
        }

        // Tạo JWT token
        const expiresIn = rememberMe ? '7d' : '24h';
        const token = jwt.sign(
            {
                maTaiKhoan: user.MaTaiKhoan,
                maNhanVien: user.MaNhanVien,
                tenDangNhap: user.TenDangNhap,
                maQuyen: user.MaQuyen,
                tenQuyen: user.TenQuyen,
                hoTen: user.HoTen,
                avatar: user.Avatar
            },
            process.env.JWT_SECRET,
            { expiresIn }
        );

        return res.json({
            success: true,
            message: 'Đăng nhập thành công',
            token,
            user: {
                maTaiKhoan: user.MaTaiKhoan,
                maNhanVien: user.MaNhanVien,
                tenDangNhap: user.TenDangNhap,
                hoTen: user.HoTen,
                email: user.Email,
                maQuyen: user.MaQuyen,
                tenQuyen: user.TenQuyen,
                avatar: user.Avatar
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};

/**
 * POST /api/auth/register
 * Đăng ký tài khoản nhân viên mới
 */
const register = async (req, res) => {
    try {
        const {
            hoTen, tenDangNhap, email, password, confirmPassword,
            dienThoai, maChucVu, maPhongBan
        } = req.body;

        // Validate
        if (!hoTen || !tenDangNhap || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu xác nhận không khớp'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu phải có ít nhất 6 ký tự'
            });
        }

        // Kiểm tra username đã tồn tại
        const usernameExists = await UserModel.usernameExists(tenDangNhap);
        if (usernameExists) {
            return res.status(400).json({
                success: false,
                message: 'Tên đăng nhập đã được sử dụng'
            });
        }

        // Tạo mã nhân viên tự động
        const [maxNV] = await db.execute("SELECT MaNV FROM NhanVien ORDER BY MaNhanVien DESC LIMIT 1");
        let nextNum = 1;
        if (maxNV.length > 0) {
            const lastNum = parseInt(maxNV[0].MaNV.replace('NV', ''));
            nextNum = lastNum + 1;
        }
        const maNV = `NV${String(nextNum).padStart(3, '0')}`;

        // Tạo nhân viên
        const EmployeeModel = require('../models/employeeModel');
        const avatarPath = req.file ? `/uploads/avatars/${req.file.filename}` : null;

        const maNhanVien = await EmployeeModel.create({
            maNV,
            hoTen,
            email,
            dienThoai: dienThoai || null,
            maChucVu: maChucVu || 3,
            maPhongBan: maPhongBan || null,
            ngayVaoLam: new Date().toISOString().split('T')[0],
            trangThai: 'DangLam',
            avatar: avatarPath
        });

        // Tạo tài khoản với quyền NhanVien (maQuyen = 3)
        await UserModel.create({
            tenDangNhap,
            matKhau: password,
            maNhanVien,
            maQuyen: 3
        });

        return res.status(201).json({
            success: true,
            message: 'Đăng ký thành công! Vui lòng đăng nhập.'
        });

    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ: ' + error.message });
    }
};

/**
 * POST /api/auth/logout
 * Đăng xuất (phía client xóa token)
 */
const logout = (req, res) => {
    return res.json({ success: true, message: 'Đăng xuất thành công' });
};

/**
 * GET /api/auth/me
 * Lấy thông tin tài khoản hiện tại
 */
const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.maTaiKhoan);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' });
        }
        const { MatKhau, ...safeUser } = user;
        return res.json({ success: true, data: safeUser });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};

module.exports = { login, register, logout, getMe };
