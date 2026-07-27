// =====================================================
// Model: Nhân viên (NhanVien)
// =====================================================

const db = require('../config/database');

const EmployeeModel = {

    /**
     * Lấy tổng số nhân viên (kèm filter)
     */
    count: async (filters = {}) => {
        let query = 'SELECT COUNT(*) as total FROM NhanVien WHERE 1=1';
        const params = [];
        if (filters.trangThai) {
            query += ' AND TrangThai = ?';
            params.push(filters.trangThai);
        }
        if (filters.maPhongBan) {
            query += ' AND MaPhongBan = ?';
            params.push(filters.maPhongBan);
        }
        if (filters.search) {
            query += ' AND (HoTen LIKE ? OR MaNV LIKE ? OR Email LIKE ?)';
            const s = `%${filters.search}%`;
            params.push(s, s, s);
        }
        const [rows] = await db.execute(query, params);
        return rows[0].total;
    },

    /**
     * Lấy danh sách nhân viên có phân trang, tìm kiếm, lọc
     */
    getAll: async (options = {}) => {
        const {
            page = 1,
            limit = 10,
            search = '',
            maPhongBan = '',
            maChucVu = '',
            trangThai = '',
            sortBy = 'MaNhanVien',
            sortDir = 'ASC'
        } = options;

        const offset = (page - 1) * limit;
        const allowedSort = ['MaNhanVien', 'MaNV', 'HoTen', 'NgayVaoLam', 'TrangThai'];
        const safeSort = allowedSort.includes(sortBy) ? sortBy : 'MaNhanVien';
        const safeDir = sortDir === 'DESC' ? 'DESC' : 'ASC';

        let where = 'WHERE 1=1';
        const params = [];

        if (search) {
            where += ' AND (nv.HoTen LIKE ? OR nv.MaNV LIKE ? OR nv.Email LIKE ? OR nv.DienThoai LIKE ?)';
            const s = `%${search}%`;
            params.push(s, s, s, s);
        }
        if (maPhongBan) { where += ' AND nv.MaPhongBan = ?'; params.push(maPhongBan); }
        if (maChucVu) { where += ' AND nv.MaChucVu = ?'; params.push(maChucVu); }
        if (trangThai) { where += ' AND nv.TrangThai = ?'; params.push(trangThai); }

        const query = `
            SELECT nv.*, pb.TenPhongBan, cv.TenChucVu, cv.PhuCap,
                   hd.LuongCoBan, hd.LoaiHopDong
            FROM NhanVien nv
            LEFT JOIN PhongBan pb ON nv.MaPhongBan = pb.MaPhongBan
            LEFT JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu
            LEFT JOIN HopDong hd ON nv.MaNhanVien = hd.MaNhanVien
                AND hd.MaHopDong = (
                    SELECT MAX(MaHopDong) FROM HopDong WHERE MaNhanVien = nv.MaNhanVien
                )
            ${where}
            ORDER BY nv.${safeSort} ${safeDir}
            LIMIT ? OFFSET ?
        `;
        params.push(Number(limit), Number(offset));

        const [rows] = await db.execute(query, params);
        return rows;
    },

    /**
     * Lấy thông tin 1 nhân viên theo ID
     */
    findById: async (id) => {
        const [rows] = await db.execute(`
            SELECT nv.*, pb.TenPhongBan, cv.TenChucVu, cv.PhuCap,
                   hd.LuongCoBan, hd.LoaiHopDong, hd.NgayBatDau as NgayBatDauHD,
                   hd.NgayKetThuc as NgayKetThucHD
            FROM NhanVien nv
            LEFT JOIN PhongBan pb ON nv.MaPhongBan = pb.MaPhongBan
            LEFT JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu
            LEFT JOIN HopDong hd ON nv.MaNhanVien = hd.MaNhanVien
                AND hd.MaHopDong = (
                    SELECT MAX(MaHopDong) FROM HopDong WHERE MaNhanVien = nv.MaNhanVien
                )
            WHERE nv.MaNhanVien = ?
        `, [id]);
        return rows[0] || null;
    },

    /**
     * Tạo nhân viên mới
     */
    create: async (data) => {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const [nvResult] = await conn.execute(`
                INSERT INTO NhanVien
                (MaNV, HoTen, GioiTinh, NgaySinh, DienThoai, Email, CCCD, DiaChi,
                 NgayVaoLam, MaPhongBan, MaChucVu, TrangThai, Avatar)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                data.maNV, data.hoTen, data.gioiTinh, data.ngaySinh,
                data.dienThoai, data.email, data.cccd, data.diaChi,
                data.ngayVaoLam, data.maPhongBan, data.maChucVu,
                data.trangThai || 'DangLam', data.avatar || null
            ]);

            const maNhanVien = nvResult.insertId;

            // Tạo hợp đồng nếu có lương cơ bản
            if (data.luongCoBan) {
                await conn.execute(`
                    INSERT INTO HopDong (MaNhanVien, LoaiHopDong, NgayBatDau, LuongCoBan)
                    VALUES (?, ?, ?, ?)
                `, [maNhanVien, data.loaiHopDong || 'Hợp đồng thử việc',
                    data.ngayVaoLam, data.luongCoBan]);
            }

            await conn.commit();
            return maNhanVien;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    /**
     * Cập nhật nhân viên
     */
    update: async (id, data) => {
        const fields = [];
        const params = [];

        if (data.hoTen !== undefined) { fields.push('HoTen = ?'); params.push(data.hoTen); }
        if (data.gioiTinh !== undefined) { fields.push('GioiTinh = ?'); params.push(data.gioiTinh); }
        if (data.ngaySinh !== undefined) { fields.push('NgaySinh = ?'); params.push(data.ngaySinh); }
        if (data.dienThoai !== undefined) { fields.push('DienThoai = ?'); params.push(data.dienThoai); }
        if (data.email !== undefined) { fields.push('Email = ?'); params.push(data.email); }
        if (data.cccd !== undefined) { fields.push('CCCD = ?'); params.push(data.cccd); }
        if (data.diaChi !== undefined) { fields.push('DiaChi = ?'); params.push(data.diaChi); }
        if (data.ngayVaoLam !== undefined) { fields.push('NgayVaoLam = ?'); params.push(data.ngayVaoLam); }
        if (data.maPhongBan !== undefined) { fields.push('MaPhongBan = ?'); params.push(data.maPhongBan); }
        if (data.maChucVu !== undefined) { fields.push('MaChucVu = ?'); params.push(data.maChucVu); }
        if (data.trangThai !== undefined) { fields.push('TrangThai = ?'); params.push(data.trangThai); }
        if (data.avatar !== undefined) { fields.push('Avatar = ?'); params.push(data.avatar); }

        if (fields.length === 0) return false;

        params.push(id);
        const [result] = await db.execute(
            `UPDATE NhanVien SET ${fields.join(', ')} WHERE MaNhanVien = ?`,
            params
        );
        return result.affectedRows > 0;
    },

    /**
     * Xóa nhân viên
     */
    delete: async (id) => {
        const [result] = await db.execute(
            'DELETE FROM NhanVien WHERE MaNhanVien = ?', [id]
        );
        return result.affectedRows > 0;
    },

    /**
     * Lấy tất cả nhân viên (cho dropdown)
     */
    getAllSimple: async () => {
        const [rows] = await db.execute(`
            SELECT MaNhanVien, MaNV, HoTen, Email, Avatar
            FROM NhanVien WHERE TrangThai = 'DangLam'
            ORDER BY HoTen
        `);
        return rows;
    },

    /**
     * Thống kê nhân viên theo phòng ban
     */
    statsByDepartment: async () => {
        const [rows] = await db.execute(`
            SELECT pb.TenPhongBan, COUNT(nv.MaNhanVien) as SoNhanVien
            FROM PhongBan pb
            LEFT JOIN NhanVien nv ON pb.MaPhongBan = nv.MaPhongBan AND nv.TrangThai = 'DangLam'
            GROUP BY pb.MaPhongBan, pb.TenPhongBan
            ORDER BY SoNhanVien DESC
        `);
        return rows;
    },

    /**
     * Kiểm tra MaNV đã tồn tại
     */
    maNVExists: async (maNV, excludeId = null) => {
        let query = 'SELECT MaNhanVien FROM NhanVien WHERE MaNV = ?';
        let params = [maNV];
        if (excludeId) { query += ' AND MaNhanVien != ?'; params.push(excludeId); }
        const [rows] = await db.execute(query, params);
        return rows.length > 0;
    }
};

module.exports = EmployeeModel;
