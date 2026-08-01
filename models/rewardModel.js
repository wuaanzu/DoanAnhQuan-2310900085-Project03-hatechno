// =====================================================
// Model: Khen thưởng & Kỷ luật (KhenThuongKyLuat)
// =====================================================

const db = require('../config/database');

const RewardModel = {

    getAll: async (options = {}) => {
        const { page = 1, limit = 20, maNhanVien = '', loai = '', search = '' } = options;

        // Ép kiểu số nguyên an toàn cho LIMIT/OFFSET (chặn NaN/SQL injection)
        const safeLimit = Math.max(1, parseInt(limit, 10) || 20);
        const safePage = Math.max(1, parseInt(page, 10) || 1);
        const safeOffset = (safePage - 1) * safeLimit;

        let where = 'WHERE 1=1';
        const params = [];

        if (maNhanVien) { where += ' AND kt.MaNhanVien = ?'; params.push(maNhanVien); }
        if (loai) { where += ' AND kt.Loai = ?'; params.push(loai); }
        if (search) {
            where += ' AND (nv.HoTen LIKE ? OR kt.LyDo LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        // Lưu ý: LIMIT/OFFSET được chèn trực tiếp (đã ép kiểu số an toàn ở trên)
        // thay vì dùng dấu ? — vì mysql2 (bản mới) hay báo lỗi
        // "ER_WRONG_ARGUMENTS / Incorrect arguments to mysqld_stmt_execute"
        // khi dùng execute() với placeholder cho LIMIT/OFFSET.
        const query = `
            SELECT kt.*, nv.HoTen, nv.MaNV, pb.TenPhongBan
            FROM KhenThuongKyLuat kt
            LEFT JOIN NhanVien nv ON kt.MaNhanVien = nv.MaNhanVien
            LEFT JOIN PhongBan pb ON nv.MaPhongBan = pb.MaPhongBan
            ${where}
            ORDER BY kt.Ngay DESC
            LIMIT ${safeLimit} OFFSET ${safeOffset}
        `;
        const [rows] = await db.execute(query, params);
        return rows;
    },

    count: async (options = {}) => {
        const { maNhanVien = '', loai = '' } = options;
        let where = 'WHERE 1=1';
        const params = [];
        if (maNhanVien) { where += ' AND MaNhanVien = ?'; params.push(maNhanVien); }
        if (loai) { where += ' AND Loai = ?'; params.push(loai); }
        const [rows] = await db.execute(
            `SELECT COUNT(*) as total FROM KhenThuongKyLuat ${where}`, params
        );
        return rows[0].total;
    },

    findById: async (id) => {
        const [rows] = await db.execute(`
            SELECT kt.*, nv.HoTen, nv.MaNV
            FROM KhenThuongKyLuat kt
            LEFT JOIN NhanVien nv ON kt.MaNhanVien = nv.MaNhanVien
            WHERE kt.MaKTKL = ?
        `, [id]);
        return rows[0] || null;
    },

    create: async (data) => {
        const [result] = await db.execute(`
            INSERT INTO KhenThuongKyLuat (MaNhanVien, Loai, SoTien, LyDo, Ngay)
            VALUES (?, ?, ?, ?, ?)
        `, [data.maNhanVien, data.loai, data.soTien || 0, data.lyDo, data.ngay]);
        return result.insertId;
    },

    update: async (id, data) => {
        const [result] = await db.execute(`
            UPDATE KhenThuongKyLuat SET MaNhanVien=?, Loai=?, SoTien=?, LyDo=?, Ngay=?
            WHERE MaKTKL = ?
        `, [data.maNhanVien, data.loai, data.soTien || 0, data.lyDo, data.ngay, id]);
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await db.execute(
            'DELETE FROM KhenThuongKyLuat WHERE MaKTKL = ?', [id]
        );
        return result.affectedRows > 0;
    },

    /**
     * Tổng thưởng tháng hiện tại
     */
    totalBonusThisMonth: async () => {
        const now = new Date();
        const [rows] = await db.execute(`
            SELECT SUM(SoTien) as TongThuong
            FROM KhenThuongKyLuat
            WHERE Loai = 'Thuong' AND MONTH(Ngay) = ? AND YEAR(Ngay) = ?
        `, [now.getMonth() + 1, now.getFullYear()]);
        return rows[0].TongThuong || 0;
    },

    /**
     * Tổng khấu trừ kỷ luật tháng hiện tại
     */
    totalDeductionThisMonth: async () => {
        const now = new Date();
        const [rows] = await db.execute(`
            SELECT SUM(SoTien) as TongKhauTru
            FROM KhenThuongKyLuat
            WHERE Loai = 'KyLuat' AND MONTH(Ngay) = ? AND YEAR(Ngay) = ?
        `, [now.getMonth() + 1, now.getFullYear()]);
        return rows[0].TongKhauTru || 0;
    }
};

module.exports = RewardModel;