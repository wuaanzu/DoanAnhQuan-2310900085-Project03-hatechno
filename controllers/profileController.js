// =====================================================
// Controller: Trang cá nhân
// =====================================================
const EmployeeModel = require('../models/employeeModel');
const UserModel = require('../models/userModel');
const SalaryModel = require('../models/salaryModel');
const AttendanceModel = require('../models/attendanceModel');
const path = require('path');
const fs = require('fs');

/**
 * GET /api/profile - Lấy thông tin cá nhân
 */
const getProfile = async (req, res) => {
    try {
        const employee = await EmployeeModel.findById(req.user.maNhanVien);
        if (!employee) return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin' });
        return res.json({ success: true, data: employee });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi lấy thông tin' });
    }
};

/**
 * PUT /api/profile - Cập nhật thông tin cá nhân
 */
const updateProfile = async (req, res) => {
    try {
        const allowed = ['dienThoai', 'diaChi', 'avatar'];
        const data = {};
        allowed.forEach(k => { if (req.body[k] !== undefined) data[k] = req.body[k]; });

        if (req.file) {
            const existing = await EmployeeModel.findById(req.user.maNhanVien);
            if (existing?.Avatar) {
                const oldPath = path.join(__dirname, '..', existing.Avatar);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            data.avatar = `/uploads/avatars/${req.file.filename}`;
        }

        await EmployeeModel.update(req.user.maNhanVien, data);
        const updated = await EmployeeModel.findById(req.user.maNhanVien);
        return res.json({ success: true, message: 'Cập nhật thành công', data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi cập nhật' });
    }
};

/**
 * PUT /api/profile/password - Đổi mật khẩu
 */
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Mật khẩu mới không khớp' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' });
        }

        const user = await UserModel.findById(req.user.maTaiKhoan);
        const isMatch = await UserModel.comparePassword(currentPassword, user.MatKhau);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không đúng' });
        }

        await UserModel.updatePassword(req.user.maTaiKhoan, newPassword);
        return res.json({ success: true, message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi đổi mật khẩu' });
    }
};

/**
 * GET /api/profile/salary - Lịch sử lương của tôi
 */
const getMySalary = async (req, res) => {
    try {
        const rows = await SalaryModel.getByEmployee(req.user.maNhanVien);
        return res.json({ success: true, data: rows });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi lấy bảng lương' });
    }
};

/**
 * GET /api/profile/attendance - Lịch sử chấm công
 */
const getMyAttendance = async (req, res) => {
    try {
        const thang = req.query.thang || new Date().getMonth() + 1;
        const nam = req.query.nam || new Date().getFullYear();
        const rows = await AttendanceModel.getByEmployeeMonth(req.user.maNhanVien, thang, nam);
        return res.json({ success: true, data: rows });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi lấy chấm công' });
    }
};

module.exports = { getProfile, updateProfile, changePassword, getMySalary, getMyAttendance };
