// =====================================================
// Model: Chức vụ (ChucVu)
// =====================================================

const db = require('../config/database');

const PositionModel = {

    getAll: async () => {
        const [rows] = await db.execute(`
            SELECT cv.*, COUNT(nv.MaNhanVien) as SoNhanVien
            FROM ChucVu cv
            LEFT JOIN NhanVien nv ON cv.MaChucVu = nv.MaChucVu
            GROUP BY cv.MaChucVu
            ORDER BY cv.MaChucVu
        `);
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute(
            'SELECT * FROM ChucVu WHERE MaChucVu = ?', [id]
        );
        return rows[0] || null;
    },

    create: async (data) => {
        const [result] = await db.execute(`
            INSERT INTO ChucVu (TenChucVu, PhuCap, MoTa)
            VALUES (?, ?, ?)
        `, [data.tenChucVu, data.phuCap || 0, data.moTa || null]);
        return result.insertId;
    },

    update: async (id, data) => {
        const [result] = await db.execute(`
            UPDATE ChucVu SET TenChucVu = ?, PhuCap = ?, MoTa = ?
            WHERE MaChucVu = ?
        `, [data.tenChucVu, data.phuCap || 0, data.moTa || null, id]);
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [check] = await db.execute(
            'SELECT COUNT(*) as cnt FROM NhanVien WHERE MaChucVu = ?', [id]
        );
        if (check[0].cnt > 0) {
            throw new Error('Không thể xóa chức vụ đang có nhân viên');
        }
        const [result] = await db.execute(
            'DELETE FROM ChucVu WHERE MaChucVu = ?', [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = PositionModel;
