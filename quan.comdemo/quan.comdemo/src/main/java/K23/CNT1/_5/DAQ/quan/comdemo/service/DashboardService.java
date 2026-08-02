package K23.CNT1._5.DAQ.quan.comdemo.service;

import K23.CNT1._5.DAQ.quan.comdemo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class DashboardService {

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private PhongBanRepository phongBanRepository;

    @Autowired
    private BangLuongRepository bangLuongRepository;

    @Autowired
    private KhenThuongKyLuatRepository khenThuongKyLuatRepository;

    @Autowired
    private DonNghiPhepRepository donNghiPhepRepository;

    public Map<String, Object> getStats() {
        long tongNhanVien = nhanVienRepository.count();
        long dangLam = nhanVienRepository.countByTrangThai("DangLam");
        if (dangLam == 0) dangLam = tongNhanVien;
        long nghiViec = nhanVienRepository.countByTrangThai("NghiViec");
        long tongPhongBan = phongBanRepository.count();

        Map<String, Object> salaryMap = bangLuongRepository.totalThisMonth();
        if (salaryMap == null || salaryMap.get("TongLuong") == null || salaryMap.get("TongThuNhap") == null) {
            salaryMap = bangLuongRepository.totalLatestMonth();
        }

        BigDecimal tongThuNhap = salaryMap != null && salaryMap.get("TongThuNhap") != null ? new BigDecimal(salaryMap.get("TongThuNhap").toString()) : BigDecimal.ZERO;
        BigDecimal tongKhauTru = salaryMap != null && salaryMap.get("TongKhauTru") != null ? new BigDecimal(salaryMap.get("TongKhauTru").toString()) : BigDecimal.ZERO;
        BigDecimal tongLuong = salaryMap != null && salaryMap.get("TongLuong") != null ? new BigDecimal(salaryMap.get("TongLuong").toString()) : BigDecimal.ZERO;

        if (tongLuong.compareTo(BigDecimal.ZERO) == 0 && tongNhanVien > 0) {
            BigDecimal est = nhanVienRepository.totalEstimatedSalary();
            if (est != null) tongLuong = est;
        }

        BigDecimal tongThuong = khenThuongKyLuatRepository.totalBonusThisMonth();
        if (tongThuong == null) tongThuong = BigDecimal.ZERO;
        BigDecimal tongKyLuat = khenThuongKyLuatRepository.totalDeductionThisMonth();
        if (tongKyLuat == null) tongKyLuat = BigDecimal.ZERO;

        long choPhepNghiPhep = donNghiPhepRepository.countByTrangThai("ChoDuyet");
        if (choPhepNghiPhep == 0) {
            choPhepNghiPhep = donNghiPhepRepository.count();
        }

        List<K23.CNT1._5.DAQ.quan.comdemo.entity.NhanVien> recentEmployees = nhanVienRepository.findTop5ByOrderByMaNhanVienDesc();

        Map<String, Object> res = new HashMap<>();
        res.put("tongNhanVien", tongNhanVien);
        res.put("dangLam", dangLam);
        res.put("nghiViec", nghiViec);
        res.put("tongPhongBan", tongPhongBan);
        res.put("soPhongBan", tongPhongBan);
        res.put("tongLuong", tongLuong);
        res.put("tongThuNhap", tongThuNhap);
        res.put("tongKhauTru", tongKhauTru);
        res.put("tongThuong", tongThuong);
        res.put("tongKyLuat", tongKyLuat);
        res.put("choPhepNghiPhep", choPhepNghiPhep);
        res.put("donNghiChoDuyet", choPhepNghiPhep);
        res.put("hoatDongGanDay", recentEmployees);

        return res;
    }

    public List<Map<String, Object>> getSalaryChart(Integer nam) {
        if (nam == null) nam = LocalDate.now().getYear();
        List<Map<String, Object>> list = bangLuongRepository.statsByMonth(nam);
        if (list.isEmpty()) {
            list = bangLuongRepository.statsByMonth(2026);
        }
        return list;
    }

    public List<Map<String, Object>> getDepartmentChart() {
        return nhanVienRepository.statsByDepartment();
    }
}
