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
        return bangLuongRepository.statsByMonth(nam);
    }

    public List<Map<String, Object>> getEmployeeReport() {
        return nhanVienRepository.statsByDepartment();
    }

    public List<Map<String, Object>> getTopEmployees(Integer thang, Integer nam) {
        if (thang == null) thang = LocalDate.now().getMonthValue();
        if (nam == null) nam = LocalDate.now().getYear();
        return bangLuongRepository.topEmployees(thang, nam);
    }

    public List<Map<String, Object>> getTotalCost() {
        return bangLuongRepository.totalCostReport();
    }
}
