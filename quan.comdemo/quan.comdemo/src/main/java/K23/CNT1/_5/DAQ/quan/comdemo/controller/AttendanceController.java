package K23.CNT1._5.DAQ.quan.comdemo.controller;

import K23.CNT1._5.DAQ.quan.comdemo.dto.ApiResponse;
import K23.CNT1._5.DAQ.quan.comdemo.entity.ChamCong;
import K23.CNT1._5.DAQ.quan.comdemo.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ChamCong>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) Integer maNhanVien,
            @RequestParam(required = false) Integer thang,
            @RequestParam(required = false) Integer nam,
            @RequestParam(required = false, defaultValue = "") String search) {

        Page<ChamCong> resultPage = attendanceService.getAll(page, limit, maNhanVien, thang, nam, search);

        Map<String, Object> pagination = new HashMap<>();
        pagination.put("page", page);
        pagination.put("limit", limit);
        pagination.put("total", resultPage.getTotalElements());
        pagination.put("totalPages", resultPage.getTotalPages());

        return ResponseEntity.ok(ApiResponse.ok(resultPage.getContent(), pagination));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ChamCong>> getOne(@PathVariable Integer id) {
        ChamCong cc = attendanceService.getOne(id);
        if (cc == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Không tìm thấy bản ghi"));
        }
        return ResponseEntity.ok(ApiResponse.ok(cc));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ChamCong>> create(@RequestBody Map<String, Object> body) {
        try {
            ChamCong created = attendanceService.create(body);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Thêm chấm công thành công", created));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi thêm chấm công: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ChamCong>> update(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        try {
            ChamCong updated = attendanceService.update(id, body);
            return ResponseEntity.ok(ApiResponse.ok("Cập nhật thành công", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi cập nhật chấm công: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Integer id) {
        try {
            attendanceService.delete(id);
            return ResponseEntity.ok(ApiResponse.ok("Xóa thành công", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi xóa: " + e.getMessage()));
        }
    }
}
