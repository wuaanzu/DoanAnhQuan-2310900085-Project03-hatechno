package K23.CNT1._5.DAQ.quan.comdemo.controller;

import io.jsonwebtoken.Claims;
import K23.CNT1._5.DAQ.quan.comdemo.dto.ApiResponse;
import K23.CNT1._5.DAQ.quan.comdemo.entity.DonNghiPhep;
import K23.CNT1._5.DAQ.quan.comdemo.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DonNghiPhep>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) Integer maNhanVien,
            @RequestParam(required = false, defaultValue = "") String trangThai,
            @RequestParam(required = false, defaultValue = "") String search) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Claims claims) {
            String tenQuyen = claims.get("tenQuyen", String.class);
            if ("NhanVien".equals(tenQuyen)) {
                maNhanVien = claims.get("maNhanVien", Integer.class);
            }
        }

        Page<DonNghiPhep> resultPage = leaveService.getAll(page, limit, maNhanVien, trangThai, search);

        Map<String, Object> pagination = new HashMap<>();
        pagination.put("page", page);
        pagination.put("limit", limit);
        pagination.put("total", resultPage.getTotalElements());
        pagination.put("totalPages", resultPage.getTotalPages());

        return ResponseEntity.ok(ApiResponse.ok(resultPage.getContent(), pagination));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DonNghiPhep>> getOne(@PathVariable Integer id) {
        DonNghiPhep dnp = leaveService.getOne(id);
        if (dnp == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Không tìm thấy đơn"));
        }
        return ResponseEntity.ok(ApiResponse.ok(dnp));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DonNghiPhep>> create(@RequestBody Map<String, Object> body) {
        try {
            Integer userMaNV = null;
            String userRole = null;

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof Claims claims) {
                userRole = claims.get("tenQuyen", String.class);
                userMaNV = claims.get("maNhanVien", Integer.class);
            }

            DonNghiPhep created = leaveService.create(body, userMaNV, userRole);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Tạo đơn nghỉ phép thành công", created));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi tạo đơn: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DonNghiPhep>> update(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        try {
            DonNghiPhep updated = leaveService.update(id, body);
            return ResponseEntity.ok(ApiResponse.ok("Cập nhật thành công", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi cập nhật: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<DonNghiPhep>> approve(@PathVariable Integer id) {
        try {
            DonNghiPhep approved = leaveService.approve(id);
            return ResponseEntity.ok(ApiResponse.ok("Duyệt đơn nghỉ phép thành công", approved));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi duyệt đơn: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<DonNghiPhep>> reject(@PathVariable Integer id) {
        try {
            DonNghiPhep rejected = leaveService.reject(id);
            return ResponseEntity.ok(ApiResponse.ok("Từ chối đơn nghỉ phép", rejected));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi từ chối đơn: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Integer id) {
        try {
            leaveService.delete(id);
            return ResponseEntity.ok(ApiResponse.ok("Xóa đơn thành công", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi xóa đơn: " + e.getMessage()));
        }
    }
}
