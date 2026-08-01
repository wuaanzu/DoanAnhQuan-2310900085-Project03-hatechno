// =====================================================
// Controller: Phòng ban
// =====================================================
const DepartmentModel = require('../models/departmentModel');

const getAll = async (req, res) => {
    try {
        const departments = await DepartmentModel.getAll();
        return res.json({ success: true, data: departments });
    } catch (error) {
        console.error('Lỗi lấy phòng ban:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getOne = async (req, res) => {
    try {
        const dept = await DepartmentModel.findById(req.params.id);
        if (!dept) return res.status(404).json({ success: false, message: 'Không tìm thấy phòng ban' });
        return res.json({ success: true, data: dept });
    } catch (error) {
        console.error('Lỗi lấy 1 phòng ban:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const create = async (req, res) => {
    try {
        if (!req.body.tenPhongBan) {
            return res.status(400).json({ success: false, message: 'Tên phòng ban không được trống' });
        }
        const id = await DepartmentModel.create(req.body);
        const dept = await DepartmentModel.findById(id);
        return res.status(201).json({ success: true, message: 'Thêm phòng ban thành công', data: dept });
    } catch (error) {
        console.error('Lỗi thêm phòng ban:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const existing = await DepartmentModel.findById(req.params.id);
        if (!existing) return res.status(404).json({ success: false, message: 'Không tìm thấy phòng ban' });
        await DepartmentModel.update(req.params.id, req.body);
        const updated = await DepartmentModel.findById(req.params.id);
        return res.json({ success: true, message: 'Cập nhật thành công', data: updated });
    } catch (error) {
        console.error('Lỗi cập nhật phòng ban:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const remove = async (req, res) => {
    try {
        await DepartmentModel.delete(req.params.id);
        return res.json({ success: true, message: 'Xóa phòng ban thành công' });
    } catch (error) {
        console.error('Lỗi xóa phòng ban:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAll, getOne, create, update, remove };