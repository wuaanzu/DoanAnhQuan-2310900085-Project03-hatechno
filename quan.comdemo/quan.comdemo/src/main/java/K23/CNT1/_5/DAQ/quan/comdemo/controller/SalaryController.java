package K23.CNT1._5.DAQ.quan.comdemo.controller;

import io.jsonwebtoken.Claims;
import K23.CNT1._5.DAQ.quan.comdemo.dto.ApiResponse;
import K23.CNT1._5.DAQ.quan.comdemo.entity.BangLuong;
import K23.CNT1._5.DAQ.quan.comdemo.entity.ChiTietBangLuong;
import K23.CNT1._5.DAQ.quan.comdemo.service.SalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/salary")
public class SalaryController {

    @Autowired
    private SalaryService salaryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BangLuong>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) Integer thang,
            @RequestParam(required = false) Integer nam,
            @RequestParam(required = false) Integer maNhanVien,
            @RequestParam(required = false, defaultValue = "") String search) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Claims claims) {
            String tenQuyen = claims.get("tenQuyen", String.class);
            if ("NhanVien".equals(tenQuyen)) {
                maNhanVien = claims.get("maNhanVien", Integer.class);
            }
        }

        Page<BangLuong> resultPage = salaryService.getAll(page, limit, thang, nam, maNhanVien, search);

        Map<String, Object> pagination = new HashMap<>();
        pagination.put("page", page);
        pagination.put("limit", limit);
        pagination.put("total", resultPage.getTotalElements());
        pagination.put("totalPages", resultPage.getTotalPages());

        return ResponseEntity.ok(ApiResponse.ok(resultPage.getContent(), pagination));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOne(@PathVariable Integer id) {
        BangLuong bl = salaryService.getOne(id);
        if (bl == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Không tìm thấy bảng lương"));
        }
        List<ChiTietBangLuong> details = salaryService.getDetails(id);

        Map<String, Object> res = new HashMap<>();
        res.put("maBangLuong", bl.getMaBangLuong());
        res.put("nhanVien", bl.getNhanVien());
        res.put("thang", bl.getThang());
        res.put("nam", bl.getNam());
        res.put("tongThuNhap", bl.getTongThuNhap());
        res.put("tongKhauTru", bl.getTongKhauTru());
        res.put("luongThucNhan", bl.getLuongThucNhan());
        res.put("ngayLap", bl.getNgayLap());
        res.put("trangThai", bl.getTrangThai());
        res.put("chiTiet", details);

        return ResponseEntity.ok(ApiResponse.ok(res));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BangLuong>> create(@RequestBody Map<String, Object> body) {
        try {
            BangLuong created = salaryService.create(body);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Tạo bảng lương thành công", created));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi tạo bảng lương: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/finalize")
    public ResponseEntity<ApiResponse<BangLuong>> finalizeSalary(@PathVariable Integer id) {
        try {
            BangLuong finalized = salaryService.finalizeSalary(id);
            return ResponseEntity.ok(ApiResponse.ok("Chốt bảng lương thành công", finalized));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi chốt bảng lương: " + e.getMessage()));
        }
    }

    @PutMapping("/finalize-all")
    public ResponseEntity<ApiResponse<String>> finalizeAll(
            @RequestParam(required = false) Integer thang,
            @RequestParam(required = false) Integer nam) {
        try {
            int count = salaryService.finalizeAllSalary(thang, nam);
            return ResponseEntity.ok(ApiResponse.ok("Đã chốt bảng lương cho " + count + " nhân viên!", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi chốt bảng lương: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Integer id) {
        try {
            salaryService.delete(id);
            return ResponseEntity.ok(ApiResponse.ok("Xóa bảng lương thành công", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi xóa bảng lương: " + e.getMessage()));
        }
    }

    @PostMapping("/sync")
    public ResponseEntity<ApiResponse<List<BangLuong>>> syncSalary(
            @RequestParam(required = false) Integer thang,
            @RequestParam(required = false) Integer nam) {
        try {
            List<BangLuong> synced = salaryService.syncSalaryFromAttendance(thang, nam);
            return ResponseEntity.ok(ApiResponse.ok("Đã cập nhật bảng lương theo bảng chấm công thành công!", synced));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi tính lương từ chấm công: " + e.getMessage()));
        }
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel(
            @RequestParam(required = false) Integer thang,
            @RequestParam(required = false) Integer nam) {
        try {
            byte[] bytes = salaryService.exportExcel(thang, nam);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", "BangLuong_T" + thang + "_" + nam + ".xlsx");
            return new ResponseEntity<>(bytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
