// =====================================================
// Model: Chấm công (ChamCong)
// =====================================================

const db = require('../config/database');

const AttendanceModel = {

    getAll: async (options = {}) => {
        const { page = 1, limit = 20, maNhanVien = '', thang = '', nam = '', search = '' } = options;

        // Ép kiểu số nguyên an toàn cho LIMIT/OFFSET (chặn NaN/SQL injection)
        const safeLimit = Math.max(1, parseInt(limit, 10) || 20);
        const safePage = Math.max(1, parseInt(page, 10) || 1);
        const safeOffset = (safePage - 1) * safeLimit;

        let where = 'WHERE 1=1';
        const params = [];

        if (maNhanVien) { where += ' AND cc.MaNhanVien = ?'; params.push(maNhanVien); }
        if (thang) { where += ' AND MONTH(cc.NgayLam) = ?'; params.push(thang); }
        if (nam) { where += ' AND YEAR(cc.NgayLam) = ?'; params.push(nam); }
        if (search) {
            where += ' AND nv.HoTen LIKE ?';
            params.push(`%${search}%`);
        }

        // Lưu ý: LIMIT/OFFSET được chèn trực tiếp (đã ép kiểu số an toàn ở trên)
        // thay vì dùng dấu ? — vì mysql2 (bản mới) hay báo lỗi
        // "ER_WRONG_ARGUMENTS / Incorrect arguments to mysqld_stmt_execute"
        // khi dùng execute() với placeholder cho LIMIT/OFFSET.
        const query = `
            SELECT cc.*, nv.HoTen, nv.MaNV, nv.Avatar
            FROM ChamCong cc
            LEFT JOIN NhanVien nv ON cc.MaNhanVien = nv.MaNhanVien
            ${where}
            ORDER BY cc.NgayLam DESC, cc.MaNhanVien
            LIMIT ${safeLimit} OFFSET ${safeOffset}
        `;
        const [rows] = await db.execute(query, params);
        return rows;
    },

    count: async (options = {}) => {
        const { maNhanVien = '', thang = '', nam = '', search = '' } = options;
        let where = 'WHERE 1=1';
        const params = [];
        if (maNhanVien) { where += ' AND cc.MaNhanVien = ?'; params.push(maNhanVien); }
        if (thang) { where += ' AND MONTH(cc.NgayLam) = ?'; params.push(thang); }
        if (nam) { where += ' AND YEAR(cc.NgayLam) = ?'; params.push(nam); }
        if (search) { where += ' AND nv.HoTen LIKE ?'; params.push(`%${search}%`); }

        const [rows] = await db.execute(`
            SELECT COUNT(*) as total FROM ChamCong cc
            LEFT JOIN NhanVien nv ON cc.MaNhanVien = nv.MaNhanVien
            ${where}
        `, params);
        return rows[0].total;
    },

    findById: async (id) => {
        const [rows] = await db.execute(`
            SELECT cc.*, nv.HoTen, nv.MaNV
            FROM ChamCong cc
            LEFT JOIN NhanVien nv ON cc.MaNhanVien = nv.MaNhanVien
            WHERE cc.MaChamCong = ?
        `, [id]);
        return rows[0] || null;
    },

    create: async (data) => {
        const [result] = await db.execute(`
            INSERT INTO ChamCong (MaNhanVien, NgayLam, GioVao, GioRa, SoGioLam, TangCa, TrangThai)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [data.maNhanVien, data.ngayLam, data.gioVao, data.gioRa,
            data.soGioLam || 8, data.tangCa || 0, data.trangThai || 'Đúng giờ']);
        return result.insertId;
    },

    update: async (id, data) => {
        const [result] = await db.execute(`
            UPDATE ChamCong SET MaNhanVien=?, NgayLam=?, GioVao=?, GioRa=?,
                SoGioLam=?, TangCa=?, TrangThai=?
            WHERE MaChamCong = ?
        `, [data.maNhanVien, data.ngayLam, data.gioVao, data.gioRa,
            data.soGioLam || 8, data.tangCa || 0, data.trangThai || 'Đúng giờ', id]);
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await db.execute(
            'DELETE FROM ChamCong WHERE MaChamCong = ?', [id]
        );
        return result.affectedRows > 0;
    },

    /**
     * Lấy chấm công theo tháng/năm của 1 nhân viên
     */
    getByEmployeeMonth: async (maNhanVien, thang, nam) => {
        const [rows] = await db.execute(`
            SELECT * FROM ChamCong
            WHERE MaNhanVien = ? AND MONTH(NgayLam) = ? AND YEAR(NgayLam) = ?
            ORDER BY NgayLam
        `, [maNhanVien, thang, nam]);
        return rows;
    },

    /**
     * Thống kê tổng giờ tăng ca theo tháng/năm
     */
    statsByMonth: async (thang, nam) => {
        const [rows] = await db.execute(`
            SELECT nv.MaNhanVien, nv.HoTen,
                   COUNT(*) as NgayLam,
                   SUM(cc.SoGioLam) as TongGioLam,
                   SUM(cc.TangCa) as TongTangCa
            FROM ChamCong cc
            JOIN NhanVien nv ON cc.MaNhanVien = nv.MaNhanVien
            WHERE MONTH(cc.NgayLam) = ? AND YEAR(cc.NgayLam) = ?
            GROUP BY nv.MaNhanVien
        `, [thang, nam]);
        return rows;
    }
};

module.exports = AttendanceModel;