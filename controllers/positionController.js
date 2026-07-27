// =====================================================
// Controller: Chức vụ
// =====================================================
const PositionModel = require('../models/positionModel');

const getAll = async (req, res) => {
    try {
        const positions = await PositionModel.getAll();
        return res.json({ success: true, data: positions });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi lấy chức vụ' });
    }
};

const getOne = async (req, res) => {
    try {
        const pos = await PositionModel.findById(req.params.id);
        if (!pos) return res.status(404).json({ success: false, message: 'Không tìm thấy chức vụ' });
        return res.json({ success: true, data: pos });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};

const create = async (req, res) => {
    try {
        if (!req.body.tenChucVu) {
            return res.status(400).json({ success: false, message: 'Tên chức vụ không được trống' });
        }
        const id = await PositionModel.create(req.body);
        const pos = await PositionModel.findById(id);
        return res.status(201).json({ success: true, message: 'Thêm chức vụ thành công', data: pos });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi thêm chức vụ' });
    }
};

const update = async (req, res) => {
    try {
        await PositionModel.update(req.params.id, req.body);
        const updated = await PositionModel.findById(req.params.id);
        return res.json({ success: true, message: 'Cập nhật thành công', data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi cập nhật' });
    }
};

const remove = async (req, res) => {
    try {
        await PositionModel.delete(req.params.id);
        return res.json({ success: true, message: 'Xóa chức vụ thành công' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAll, getOne, create, update, remove };
