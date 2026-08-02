package K23.CNT1._5.DAQ.quan.comdemo.controller;

import K23.CNT1._5.DAQ.quan.comdemo.dto.ApiResponse;
import K23.CNT1._5.DAQ.quan.comdemo.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getStats()));
    }

    @GetMapping("/chart/salary")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getSalaryChart(@RequestParam(required = false) Integer nam) {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getSalaryChart(nam)));
    }

    @GetMapping("/chart/department")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getDepartmentChart() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getDepartmentChart()));
    }
}
