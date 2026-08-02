package K23.CNT1._5.DAQ.quan.comdemo.controller;

import K23.CNT1._5.DAQ.quan.comdemo.dto.ApiResponse;
import K23.CNT1._5.DAQ.quan.comdemo.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/salary")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getSalaryReport(@RequestParam(required = false) Integer nam) {
        return ResponseEntity.ok(ApiResponse.ok(reportService.getSalaryReport(nam)));
    }

    @GetMapping("/employees")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getEmployeeReport() {
        return ResponseEntity.ok(ApiResponse.ok(reportService.getEmployeeReport()));
    }

    @GetMapping("/top-employees")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTopEmployees(
            @RequestParam(required = false) Integer thang,
            @RequestParam(required = false) Integer nam) {
        return ResponseEntity.ok(ApiResponse.ok(reportService.getTopEmployees(thang, nam)));
    }

    @GetMapping("/cost")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTotalCost() {
        return ResponseEntity.ok(ApiResponse.ok(reportService.getTotalCost()));
    }
}
