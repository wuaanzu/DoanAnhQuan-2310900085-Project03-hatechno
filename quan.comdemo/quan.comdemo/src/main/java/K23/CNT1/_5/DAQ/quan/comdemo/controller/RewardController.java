package K23.CNT1._5.DAQ.quan.comdemo.controller;

import K23.CNT1._5.DAQ.quan.comdemo.dto.ApiResponse;
import K23.CNT1._5.DAQ.quan.comdemo.entity.KhenThuongKyLuat;
import K23.CNT1._5.DAQ.quan.comdemo.service.RewardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rewards")
public class RewardController {

    @Autowired
    private RewardService rewardService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<KhenThuongKyLuat>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) Integer maNhanVien,
            @RequestParam(required = false, defaultValue = "") String loai,
            @RequestParam(required = false, defaultValue = "") String search) {

        Page<KhenThuongKyLuat> resultPage = rewardService.getAll(page, limit, maNhanVien, loai, search);

        Map<String, Object> pagination = new HashMap<>();
        pagination.put("page", page);
        pagination.put("limit", limit);
        pagination.put("total", resultPage.getTotalElements());
        pagination.put("totalPages", resultPage.getTotalPages());

        return ResponseEntity.ok(ApiResponse.ok(resultPage.getContent(), pagination));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<KhenThuongKyLuat>> getOne(@PathVariable Integer id) {
        KhenThuongKyLuat item = rewardService.getOne(id);
        if (item == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Không tìm thấy"));
        }
        return ResponseEntity.ok(ApiResponse.ok(item));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<KhenThuongKyLuat>> create(@RequestBody Map<String, Object> body) {
        try {
            KhenThuongKyLuat created = rewardService.create(body);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Thêm thành công", created));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi thêm: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<KhenThuongKyLuat>> update(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        try {
            KhenThuongKyLuat updated = rewardService.update(id, body);
            return ResponseEntity.ok(ApiResponse.ok("Cập nhật thành công", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi cập nhật: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Integer id) {
        try {
            rewardService.delete(id);
            return ResponseEntity.ok(ApiResponse.ok("Xóa thành công", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi xóa: " + e.getMessage()));
        }
    }
}
