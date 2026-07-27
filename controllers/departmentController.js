// =====================================================
// Controller: Phòng ban
// =====================================================
const DepartmentModel = require('../models/departmentModel');

const getAll = async (req, res) => {
    try {
        const departments = await DepartmentModel.getAll();
        return res.json({ success: true, data: departments });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi lấy phòng ban' });
    }
};

const getOne = async (req, res) => {
    try {
        const dept = await DepartmentModel.findById(req.params.id);
        if (!dept) return res.status(404).json({ success: false, message: 'Không tìm thấy phòng ban' });
        return res.json({ success: true, data: dept });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
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
        return res.status(500).json({ success: false, message: 'Lỗi thêm phòng ban' });
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
        return res.status(500).json({ success: false, message: 'Lỗi cập nhật' });
    }
};

const remove = async (req, res) => {
    try {
        await DepartmentModel.delete(req.params.id);
        return res.json({ success: true, message: 'Xóa phòng ban thành công' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAll, getOne, create, update, remove };
