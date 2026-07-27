// =====================================================
// Controller: Nhân viên (CRUD + Search + Paginate)
// =====================================================

const EmployeeModel = require('../models/employeeModel');
const path = require('path');
const fs = require('fs');

const getAll = async (req, res) => {
    try {
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            search: req.query.search || '',
            maPhongBan: req.query.maPhongBan || '',
            maChucVu: req.query.maChucVu || '',
            trangThai: req.query.trangThai || '',
            sortBy: req.query.sortBy || 'MaNhanVien',
            sortDir: req.query.sortDir || 'ASC'
        };

        const [employees, total] = await Promise.all([
            EmployeeModel.getAll(options),
            EmployeeModel.count({
                search: options.search,
                maPhongBan: options.maPhongBan,
                trangThai: options.trangThai
            })
        ]);

        return res.json({
            success: true,
            data: employees,
            pagination: {
                page: options.page,
                limit: options.limit,
                total,
                totalPages: Math.ceil(total / options.limit)
            }
        });
    } catch (error) {
        console.error('Get employees error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi lấy danh sách nhân viên' });
    }
};

const getOne = async (req, res) => {
    try {
        const employee = await EmployeeModel.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy nhân viên' });
        }
        return res.json({ success: true, data: employee });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};

const create = async (req, res) => {
    try {
        const data = req.body;

        // Kiểm tra MaNV đã tồn tại
        if (data.maNV) {
            const exists = await EmployeeModel.maNVExists(data.maNV);
            if (exists) {
                return res.status(400).json({ success: false, message: 'Mã nhân viên đã tồn tại' });
            }
        }

        // Avatar
        if (req.file) {
            data.avatar = `/uploads/avatars/${req.file.filename}`;
        }

        const id = await EmployeeModel.create(data);
        const employee = await EmployeeModel.findById(id);

        return res.status(201).json({
            success: true,
            message: 'Thêm nhân viên thành công',
            data: employee
        });
    } catch (error) {
        console.error('Create employee error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi thêm nhân viên: ' + error.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const existing = await EmployeeModel.findById(id);
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy nhân viên' });
        }

        // Avatar mới
        if (req.file) {
            data.avatar = `/uploads/avatars/${req.file.filename}`;
            // Xóa avatar cũ nếu có
            if (existing.Avatar) {
                const oldPath = path.join(__dirname, '..', existing.Avatar);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        }

        await EmployeeModel.update(id, data);
        const updated = await EmployeeModel.findById(id);

        return res.json({
            success: true,
            message: 'Cập nhật nhân viên thành công',
            data: updated
        });
    } catch (error) {
        console.error('Update employee error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi cập nhật nhân viên' });
    }
};

const remove = async (req, res) => {
    try {
        const existing = await EmployeeModel.findById(req.params.id);
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy nhân viên' });
        }

        await EmployeeModel.delete(req.params.id);
        return res.json({ success: true, message: 'Xóa nhân viên thành công' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi xóa nhân viên: ' + error.message });
    }
};

const getSimple = async (req, res) => {
    try {
        const employees = await EmployeeModel.getAllSimple();
        return res.json({ success: true, data: employees });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};

module.exports = { getAll, getOne, create, update, remove, getSimple };
