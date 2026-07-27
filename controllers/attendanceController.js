// =====================================================
// Controller: Chấm công
// =====================================================
const AttendanceModel = require('../models/attendanceModel');

const getAll = async (req, res) => {
    try {
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20,
            maNhanVien: req.query.maNhanVien || '',
            thang: req.query.thang || '',
            nam: req.query.nam || '',
            search: req.query.search || ''
        };

        const [rows, total] = await Promise.all([
            AttendanceModel.getAll(options),
            AttendanceModel.count(options)
        ]);

        return res.json({
            success: true,
            data: rows,
            pagination: {
                page: options.page,
                limit: options.limit,
                total,
                totalPages: Math.ceil(total / options.limit)
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi lấy dữ liệu chấm công' });
    }
};

const getOne = async (req, res) => {
    try {
        const record = await AttendanceModel.findById(req.params.id);
        if (!record) return res.status(404).json({ success: false, message: 'Không tìm thấy bản ghi' });
        return res.json({ success: true, data: record });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};

const create = async (req, res) => {
    try {
        const data = req.body;
        // Tự tính số giờ làm
        if (data.gioVao && data.gioRa && !data.soGioLam) {
            const [h1, m1] = data.gioVao.split(':').map(Number);
            const [h2, m2] = data.gioRa.split(':').map(Number);
            data.soGioLam = ((h2 * 60 + m2) - (h1 * 60 + m1)) / 60;
        }
        const id = await AttendanceModel.create(data);
        const record = await AttendanceModel.findById(id);
        return res.status(201).json({ success: true, message: 'Thêm chấm công thành công', data: record });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi thêm chấm công' });
    }
};

const update = async (req, res) => {
    try {
        const data = req.body;
        if (data.gioVao && data.gioRa && !data.soGioLam) {
            const [h1, m1] = data.gioVao.split(':').map(Number);
            const [h2, m2] = data.gioRa.split(':').map(Number);
            data.soGioLam = ((h2 * 60 + m2) - (h1 * 60 + m1)) / 60;
        }
        await AttendanceModel.update(req.params.id, data);
        const record = await AttendanceModel.findById(req.params.id);
        return res.json({ success: true, message: 'Cập nhật thành công', data: record });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi cập nhật chấm công' });
    }
};

const remove = async (req, res) => {
    try {
        await AttendanceModel.delete(req.params.id);
        return res.json({ success: true, message: 'Xóa thành công' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi xóa' });
    }
};

module.exports = { getAll, getOne, create, update, remove };
