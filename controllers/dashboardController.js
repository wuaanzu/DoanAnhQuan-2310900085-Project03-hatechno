// =====================================================
// Controller: Dashboard - Thống kê tổng hợp
// =====================================================

const db = require('../config/database');
const EmployeeModel = require('../models/employeeModel');
const DepartmentModel = require('../models/departmentModel');
const SalaryModel = require('../models/salaryModel');
const RewardModel = require('../models/rewardModel');

/**
 * GET /api/dashboard/stats
 * Lấy tất cả thống kê cho dashboard
 */
const getStats = async (req, res) => {
    try {
        const [
            totalEmployees,
            activeEmployees,
            resignedEmployees,
            totalDepartments,
            salaryThisMonth,
            bonusThisMonth,
            deductionThisMonth,
            pendingLeaves,
            recentActivity
        ] = await Promise.all([
            EmployeeModel.count(),
            EmployeeModel.count({ trangThai: 'DangLam' }),
            EmployeeModel.count({ trangThai: 'NghiViec' }),
            DepartmentModel.count(),
            SalaryModel.totalThisMonth(),
            RewardModel.totalBonusThisMonth(),
            RewardModel.totalDeductionThisMonth(),
            getPendingLeaves(),
            getRecentActivity()
        ]);

        return res.json({
            success: true,
            data: {
                tongNhanVien: totalEmployees,
                dangLam: activeEmployees,
                nghiViec: resignedEmployees,
                tongPhongBan: totalDepartments,
                soPhongBan: totalDepartments,
                tongLuong: salaryThisMonth?.TongLuong || 0,
                tongThuNhap: salaryThisMonth?.TongThuNhap || 0,
                tongKhauTru: salaryThisMonth?.TongKhauTru || 0,
                tongThuong: bonusThisMonth,
                tongKyLuat: deductionThisMonth,
                choPhepNghiPhep: pendingLeaves,
                hoatDongGanDay: recentActivity
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi lấy thống kê' });
    }
};

/**
 * GET /api/dashboard/chart/salary
 * Dữ liệu biểu đồ lương theo tháng
 */
const getSalaryChart = async (req, res) => {
    try {
        const nam = req.query.nam || new Date().getFullYear();
        const data = await SalaryModel.statsByMonth(nam);
        return res.json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi lấy dữ liệu biểu đồ' });
    }
};

/**
 * GET /api/dashboard/chart/department
 * Dữ liệu biểu đồ nhân viên theo phòng ban
 */
const getDepartmentChart = async (req, res) => {
    try {
        const data = await EmployeeModel.statsByDepartment();
        return res.json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi lấy dữ liệu biểu đồ' });
    }
};

// Helper: lấy số đơn nghỉ chờ duyệt
const getPendingLeaves = async () => {
    const [rows] = await db.execute(
        "SELECT COUNT(*) as cnt FROM DonNghiPhep WHERE TrangThai = 'ChoDuyet'"
    );
    return rows[0].cnt;
};

// Helper: lấy hoạt động gần đây
const getRecentActivity = async () => {
    const [rows] = await db.execute(`
        SELECT 'Nghỉ phép' as loai, nv.HoTen, dnp.TrangThai as trangThai,
               dnp.NgayBatDau as ngay
        FROM DonNghiPhep dnp
        LEFT JOIN NhanVien nv ON dnp.MaNhanVien = nv.MaNhanVien
        ORDER BY dnp.MaDon DESC
        LIMIT 5
    `);
    return rows;
};

module.exports = { getStats, getSalaryChart, getDepartmentChart };