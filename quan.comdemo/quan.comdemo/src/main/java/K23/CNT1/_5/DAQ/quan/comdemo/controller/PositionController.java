package K23.CNT1._5.DAQ.quan.comdemo.controller;

import K23.CNT1._5.DAQ.quan.comdemo.dto.ApiResponse;
import K23.CNT1._5.DAQ.quan.comdemo.entity.ChucVu;
import K23.CNT1._5.DAQ.quan.comdemo.service.PositionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/positions")
public class PositionController {

    @Autowired
    private PositionService positionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ChucVu>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(positionService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ChucVu>> getOne(@PathVariable Integer id) {
        ChucVu cv = positionService.getOne(id);
        if (cv == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Không tìm thấy chức vụ"));
        }
        return ResponseEntity.ok(ApiResponse.ok(cv));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ChucVu>> create(@RequestBody ChucVu chucVu) {
        try {
            ChucVu created = positionService.create(chucVu);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Thêm chức vụ thành công", created));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi thêm chức vụ: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ChucVu>> update(@PathVariable Integer id, @RequestBody ChucVu chucVu) {
        try {
            ChucVu updated = positionService.update(id, chucVu);
            return ResponseEntity.ok(ApiResponse.ok("Cập nhật thành công", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi cập nhật chức vụ: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Integer id) {
        try {
            positionService.delete(id);
            return ResponseEntity.ok(ApiResponse.ok("Xóa chức vụ thành công", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi xóa chức vụ: " + e.getMessage()));
        }
    }
}
