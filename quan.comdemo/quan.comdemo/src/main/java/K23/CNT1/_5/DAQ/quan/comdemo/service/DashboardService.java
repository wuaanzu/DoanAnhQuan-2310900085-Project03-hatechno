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
        long nghiViec = nhanVienRepository.countByTrangThai("NghiViec");
        long tongPhongBan = phongBanRepository.count();

        Map<String, Object> salaryMap = bangLuongRepository.totalThisMonth();
        if (salaryMap == null || salaryMap.get("TongLuong") == null) {
            salaryMap = bangLuongRepository.totalLatestMonth();
        }

        BigDecimal tongThuNhap = salaryMap != null && salaryMap.get("TongThuNhap") != null ? new BigDecimal(salaryMap.get("TongThuNhap").toString()) : BigDecimal.ZERO;
        BigDecimal tongKhauTru = salaryMap != null && salaryMap.get("TongKhauTru") != null ? new BigDecimal(salaryMap.get("TongKhauTru").toString()) : BigDecimal.ZERO;
        BigDecimal tongLuong = salaryMap != null && salaryMap.get("TongLuong") != null ? new BigDecimal(salaryMap.get("TongLuong").toString()) : BigDecimal.ZERO;

        BigDecimal tongThuong = khenThuongKyLuatRepository.totalBonusThisMonth();
        BigDecimal tongKyLuat = khenThuongKyLuatRepository.totalDeductionThisMonth();

        long choPhepNghiPhep = donNghiPhepRepository.countByTrangThai("ChoDuyet");
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
        res.put("hoatDongGanDay", recentEmployees);

        return res;
    }

    public List<Map<String, Object>> getSalaryChart(Integer nam) {
        if (nam == null) nam = LocalDate.now().getYear();
        return bangLuongRepository.statsByMonth(nam);
    }

    public List<Map<String, Object>> getDepartmentChart() {
        return nhanVienRepository.statsByDepartment();
    }
}
