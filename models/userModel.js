// =====================================================
// Model: Tài khoản người dùng (TaiKhoan + Quyen)
// Tương tác với database MySQL
// =====================================================

const db = require('../config/database');
const bcrypt = require('bcryptjs');

const UserModel = {

    /**
     * Tìm tài khoản theo tên đăng nhập
     */
    findByUsername: async (tenDangNhap) => {
        const [rows] = await db.execute(`
            SELECT tk.*, q.TenQuyen, nv.HoTen, nv.MaNV, nv.Email, nv.Avatar
            FROM TaiKhoan tk
            LEFT JOIN Quyen q ON tk.MaQuyen = q.MaQuyen
            LEFT JOIN NhanVien nv ON tk.MaNhanVien = nv.MaNhanVien
            WHERE tk.TenDangNhap = ? AND tk.TrangThai = TRUE
        `, [tenDangNhap]);
        return rows[0] || null;
    },

    /**
     * Tìm tài khoản theo email nhân viên
     */
    findByEmail: async (email) => {
        const [rows] = await db.execute(`
            SELECT tk.*, q.TenQuyen, nv.HoTen, nv.MaNV, nv.Email, nv.Avatar
            FROM TaiKhoan tk
            LEFT JOIN Quyen q ON tk.MaQuyen = q.MaQuyen
            LEFT JOIN NhanVien nv ON tk.MaNhanVien = nv.MaNhanVien
            WHERE nv.Email = ? AND tk.TrangThai = TRUE
        `, [email]);
        return rows[0] || null;
    },

    /**
     * Tìm theo ID
     */
    findById: async (id) => {
        const [rows] = await db.execute(`
            SELECT tk.*, q.TenQuyen, nv.HoTen, nv.MaNV, nv.Email, nv.Avatar
            FROM TaiKhoan tk
            LEFT JOIN Quyen q ON tk.MaQuyen = q.MaQuyen
            LEFT JOIN NhanVien nv ON tk.MaNhanVien = nv.MaNhanVien
            WHERE tk.MaTaiKhoan = ?
        `, [id]);
        return rows[0] || null;
    },

    /**
     * Tạo tài khoản mới
     */
    create: async (data) => {
        const hashedPassword = await bcrypt.hash(data.matKhau, 10);
        const [result] = await db.execute(`
            INSERT INTO TaiKhoan (TenDangNhap, MatKhau, MaNhanVien, MaQuyen, TrangThai)
            VALUES (?, ?, ?, ?, TRUE)
        `, [data.tenDangNhap, hashedPassword, data.maNhanVien, data.maQuyen]);
        return result.insertId;
    },

    /**
     * Cập nhật mật khẩu
     */
    updatePassword: async (id, newPassword) => {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const [result] = await db.execute(
            'UPDATE TaiKhoan SET MatKhau = ? WHERE MaTaiKhoan = ?',
            [hashedPassword, id]
        );
        return result.affectedRows > 0;
    },

    /**
     * So sánh mật khẩu (hỗ trợ cả plain text cũ và bcrypt mới)
     */
    comparePassword: async (plainPassword, hashedPassword) => {
        // Nếu password chưa được hash (dữ liệu cũ plain text)
        if (!hashedPassword.startsWith('$2')) {
            return plainPassword === hashedPassword;
        }
        return await bcrypt.compare(plainPassword, hashedPassword);
    },

    /**
     * Lấy tất cả tài khoản
     */
    getAll: async () => {
        const [rows] = await db.execute(`
            SELECT tk.MaTaiKhoan, tk.TenDangNhap, tk.TrangThai,
                   q.TenQuyen, nv.HoTen, nv.Email
            FROM TaiKhoan tk
            LEFT JOIN Quyen q ON tk.MaQuyen = q.MaQuyen
            LEFT JOIN NhanVien nv ON tk.MaNhanVien = nv.MaNhanVien
            ORDER BY tk.MaTaiKhoan
        `);
        return rows;
    },

    /**
     * Lấy danh sách quyền
     */
    getRoles: async () => {
        const [rows] = await db.execute('SELECT * FROM Quyen ORDER BY MaQuyen');
        return rows;
    },

    /**
     * Kiểm tra username đã tồn tại
     */
    usernameExists: async (username, excludeId = null) => {
        let query = 'SELECT MaTaiKhoan FROM TaiKhoan WHERE TenDangNhap = ?';
        let params = [username];
        if (excludeId) {
            query += ' AND MaTaiKhoan != ?';
            params.push(excludeId);
        }
        const [rows] = await db.execute(query, params);
        return rows.length > 0;
    },

    /**
     * Cập nhật trạng thái tài khoản
     */
    updateStatus: async (id, status) => {
        const [result] = await db.execute(
            'UPDATE TaiKhoan SET TrangThai = ? WHERE MaTaiKhoan = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = UserModel;
