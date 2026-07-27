// =====================================================
// Controller: Đơn nghỉ phép
// =====================================================
const LeaveModel = require('../models/leaveModel');

const getAll = async (req, res) => {
    try {
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20,
            trangThai: req.query.trangThai || '',
            search: req.query.search || '',
            maNhanVien: req.user.tenQuyen === 'NhanVien' ? req.user.maNhanVien : (req.query.maNhanVien || '')
        };

        const [rows, total] = await Promise.all([
            LeaveModel.getAll(options),
            LeaveModel.count(options)
        ]);

        return res.json({
            success: true, data: rows,
            pagination: { page: options.page, limit: options.limit, total, totalPages: Math.ceil(total / options.limit) }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi lấy danh sách nghỉ phép' });
    }
};

const getOne = async (req, res) => {
    try {
        const leave = await LeaveModel.findById(req.params.id);
        if (!leave) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn' });
        return res.json({ success: true, data: leave });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};

const create = async (req, res) => {
    try {
        const data = {
            ...req.body,
            maNhanVien: req.user.tenQuyen === 'NhanVien' ? req.user.maNhanVien : req.body.maNhanVien
        };
        const id = await LeaveModel.create(data);
        const leave = await LeaveModel.findById(id);
        return res.status(201).json({ success: true, message: 'Tạo đơn nghỉ phép thành công', data: leave });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi tạo đơn' });
    }
};

const update = async (req, res) => {
    try {
        await LeaveModel.update(req.params.id, req.body);
        const leave = await LeaveModel.findById(req.params.id);
        return res.json({ success: true, message: 'Cập nhật thành công', data: leave });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi cập nhật' });
    }
};

const approve = async (req, res) => {
    try {
        await LeaveModel.approve(req.params.id);
        return res.json({ success: true, message: 'Duyệt đơn nghỉ phép thành công' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi duyệt đơn' });
    }
};

const reject = async (req, res) => {
    try {
        await LeaveModel.reject(req.params.id);
        return res.json({ success: true, message: 'Từ chối đơn nghỉ phép' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi từ chối đơn' });
    }
};

const remove = async (req, res) => {
    try {
        await LeaveModel.delete(req.params.id);
        return res.json({ success: true, message: 'Xóa đơn thành công' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi xóa đơn' });
    }
};

module.exports = { getAll, getOne, create, update, approve, reject, remove };
