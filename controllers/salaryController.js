// =====================================================
// Controller: Bảng lương + Xuất PDF/Excel
// =====================================================

const SalaryModel = require('../models/salaryModel');
const EmployeeModel = require('../models/employeeModel');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

const getAll = async (req, res) => {
    try {
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20,
            thang: req.query.thang || '',
            nam: req.query.nam || '',
            maNhanVien: req.query.maNhanVien || '',
            search: req.query.search || ''
        };

        // Nhân viên chỉ xem lương của mình
        if (req.user.tenQuyen === 'NhanVien') {
            options.maNhanVien = req.user.maNhanVien;
        }

        const [rows, total] = await Promise.all([
            SalaryModel.getAll(options),
            SalaryModel.count(options)
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
        return res.status(500).json({ success: false, message: 'Lỗi lấy bảng lương' });
    }
};

const getOne = async (req, res) => {
    try {
        const salary = await SalaryModel.findById(req.params.id);
        if (!salary) return res.status(404).json({ success: false, message: 'Không tìm thấy bảng lương' });

        const details = await SalaryModel.getDetails(req.params.id);
        return res.json({ success: true, data: { ...salary, chiTiet: details } });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
    }
};

const create = async (req, res) => {
    try {
        const id = await SalaryModel.create(req.body);
        const salary = await SalaryModel.findById(id);
        return res.status(201).json({ success: true, message: 'Tạo bảng lương thành công', data: salary });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi tạo bảng lương: ' + error.message });
    }
};

const finalize = async (req, res) => {
    try {
        await SalaryModel.finalize(req.params.id);
        return res.json({ success: true, message: 'Chốt bảng lương thành công' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi chốt bảng lương' });
    }
};

const remove = async (req, res) => {
    try {
        await SalaryModel.delete(req.params.id);
        return res.json({ success: true, message: 'Xóa bảng lương thành công' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi xóa bảng lương' });
    }
};

/**
 * Xuất Excel - Danh sách bảng lương
 */
const exportExcel = async (req, res) => {
    try {
        const { thang, nam } = req.query;
        const rows = await SalaryModel.getAll({ thang, nam, limit: 1000 });

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'HATECHNO HRM';

        const sheet = workbook.addWorksheet('Bảng Lương');

        // Header style
        const headerStyle = {
            font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } },
            alignment: { horizontal: 'center', vertical: 'middle' },
            border: {
                top: { style: 'thin' }, left: { style: 'thin' },
                bottom: { style: 'thin' }, right: { style: 'thin' }
            }
        };

        // Title
        sheet.mergeCells('A1:H1');
        sheet.getCell('A1').value = `BẢNG LƯƠNG THÁNG ${thang || '?'}/${nam || '?'} - CÔNG TY HATECHNO`;
        sheet.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FF2563EB' } };
        sheet.getCell('A1').alignment = { horizontal: 'center' };

        // Headers
        sheet.addRow([]);
        const headerRow = sheet.addRow([
            'STT', 'Mã NV', 'Họ tên', 'Phòng ban', 'Chức vụ',
            'Tổng thu nhập', 'Khấu trừ', 'Lương thực nhận'
        ]);
        headerRow.eachCell(cell => { cell.style = headerStyle; });
        sheet.getRow(3).height = 25;

        // Column widths
        sheet.columns = [
            { width: 6 }, { width: 10 }, { width: 20 }, { width: 18 },
            { width: 15 }, { width: 18 }, { width: 14 }, { width: 18 }
        ];

        // Data rows
        rows.forEach((row, i) => {
            const dataRow = sheet.addRow([
                i + 1, row.MaNV, row.HoTen, row.TenPhongBan, row.TenChucVu,
                row.TongThuNhap, row.TongKhauTru, row.LuongThucNhan
            ]);
            dataRow.eachCell((cell, colNum) => {
                cell.border = {
                    top: { style: 'thin' }, left: { style: 'thin' },
                    bottom: { style: 'thin' }, right: { style: 'thin' }
                };
                if (colNum >= 6) {
                    cell.numFmt = '#,##0';
                    cell.alignment = { horizontal: 'right' };
                }
            });
            // Alternate row color
            if (i % 2 === 0) {
                dataRow.eachCell(cell => {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F4FF' } };
                });
            }
        });

        // Total row
        const totalRow = sheet.addRow([
            '', '', 'TỔNG CỘNG', '', '',
            rows.reduce((s, r) => s + (r.TongThuNhap || 0), 0),
            rows.reduce((s, r) => s + (r.TongKhauTru || 0), 0),
            rows.reduce((s, r) => s + (r.LuongThucNhan || 0), 0)
        ]);
        totalRow.eachCell((cell, colNum) => {
            cell.font = { bold: true };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDE68A' } };
            if (colNum >= 6) { cell.numFmt = '#,##0'; cell.alignment = { horizontal: 'right' }; }
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=BangLuong_T${thang}_${nam}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Export Excel error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi xuất Excel: ' + error.message });
    }
};

/**
 * Xuất PDF - Phiếu lương 1 nhân viên
 */
const exportPDF = async (req, res) => {
    try {
        const salary = await SalaryModel.findById(req.params.id);
        if (!salary) return res.status(404).json({ success: false, message: 'Không tìm thấy bảng lương' });

        const details = await SalaryModel.getDetails(req.params.id);

        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=PhieuLuong_${salary.MaNV}_T${salary.Thang}_${salary.Nam}.pdf`);
        doc.pipe(res);

        // Header
        doc.fontSize(18).font('Helvetica-Bold')
           .text('CÔNG TY HATECHNO', { align: 'center' });
        doc.fontSize(14)
           .text(`PHIẾU LƯƠNG THÁNG ${salary.Thang}/${salary.Nam}`, { align: 'center' });
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown();

        // Employee info
        doc.fontSize(11).font('Helvetica-Bold').text('THÔNG TIN NHÂN VIÊN');
        doc.moveDown(0.3);
        doc.font('Helvetica').fontSize(10);
        doc.text(`Mã NV: ${salary.MaNV}            Họ tên: ${salary.HoTen}`);
        doc.text(`Phòng ban: ${salary.TenPhongBan}     Chức vụ: ${salary.TenChucVu}`);
        doc.moveDown();

        // Salary details
        doc.font('Helvetica-Bold').fontSize(11).text('CHI TIẾT LƯƠNG');
        doc.moveDown(0.3);

        const formatMoney = (n) => new Intl.NumberFormat('vi-VN').format(n) + ' đ';

        // Table header
        const startX = 50;
        const col2X = 380;
        doc.font('Helvetica-Bold').fontSize(10);
        doc.text('Khoản mục', startX, doc.y);
        doc.text('Số tiền', col2X, doc.y - 12);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(0.3);

        doc.font('Helvetica').fontSize(10);
        details.forEach(item => {
            const y = doc.y;
            doc.text(item.LoaiKhoan, startX, y);
            doc.text(formatMoney(item.SoTien), col2X, y);
            doc.moveDown(0.4);
        });

        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(0.3);

        // Total
        doc.font('Helvetica-Bold').fontSize(11);
        const ty = doc.y;
        doc.text('Tổng thu nhập:', startX, ty);
        doc.text(formatMoney(salary.TongThuNhap), col2X, ty);
        doc.moveDown(0.4);
        const ty2 = doc.y;
        doc.text('Tổng khấu trừ:', startX, ty2);
        doc.text(formatMoney(salary.TongKhauTru), col2X, ty2);
        doc.moveDown(0.4);

        doc.fillColor('#2563EB').fontSize(13);
        const ty3 = doc.y;
        doc.text('LƯƠNG THỰC NHẬN:', startX, ty3);
        doc.text(formatMoney(salary.LuongThucNhan), col2X, ty3);
        doc.fillColor('black');

        doc.moveDown(2);
        doc.fontSize(9).font('Helvetica')
           .text(`Ngày lập: ${salary.NgayLap ? new Date(salary.NgayLap).toLocaleDateString('vi-VN') : ''}`, { align: 'right' });

        doc.end();
    } catch (error) {
        console.error('Export PDF error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi xuất PDF: ' + error.message });
    }
};

module.exports = { getAll, getOne, create, finalize, remove, exportExcel, exportPDF };
