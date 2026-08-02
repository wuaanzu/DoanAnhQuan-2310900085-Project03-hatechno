package K23.CNT1._5.DAQ.quan.comdemo.service;

import K23.CNT1._5.DAQ.quan.comdemo.entity.BangLuong;
import K23.CNT1._5.DAQ.quan.comdemo.entity.ChiTietBangLuong;
import K23.CNT1._5.DAQ.quan.comdemo.entity.NhanVien;
import K23.CNT1._5.DAQ.quan.comdemo.repository.BangLuongRepository;
import K23.CNT1._5.DAQ.quan.comdemo.repository.ChamCongRepository;
import K23.CNT1._5.DAQ.quan.comdemo.repository.ChiTietBangLuongRepository;
import K23.CNT1._5.DAQ.quan.comdemo.repository.NhanVienRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class SalaryService {

    @Autowired
    private BangLuongRepository bangLuongRepository;

    @Autowired
    private ChiTietBangLuongRepository chiTietBangLuongRepository;

    @Autowired
    private NhanVienRepository nhanVienRepository;

    public Page<BangLuong> getAll(int page, int limit, Integer thang, Integer nam, Integer maNhanVien, String search) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "maBangLuong"));
        return bangLuongRepository.filterSalary(maNhanVien, thang, nam, search, pageable);
    }

    public BangLuong getOne(Integer id) {
        return bangLuongRepository.findById(id).orElse(null);
    }

    public List<ChiTietBangLuong> getDetails(Integer maBangLuong) {
        return chiTietBangLuongRepository.findByBangLuongMaBangLuong(maBangLuong);
    }

    @Transactional
    public BangLuong create(Map<String, Object> body) {
        Integer maNhanVien = Integer.parseInt(body.get("maNhanVien").toString());
        NhanVien nv = nhanVienRepository.findById(maNhanVien).orElseThrow(() -> new NoSuchElementException("Không tìm thấy nhân viên"));

        Integer thang = Integer.parseInt(body.get("thang").toString());
        Integer nam = Integer.parseInt(body.get("nam").toString());

        BigDecimal luongCoBan = body.get("luongCoBan") != null && !body.get("luongCoBan").toString().isEmpty() ? new BigDecimal(body.get("luongCoBan").toString()) : BigDecimal.ZERO;
        BigDecimal phuCap = body.get("phuCap") != null && !body.get("phuCap").toString().isEmpty() ? new BigDecimal(body.get("phuCap").toString()) : BigDecimal.ZERO;
        BigDecimal thuong = body.get("thuong") != null && !body.get("thuong").toString().isEmpty() ? new BigDecimal(body.get("thuong").toString()) : BigDecimal.ZERO;
        BigDecimal tienTangCa = body.get("tienTangCa") != null && !body.get("tienTangCa").toString().isEmpty() ? new BigDecimal(body.get("tienTangCa").toString()) : BigDecimal.ZERO;

        BigDecimal bhxh = body.get("bhxh") != null && !body.get("bhxh").toString().isEmpty() ? new BigDecimal(body.get("bhxh").toString()) : BigDecimal.ZERO;
        BigDecimal thue = body.get("thue") != null && !body.get("thue").toString().isEmpty() ? new BigDecimal(body.get("thue").toString()) : BigDecimal.ZERO;
        BigDecimal khauTruKhac = body.get("khauTruKhac") != null && !body.get("khauTruKhac").toString().isEmpty() ? new BigDecimal(body.get("khauTruKhac").toString()) : BigDecimal.ZERO;

        BigDecimal tongThuNhap = luongCoBan.add(phuCap).add(thuong).add(tienTangCa);
        if (body.get("tongThuNhap") != null && !body.get("tongThuNhap").toString().isEmpty()) {
            BigDecimal customThuNhap = new BigDecimal(body.get("tongThuNhap").toString());
            if (customThuNhap.compareTo(BigDecimal.ZERO) > 0) tongThuNhap = customThuNhap;
        }

        BigDecimal tongKhauTru = bhxh.add(thue).add(khauTruKhac);
        if (body.get("tongKhauTru") != null && !body.get("tongKhauTru").toString().isEmpty()) {
            BigDecimal customKhauTru = new BigDecimal(body.get("tongKhauTru").toString());
            if (customKhauTru.compareTo(BigDecimal.ZERO) > 0) tongKhauTru = customKhauTru;
        }

        BigDecimal luongThucNhan = tongThuNhap.subtract(tongKhauTru);

        BangLuong existing = bangLuongRepository.findByNhanVienMaNhanVienAndThangAndNam(maNhanVien, thang, nam);
        if (existing != null) {
            existing.setTongThuNhap(tongThuNhap);
            existing.setTongKhauTru(tongKhauTru);
            existing.setLuongThucNhan(luongThucNhan);
            existing.setNgayLap(LocalDate.now());
            return bangLuongRepository.save(existing);
        }

        BangLuong bl = BangLuong.builder()
                .nhanVien(nv)
                .thang(thang)
                .nam(nam)
                .tongThuNhap(tongThuNhap)
                .tongKhauTru(tongKhauTru)
                .luongThucNhan(luongThucNhan)
                .ngayLap(LocalDate.now())
                .trangThai("ChuaChot")
                .build();

        return bangLuongRepository.save(bl);
    }

    @Transactional
    public BangLuong finalizeSalary(Integer id) {
        BangLuong bl = bangLuongRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Không tìm thấy bảng lương"));
        bl.setTrangThai("DaChot");
        return bangLuongRepository.save(bl);
    }

    @Transactional
    public int finalizeAllSalary(Integer thang, Integer nam) {
        List<BangLuong> all = bangLuongRepository.findAll();
        int count = 0;
        for (BangLuong bl : all) {
            boolean matchThang = (thang == null || (bl.getThang() != null && bl.getThang().equals(thang)));
            boolean matchNam = (nam == null || (bl.getNam() != null && bl.getNam().equals(nam)));
            if (matchThang && matchNam) {
                bl.setTrangThai("DaChot");
                bangLuongRepository.save(bl);
                count++;
            }
        }
        return count;
    }

    @Autowired
    private ChamCongRepository chamCongRepository;

    @Transactional
    public List<BangLuong> syncSalaryFromAttendance(Integer thang, Integer nam) {
        if (thang == null) thang = LocalDate.now().getMonthValue();
        if (nam == null) nam = LocalDate.now().getYear();

        List<NhanVien> employees = nhanVienRepository.findAll();
        List<BangLuong> updatedSalaries = new ArrayList<>();

        for (NhanVien nv : employees) {
            BangLuong bl = syncSingleSalaryFromAttendance(nv.getMaNhanVien(), thang, nam);
            if (bl != null) updatedSalaries.add(bl);
        }
        return updatedSalaries;
    }

    @Transactional
    public BangLuong syncSingleSalaryFromAttendance(Integer maNhanVien, Integer thang, Integer nam) {
        NhanVien nv = nhanVienRepository.findById(maNhanVien).orElse(null);
        if (nv == null) return null;

        if (thang == null) thang = LocalDate.now().getMonthValue();
        if (nam == null) nam = LocalDate.now().getYear();

        List<K23.CNT1._5.DAQ.quan.comdemo.entity.ChamCong> attendanceList = chamCongRepository.findByEmployeeAndMonthYear(maNhanVien, thang, nam);

        double totalWorkHours = 0;
        double totalOT = 0;
        int lateDays = 0;
        int workDays = attendanceList.size();

        for (var cc : attendanceList) {
            totalWorkHours += (cc.getSoGioLam() != null ? cc.getSoGioLam().doubleValue() : 8.0);
            totalOT += (cc.getTangCa() != null ? cc.getTangCa().doubleValue() : 0.0);
            if ("DiMuon".equalsIgnoreCase(cc.getTrangThai()) || "Đi muộn".equalsIgnoreCase(cc.getTrangThai())) {
                lateDays++;
            }
        }

        BigDecimal phuCap = (nv.getChucVu() != null && nv.getChucVu().getPhuCap() != null) ? nv.getChucVu().getPhuCap() : BigDecimal.ZERO;
        BigDecimal dailyRate = new BigDecimal("400000"); // 400,000 VNĐ / ngày

        BigDecimal luongCoBan = workDays > 0 ? dailyRate.multiply(new BigDecimal(workDays)) : new BigDecimal("8000000");
        BigDecimal tienTangCa = new BigDecimal(totalOT).multiply(new BigDecimal("75000")); // 75k / giờ tăng ca
        BigDecimal tienPhat = new BigDecimal(lateDays).multiply(new BigDecimal("50000")); // 50k / lần trễ

        BigDecimal tongThuNhap = luongCoBan.add(tienTangCa).add(phuCap);
        BigDecimal bhxh = luongCoBan.multiply(new BigDecimal("0.08")); // 8% BHXH
        BigDecimal tongKhauTru = bhxh.add(tienPhat);
        BigDecimal luongThucNhan = tongThuNhap.subtract(tongKhauTru);

        BangLuong existing = bangLuongRepository.findByNhanVienMaNhanVienAndThangAndNam(maNhanVien, thang, nam);
        if (existing != null) {
            existing.setTongThuNhap(tongThuNhap);
            existing.setTongKhauTru(tongKhauTru);
            existing.setLuongThucNhan(luongThucNhan);
            existing.setNgayLap(LocalDate.now());
            return bangLuongRepository.save(existing);
        } else {
            BangLuong newBL = BangLuong.builder()
                    .nhanVien(nv)
                    .thang(thang)
                    .nam(nam)
                    .tongThuNhap(tongThuNhap)
                    .tongKhauTru(tongKhauTru)
                    .luongThucNhan(luongThucNhan)
                    .ngayLap(LocalDate.now())
                    .trangThai("ChuaChot")
                    .build();
            return bangLuongRepository.save(newBL);
        }
    }

    @Transactional
    public void delete(Integer id) {
        chiTietBangLuongRepository.deleteByBangLuongMaBangLuong(id);
        bangLuongRepository.deleteById(id);
    }

    public List<BangLuong> getByEmployee(Integer maNhanVien) {
        return bangLuongRepository.findByNhanVienMaNhanVien(maNhanVien);
    }

    public byte[] exportExcel(Integer thang, Integer nam) throws Exception {
        List<BangLuong> rows = bangLuongRepository.filterSalary(null, thang, nam, "", PageRequest.of(0, 1000)).getContent();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Bảng Lương");

            // Header Font & Style
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.ROYAL_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            // Title
            Row titleRow = sheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("BẢNG LƯƠNG THÁNG " + (thang != null ? thang : "?") + "/" + (nam != null ? nam : "?") + " - CÔNG TY HATECHNO");

            // Table Headers
            Row headerRow = sheet.createRow(2);
            String[] headers = {"STT", "Mã NV", "Họ tên", "Phòng ban", "Chức vụ", "Tổng thu nhập", "Khấu trừ", "Lương thực nhận"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 3;
            for (int i = 0; i < rows.size(); i++) {
                BangLuong bl = rows.get(i);
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(i + 1);
                row.createCell(1).setCellValue(bl.getNhanVien() != null ? bl.getNhanVien().getMaNV() : "");
                row.createCell(2).setCellValue(bl.getNhanVien() != null ? bl.getNhanVien().getHoTen() : "");
                row.createCell(3).setCellValue(bl.getNhanVien() != null && bl.getNhanVien().getPhongBan() != null ? bl.getNhanVien().getPhongBan().getTenPhongBan() : "");
                row.createCell(4).setCellValue(bl.getNhanVien() != null && bl.getNhanVien().getChucVu() != null ? bl.getNhanVien().getChucVu().getTenChucVu() : "");
                row.createCell(5).setCellValue(bl.getTongThuNhap() != null ? bl.getTongThuNhap().doubleValue() : 0);
                row.createCell(6).setCellValue(bl.getTongKhauTru() != null ? bl.getTongKhauTru().doubleValue() : 0);
                row.createCell(7).setCellValue(bl.getLuongThucNhan() != null ? bl.getLuongThucNhan().doubleValue() : 0);
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }
}
