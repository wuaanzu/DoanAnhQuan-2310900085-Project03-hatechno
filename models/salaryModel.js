// =====================================================
// Model: Bảng Lương (BangLuong + ChiTietBangLuong)
// =====================================================

const db = require('../config/database');

const SalaryModel = {

    getAll: async (options = {}) => {
        const { page = 1, limit = 20, thang = '', nam = '', maNhanVien = '', search = '' } = options;

        // Ép kiểu số nguyên an toàn cho LIMIT/OFFSET (chặn NaN/SQL injection)
        const safeLimit = Math.max(1, parseInt(limit, 10) || 20);
        const safePage = Math.max(1, parseInt(page, 10) || 1);
        const safeOffset = (safePage - 1) * safeLimit;

        let where = 'WHERE 1=1';
        const params = [];

        if (thang) { where += ' AND bl.Thang = ?'; params.push(thang); }
        if (nam) { where += ' AND bl.Nam = ?'; params.push(nam); }
        if (maNhanVien) { where += ' AND bl.MaNhanVien = ?'; params.push(maNhanVien); }
        if (search) {
            where += ' AND (nv.HoTen LIKE ? OR nv.MaNV LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        // Lưu ý: LIMIT/OFFSET được chèn trực tiếp (đã ép kiểu số an toàn ở trên)
        // thay vì dùng dấu ? — vì mysql2 (bản mới) hay báo lỗi
        // "ER_WRONG_ARGUMENTS / Incorrect arguments to mysqld_stmt_execute"
        // khi dùng execute() với placeholder cho LIMIT/OFFSET.
        const query = `
            SELECT bl.*, nv.HoTen, nv.MaNV, nv.Avatar,
                   pb.TenPhongBan, cv.TenChucVu
            FROM BangLuong bl
            LEFT JOIN NhanVien nv ON bl.MaNhanVien = nv.MaNhanVien
            LEFT JOIN PhongBan pb ON nv.MaPhongBan = pb.MaPhongBan
            LEFT JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu
            ${where}
            ORDER BY bl.Nam DESC, bl.Thang DESC, nv.HoTen
            LIMIT ${safeLimit} OFFSET ${safeOffset}
        `;
        const [rows] = await db.execute(query, params);
        return rows;
    },

    count: async (options = {}) => {
        const { thang = '', nam = '', maNhanVien = '', search = '' } = options;
        let where = 'WHERE 1=1';
        const params = [];
        if (thang) { where += ' AND bl.Thang = ?'; params.push(thang); }
        if (nam) { where += ' AND bl.Nam = ?'; params.push(nam); }
        if (maNhanVien) { where += ' AND bl.MaNhanVien = ?'; params.push(maNhanVien); }
        if (search) {
            where += ' AND (nv.HoTen LIKE ? OR nv.MaNV LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        const [rows] = await db.execute(`
            SELECT COUNT(*) as total FROM BangLuong bl
            LEFT JOIN NhanVien nv ON bl.MaNhanVien = nv.MaNhanVien
            ${where}
        `, params);
        return rows[0].total;
    },

    findById: async (id) => {
        const [rows] = await db.execute(`
            SELECT bl.*, nv.HoTen, nv.MaNV, nv.Email, nv.Avatar,
                   pb.TenPhongBan, cv.TenChucVu, hd.LuongCoBan
            FROM BangLuong bl
            LEFT JOIN NhanVien nv ON bl.MaNhanVien = nv.MaNhanVien
            LEFT JOIN PhongBan pb ON nv.MaPhongBan = pb.MaPhongBan
            LEFT JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu
            LEFT JOIN HopDong hd ON nv.MaNhanVien = hd.MaNhanVien
            WHERE bl.MaBangLuong = ?
        `, [id]);
        return rows[0] || null;
    },

    /**
     * Lấy chi tiết các khoản lương
     */
    getDetails: async (maBangLuong) => {
        const [rows] = await db.execute(
            'SELECT * FROM ChiTietBangLuong WHERE MaBangLuong = ? ORDER BY MaChiTiet',
            [maBangLuong]
        );
        return rows;
    },

    /**
     * Tạo bảng lương mới
     */
    create: async (data) => {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            // Tính tổng
            const tongThuNhap = (data.luongCoBan || 0) + (data.phuCap || 0) +
                                (data.thuong || 0) + (data.tienTangCa || 0);
            const tongKhauTru = (data.bhxh || 0) + (data.thue || 0) + (data.khauTruKhac || 0);
            const luongThucNhan = tongThuNhap - tongKhauTru;

            const [result] = await conn.execute(`
                INSERT INTO BangLuong (MaNhanVien, Thang, Nam, TongThuNhap, TongKhauTru, LuongThucNhan, NgayLap, TrangThai)
                VALUES (?, ?, ?, ?, ?, ?, CURDATE(), 'ChuaChot')
            `, [data.maNhanVien, data.thang, data.nam, tongThuNhap, tongKhauTru, luongThucNhan]);

            const maBangLuong = result.insertId;

            // Thêm chi tiết
            const chiTiet = [
                { loai: 'Lương cơ bản', soTien: data.luongCoBan || 0 },
                { loai: 'Phụ cấp chức vụ', soTien: data.phuCap || 0 },
                { loai: 'Thưởng', soTien: data.thuong || 0 },
                { loai: 'Tiền tăng ca', soTien: data.tienTangCa || 0 },
                { loai: 'Khấu trừ BHXH', soTien: data.bhxh || 0 },
                { loai: 'Thuế thu nhập', soTien: data.thue || 0 },
                { loai: 'Khấu trừ khác', soTien: data.khauTruKhac || 0 }
            ].filter(item => item.soTien > 0);

            for (const item of chiTiet) {
                await conn.execute(
                    'INSERT INTO ChiTietBangLuong (MaBangLuong, LoaiKhoan, SoTien) VALUES (?, ?, ?)',
                    [maBangLuong, item.loai, item.soTien]
                );
            }

            await conn.commit();
            return maBangLuong;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    /**
     * Chốt bảng lương
     */
    finalize: async (id) => {
        const [result] = await db.execute(
            "UPDATE BangLuong SET TrangThai = 'DaChot' WHERE MaBangLuong = ?", [id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await db.execute(
            'DELETE FROM BangLuong WHERE MaBangLuong = ?', [id]
        );
        return result.affectedRows > 0;
    },

    /**
     * Thống kê tổng lương theo tháng
     */
    statsByMonth: async (nam) => {
        const [rows] = await db.execute(`
            SELECT Thang, SUM(TongThuNhap) as TongThuNhap,
                   SUM(TongKhauTru) as TongKhauTru,
                   SUM(LuongThucNhan) as TongLuong
            FROM BangLuong
            WHERE Nam = ?
            GROUP BY Thang ORDER BY Thang
        `, [nam]);
        return rows;
    },

    /**
     * Tổng chi phí lương tháng hiện tại
     */
    totalThisMonth: async () => {
        const now = new Date();
        const [rows] = await db.execute(`
            SELECT SUM(LuongThucNhan) as TongLuong,
                   SUM(TongThuNhap) as TongThuNhap,
                   SUM(TongKhauTru) as TongKhauTru
            FROM BangLuong
            WHERE Thang = ? AND Nam = ?
        `, [now.getMonth() + 1, now.getFullYear()]);
        return rows[0];
    },

    /**
     * Lấy bảng lương của 1 nhân viên
     */
    getByEmployee: async (maNhanVien, options = {}) => {
        const { page = 1, limit = 12 } = options;
        const safeLimit = Math.max(1, parseInt(limit, 10) || 12);
        const safePage = Math.max(1, parseInt(page, 10) || 1);
        const safeOffset = (safePage - 1) * safeLimit;
        const [rows] = await db.execute(`
            SELECT * FROM BangLuong
            WHERE MaNhanVien = ?
            ORDER BY Nam DESC, Thang DESC
            LIMIT ${safeLimit} OFFSET ${safeOffset}
        `, [maNhanVien]);
        return rows;
    }
};

module.exports = SalaryModel;
