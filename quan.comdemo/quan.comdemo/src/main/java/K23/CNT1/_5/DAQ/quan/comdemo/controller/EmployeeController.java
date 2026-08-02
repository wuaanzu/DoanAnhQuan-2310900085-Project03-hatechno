package K23.CNT1._5.DAQ.quan.comdemo.controller;

import K23.CNT1._5.DAQ.quan.comdemo.dto.ApiResponse;
import K23.CNT1._5.DAQ.quan.comdemo.entity.NhanVien;
import K23.CNT1._5.DAQ.quan.comdemo.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NhanVien>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false) Integer maPhongBan,
            @RequestParam(required = false) Integer maChucVu,
            @RequestParam(required = false, defaultValue = "") String trangThai,
            @RequestParam(defaultValue = "MaNhanVien") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir) {

        Page<NhanVien> resultPage = employeeService.getAll(page, limit, search, maPhongBan, maChucVu, trangThai, sortBy, sortDir);

        Map<String, Object> pagination = new HashMap<>();
        pagination.put("page", page);
        pagination.put("limit", limit);
        pagination.put("total", resultPage.getTotalElements());
        pagination.put("totalPages", resultPage.getTotalPages());

        return ResponseEntity.ok(ApiResponse.ok(resultPage.getContent(), pagination));
    }

    @GetMapping("/simple")
    public ResponseEntity<ApiResponse<List<NhanVien>>> getSimple() {
        return ResponseEntity.ok(ApiResponse.ok(employeeService.getAllSimple()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NhanVien>> getOne(@PathVariable Integer id) {
        NhanVien nv = employeeService.getOne(id);
        if (nv == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Không tìm thấy nhân viên"));
        }
        return ResponseEntity.ok(ApiResponse.ok(nv));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NhanVien>> create(
            @RequestParam Map<String, Object> params,
            @RequestParam(value = "avatar", required = false) MultipartFile avatarFile) {
        try {
            String avatarPath = handleUpload(avatarFile);
            NhanVien created = employeeService.create(params, avatarPath);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Thêm nhân viên thành công", created));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi thêm nhân viên: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NhanVien>> update(
            @PathVariable Integer id,
            @RequestParam Map<String, Object> params,
            @RequestParam(value = "avatar", required = false) MultipartFile avatarFile) {
        try {
            String avatarPath = handleUpload(avatarFile);
            NhanVien updated = employeeService.update(id, params, avatarPath);
            return ResponseEntity.ok(ApiResponse.ok("Cập nhật nhân viên thành công", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi cập nhật nhân viên: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Integer id) {
        try {
            employeeService.delete(id);
            return ResponseEntity.ok(ApiResponse.ok("Xóa nhân viên thành công", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi xóa nhân viên: " + e.getMessage()));
        }
    }

    private String handleUpload(MultipartFile avatarFile) throws Exception {
        if (avatarFile != null && !avatarFile.isEmpty()) {
            String fileName = UUID.randomUUID().toString() + "_" + avatarFile.getOriginalFilename();
            File uploadDir = new File("uploads/avatars");
            if (!uploadDir.exists()) uploadDir.mkdirs();
            File dest = new File(uploadDir, fileName);
            avatarFile.transferTo(dest);
            return "/uploads/avatars/" + fileName;
        }
        return null;
    }
}
