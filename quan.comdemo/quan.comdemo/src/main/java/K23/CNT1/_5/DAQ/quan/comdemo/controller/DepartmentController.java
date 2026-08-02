package K23.CNT1._5.DAQ.quan.comdemo.controller;

import K23.CNT1._5.DAQ.quan.comdemo.dto.ApiResponse;
import K23.CNT1._5.DAQ.quan.comdemo.entity.PhongBan;
import K23.CNT1._5.DAQ.quan.comdemo.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PhongBan>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(departmentService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PhongBan>> getOne(@PathVariable Integer id) {
        PhongBan pb = departmentService.getOne(id);
        if (pb == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Không tìm thấy phòng ban"));
        }
        return ResponseEntity.ok(ApiResponse.ok(pb));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PhongBan>> create(@RequestBody PhongBan phongBan) {
        try {
            PhongBan created = departmentService.create(phongBan);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Thêm phòng ban thành công", created));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi thêm phòng ban: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PhongBan>> update(@PathVariable Integer id, @RequestBody PhongBan phongBan) {
        try {
            PhongBan updated = departmentService.update(id, phongBan);
            return ResponseEntity.ok(ApiResponse.ok("Cập nhật thành công", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi cập nhật phòng ban: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Integer id) {
        try {
            departmentService.delete(id);
            return ResponseEntity.ok(ApiResponse.ok("Xóa phòng ban thành công", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi xóa phòng ban: " + e.getMessage()));
        }
    }
}
