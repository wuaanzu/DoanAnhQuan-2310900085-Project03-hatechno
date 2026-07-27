// =====================================================
// Model: Phòng ban (PhongBan)
// =====================================================

const db = require('../config/database');

const DepartmentModel = {

    getAll: async () => {
        const [rows] = await db.execute(`
            SELECT pb.*,
                   COUNT(nv.MaNhanVien) as SoNhanVien,
                   truong.HoTen as TruongPhong
            FROM PhongBan pb
            LEFT JOIN NhanVien nv ON pb.MaPhongBan = nv.MaPhongBan AND nv.TrangThai = 'DangLam'
            LEFT JOIN NhanVien truong ON pb.TruongPhong = truong.MaNhanVien
            GROUP BY pb.MaPhongBan
            ORDER BY pb.MaPhongBan
        `);
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute(`
            SELECT pb.*, truong.HoTen as TenTruongPhong
            FROM PhongBan pb
            LEFT JOIN NhanVien truong ON pb.TruongPhong = truong.MaNhanVien
            WHERE pb.MaPhongBan = ?
        `, [id]);
        return rows[0] || null;
    },

    create: async (data) => {
        const [result] = await db.execute(`
            INSERT INTO PhongBan (TenPhongBan, TruongPhong, MoTa)
            VALUES (?, ?, ?)
        `, [data.tenPhongBan, data.truongPhong || null, data.moTa || null]);
        return result.insertId;
    },

    update: async (id, data) => {
        const [result] = await db.execute(`
            UPDATE PhongBan SET TenPhongBan = ?, TruongPhong = ?, MoTa = ?
            WHERE MaPhongBan = ?
        `, [data.tenPhongBan, data.truongPhong || null, data.moTa || null, id]);
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        // Kiểm tra có nhân viên không
        const [check] = await db.execute(
            'SELECT COUNT(*) as cnt FROM NhanVien WHERE MaPhongBan = ?', [id]
        );
        if (check[0].cnt > 0) {
            throw new Error('Không thể xóa phòng ban đang có nhân viên');
        }
        const [result] = await db.execute(
            'DELETE FROM PhongBan WHERE MaPhongBan = ?', [id]
        );
        return result.affectedRows > 0;
    },

    count: async () => {
        const [rows] = await db.execute('SELECT COUNT(*) as total FROM PhongBan');
        return rows[0].total;
    }
};

module.exports = DepartmentModel;
