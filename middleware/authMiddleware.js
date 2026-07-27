// =====================================================
// Middleware: Authentication & Authorization
// JWT Token Verification + Role-based Access Control
// =====================================================

const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Xác thực JWT token
 */
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Vui lòng đăng nhập để tiếp tục'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Token không hợp lệ hoặc đã hết hạn'
        });
    }
};

/**
 * Phân quyền theo role
 * @param {...string} roles - Danh sách quyền được phép
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Chưa xác thực'
            });
        }

        if (!roles.includes(req.user.tenQuyen)) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền thực hiện thao tác này'
            });
        }

        next();
    };
};

/**
 * Chỉ Admin
 */
const adminOnly = authorize('Admin');

/**
 * Admin hoặc NhanSu (Manager)
 */
const managerOrAdmin = authorize('Admin', 'NhanSu');

module.exports = { authenticate, authorize, adminOnly, managerOrAdmin };
