package K23.CNT1._5.DAQ.quan.comdemo.service;

import K23.CNT1._5.DAQ.quan.comdemo.repository.BangLuongRepository;
import K23.CNT1._5.DAQ.quan.comdemo.repository.NhanVienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    @Autowired
    private BangLuongRepository bangLuongRepository;

    @Autowired
    private NhanVienRepository nhanVienRepository;

    public List<Map<String, Object>> getSalaryReport(Integer nam) {
        if (nam == null) nam = LocalDate.now().getYear();
        List<Map<String, Object>> list = bangLuongRepository.statsByMonth(nam);
        if (list.isEmpty()) {
            list = bangLuongRepository.statsByMonth(2026);
        }
        return list;
    }

    public List<Map<String, Object>> getEmployeeReport() {
        return nhanVienRepository.statsByDepartment();
    }

    public List<Map<String, Object>> getTopEmployees(Integer thang, Integer nam) {
        List<Map<String, Object>> list = bangLuongRepository.topEmployees(thang, nam);
        if (list == null || list.isEmpty()) {
            list = bangLuongRepository.topEmployees(null, null);
        }
        if (list == null || list.isEmpty()) {
            list = nhanVienRepository.topEmployeesByBaseSalary();
        }
        return list;
    }

    public List<Map<String, Object>> getTotalCost() {
        return bangLuongRepository.totalCostReport();
    }
}
