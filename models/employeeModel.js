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

        // Ép kiểu số nguyên an toàn cho LIMIT/OFFSET (chặn NaN/SQL injection)
        const safeLimit = Math.max(1, parseInt(limit, 10) || 10);
        const safePage = Math.max(1, parseInt(page, 10) || 1);
        const safeOffset = (safePage - 1) * safeLimit;

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

        // Lưu ý: LIMIT/OFFSET được chèn trực tiếp (đã ép kiểu số an toàn ở trên)
        // thay vì dùng dấu ? — vì mysql2 (bản mới) hay báo lỗi
        // "ER_WRONG_ARGUMENTS / Incorrect arguments to mysqld_stmt_execute"
        // khi dùng execute() với placeholder cho LIMIT/OFFSET.
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
            LIMIT ${safeLimit} OFFSET ${safeOffset}
        `;

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

            const toNull = (v) => (v === undefined || v === '' || v === null ? null : v);

            // Tự động sinh Mã Nhân Viên nếu chưa truyền vào
            let maNV = toNull(data.maNV);
            if (!maNV) {
                const [maxNV] = await conn.execute("SELECT MaNV FROM NhanVien WHERE MaNV LIKE 'NV%' ORDER BY MaNhanVien DESC LIMIT 1");
                let nextNum = 1;
                if (maxNV.length > 0 && maxNV[0].MaNV) {
                    const match = maxNV[0].MaNV.match(/\d+/);
                    if (match) nextNum = parseInt(match[0], 10) + 1;
                }
                maNV = `NV${String(nextNum).padStart(3, '0')}`;
            }

            const [nvResult] = await conn.execute(`
                INSERT INTO NhanVien
                (MaNV, HoTen, GioiTinh, NgaySinh, DienThoai, Email, CCCD, DiaChi,
                 NgayVaoLam, MaPhongBan, MaChucVu, TrangThai, Avatar)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                maNV,
                toNull(data.hoTen),
                toNull(data.gioiTinh),
                toNull(data.ngaySinh),
                toNull(data.dienThoai),
                toNull(data.email),
                toNull(data.cccd),
                toNull(data.diaChi),
                toNull(data.ngayVaoLam) || new Date().toISOString().split('T')[0],
                toNull(data.maPhongBan),
                toNull(data.maChucVu),
                data.trangThai || 'DangLam',
                toNull(data.avatar)
            ]);

            const maNhanVien = nvResult.insertId;

            // Tạo hợp đồng nếu có lương cơ bản
            if (data.luongCoBan) {
                await conn.execute(`
                    INSERT INTO HopDong (MaNhanVien, LoaiHopDong, NgayBatDau, LuongCoBan)
                    VALUES (?, ?, ?, ?)
                `, [maNhanVien, data.loaiHopDong || 'Hợp đồng thử việc',
                    toNull(data.ngayVaoLam) || new Date().toISOString().split('T')[0],
                    data.luongCoBan]);
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

        const toNull = (v) => (v === undefined || v === '' || v === null ? null : v);

        if (data.maNV !== undefined) { fields.push('MaNV = ?'); params.push(data.maNV); }
        if (data.hoTen !== undefined) { fields.push('HoTen = ?'); params.push(data.hoTen); }
        if (data.gioiTinh !== undefined) { fields.push('GioiTinh = ?'); params.push(toNull(data.gioiTinh)); }
        if (data.ngaySinh !== undefined) { fields.push('NgaySinh = ?'); params.push(toNull(data.ngaySinh)); }
        if (data.dienThoai !== undefined) { fields.push('DienThoai = ?'); params.push(toNull(data.dienThoai)); }
        if (data.email !== undefined) { fields.push('Email = ?'); params.push(toNull(data.email)); }
        if (data.cccd !== undefined) { fields.push('CCCD = ?'); params.push(toNull(data.cccd)); }
        if (data.diaChi !== undefined) { fields.push('DiaChi = ?'); params.push(toNull(data.diaChi)); }
        if (data.ngayVaoLam !== undefined) { fields.push('NgayVaoLam = ?'); params.push(toNull(data.ngayVaoLam)); }
        if (data.maPhongBan !== undefined) { fields.push('MaPhongBan = ?'); params.push(toNull(data.maPhongBan)); }
        if (data.maChucVu !== undefined) { fields.push('MaChucVu = ?'); params.push(toNull(data.maChucVu)); }
        if (data.trangThai !== undefined) { fields.push('TrangThai = ?'); params.push(data.trangThai); }
        if (data.avatar !== undefined) { fields.push('Avatar = ?'); params.push(toNull(data.avatar)); }

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