// =====================================================
// Model: Đơn nghỉ phép (DonNghiPhep)
// =====================================================

const db = require('../config/database');

const LeaveModel = {

    getAll: async (options = {}) => {
        const { page = 1, limit = 20, maNhanVien = '', trangThai = '', search = '' } = options;

        // Ép kiểu số nguyên an toàn cho LIMIT/OFFSET (chặn NaN/SQL injection)
        const safeLimit = Math.max(1, parseInt(limit, 10) || 20);
        const safePage = Math.max(1, parseInt(page, 10) || 1);
        const safeOffset = (safePage - 1) * safeLimit;

        let where = 'WHERE 1=1';
        const params = [];

        if (maNhanVien) { where += ' AND dnp.MaNhanVien = ?'; params.push(maNhanVien); }
        if (trangThai) { where += ' AND dnp.TrangThai = ?'; params.push(trangThai); }
        if (search) {
            where += ' AND nv.HoTen LIKE ?';
            params.push(`%${search}%`);
        }

        // Lưu ý: LIMIT/OFFSET được chèn trực tiếp (đã ép kiểu số an toàn ở trên)
        // thay vì dùng dấu ? — vì mysql2 (bản mới) hay báo lỗi
        // "ER_WRONG_ARGUMENTS / Incorrect arguments to mysqld_stmt_execute"
        // khi dùng execute() với placeholder cho LIMIT/OFFSET.
        const query = `
            SELECT dnp.*, nv.HoTen, nv.MaNV, nv.Avatar,
                   pb.TenPhongBan,
                   DATEDIFF(dnp.NgayKetThuc, dnp.NgayBatDau) + 1 as SoNgay
            FROM DonNghiPhep dnp
            LEFT JOIN NhanVien nv ON dnp.MaNhanVien = nv.MaNhanVien
            LEFT JOIN PhongBan pb ON nv.MaPhongBan = pb.MaPhongBan
            ${where}
            ORDER BY dnp.MaDon DESC
            LIMIT ${safeLimit} OFFSET ${safeOffset}
        `;
        const [rows] = await db.execute(query, params);
        return rows;
    },

    count: async (options = {}) => {
        const { maNhanVien = '', trangThai = '' } = options;
        let where = 'WHERE 1=1';
        const params = [];
        if (maNhanVien) { where += ' AND MaNhanVien = ?'; params.push(maNhanVien); }
        if (trangThai) { where += ' AND TrangThai = ?'; params.push(trangThai); }
        const [rows] = await db.execute(
            `SELECT COUNT(*) as total FROM DonNghiPhep ${where}`, params
        );
        return rows[0].total;
    },

    findById: async (id) => {
        const [rows] = await db.execute(`
            SELECT dnp.*, nv.HoTen, nv.MaNV
            FROM DonNghiPhep dnp
            LEFT JOIN NhanVien nv ON dnp.MaNhanVien = nv.MaNhanVien
            WHERE dnp.MaDon = ?
        `, [id]);
        return rows[0] || null;
    },

    create: async (data) => {
        const [result] = await db.execute(`
            INSERT INTO DonNghiPhep (MaNhanVien, NgayBatDau, NgayKetThuc, LyDo, TrangThai)
            VALUES (?, ?, ?, ?, 'ChoDuyet')
        `, [data.maNhanVien, data.ngayBatDau, data.ngayKetThuc, data.lyDo]);
        return result.insertId;
    },

    update: async (id, data) => {
        const [result] = await db.execute(`
            UPDATE DonNghiPhep SET NgayBatDau=?, NgayKetThuc=?, LyDo=?
            WHERE MaDon = ? AND TrangThai = 'ChoDuyet'
        `, [data.ngayBatDau, data.ngayKetThuc, data.lyDo, id]);
        return result.affectedRows > 0;
    },

    approve: async (id) => {
        const [result] = await db.execute(
            "UPDATE DonNghiPhep SET TrangThai = 'DaDuyet' WHERE MaDon = ?", [id]
        );
        return result.affectedRows > 0;
    },

    reject: async (id) => {
        const [result] = await db.execute(
            "UPDATE DonNghiPhep SET TrangThai = 'TuChoi' WHERE MaDon = ?", [id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await db.execute(
            'DELETE FROM DonNghiPhep WHERE MaDon = ?', [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = LeaveModel;