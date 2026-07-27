// =====================================================
// Controller: Báo cáo
// =====================================================
const db = require('../config/database');
const SalaryModel = require('../models/salaryModel');
const EmployeeModel = require('../models/employeeModel');

/**
 * GET /api/reports/salary - Báo cáo lương theo tháng
 */
const salaryReport = async (req, res) => {
    try {
        const nam = req.query.nam || new Date().getFullYear();
        const data = await SalaryModel.statsByMonth(nam);
        return res.json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi báo cáo lương' });
    }
};

/**
 * GET /api/reports/employees - Báo cáo nhân viên theo phòng ban
 */
const employeeReport = async (req, res) => {
    try {
        const data = await EmployeeModel.statsByDepartment();
        return res.json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi báo cáo nhân viên' });
    }
};

/**
 * GET /api/reports/top-employees - Top nhân viên lương cao nhất
 */
const topEmployees = async (req, res) => {
    try {
        const thang = req.query.thang || new Date().getMonth() + 1;
        const nam = req.query.nam || new Date().getFullYear();

        const [rows] = await db.execute(`
            SELECT nv.HoTen, nv.MaNV, pb.TenPhongBan, cv.TenChucVu,
                   bl.LuongThucNhan, nv.Avatar
            FROM BangLuong bl
            JOIN NhanVien nv ON bl.MaNhanVien = nv.MaNhanVien
            LEFT JOIN PhongBan pb ON nv.MaPhongBan = pb.MaPhongBan
            LEFT JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu
            WHERE bl.Thang = ? AND bl.Nam = ?
            ORDER BY bl.LuongThucNhan DESC
            LIMIT 10
        `, [thang, nam]);

        return res.json({ success: true, data: rows });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi top nhân viên' });
    }
};

/**
 * GET /api/reports/cost - Tổng chi phí lương
 */
const totalCost = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT Nam, Thang,
                   SUM(TongThuNhap) as TongThuNhap,
                   SUM(TongKhauTru) as TongKhauTru,
                   SUM(LuongThucNhan) as TongLuong,
                   COUNT(*) as SoNhanVien
            FROM BangLuong
            GROUP BY Nam, Thang
            ORDER BY Nam DESC, Thang DESC
            LIMIT 12
        `);
        return res.json({ success: true, data: rows });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi tổng chi phí' });
    }
};

module.exports = { salaryReport, employeeReport, topEmployees, totalCost };
