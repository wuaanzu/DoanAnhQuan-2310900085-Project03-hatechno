// =====================================================
// Controller: Khen thưởng & Kỷ luật
// =====================================================
const RewardModel = require('../models/rewardModel');

const getAll = async (req, res) => {
    try {
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20,
            maNhanVien: req.query.maNhanVien || '',
            loai: req.query.loai || '',
            search: req.query.search || ''
        };
        const [rows, total] = await Promise.all([
            RewardModel.getAll(options),
            RewardModel.count(options)
        ]);
        return res.json({ success: true, data: rows, pagination: { page: options.page, limit: options.limit, total, totalPages: Math.ceil(total / options.limit) } });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi lấy danh sách' });
    }
};

const getOne = async (req, res) => {
    try {
        const item = await RewardModel.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
        return res.json({ success: true, data: item });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};

const create = async (req, res) => {
    try {
        if (!req.body.maNhanVien || !req.body.loai || !req.body.ngay) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
        }
        const id = await RewardModel.create(req.body);
        const item = await RewardModel.findById(id);
        return res.status(201).json({ success: true, message: 'Thêm thành công', data: item });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi thêm: ' + error.message });
    }
};

const update = async (req, res) => {
    try {
        await RewardModel.update(req.params.id, req.body);
        const item = await RewardModel.findById(req.params.id);
        return res.json({ success: true, message: 'Cập nhật thành công', data: item });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi cập nhật' });
    }
};

const remove = async (req, res) => {
    try {
        await RewardModel.delete(req.params.id);
        return res.json({ success: true, message: 'Xóa thành công' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi xóa' });
    }
};

module.exports = { getAll, getOne, create, update, remove };
