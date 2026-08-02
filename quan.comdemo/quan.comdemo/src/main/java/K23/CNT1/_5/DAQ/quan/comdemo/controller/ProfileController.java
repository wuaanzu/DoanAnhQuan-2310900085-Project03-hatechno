package K23.CNT1._5.DAQ.quan.comdemo.controller;

import io.jsonwebtoken.Claims;
import K23.CNT1._5.DAQ.quan.comdemo.dto.ApiResponse;
import K23.CNT1._5.DAQ.quan.comdemo.dto.PasswordChangeRequest;
import K23.CNT1._5.DAQ.quan.comdemo.entity.BangLuong;
import K23.CNT1._5.DAQ.quan.comdemo.entity.ChamCong;
import K23.CNT1._5.DAQ.quan.comdemo.entity.NhanVien;
import K23.CNT1._5.DAQ.quan.comdemo.entity.TaiKhoan;
import K23.CNT1._5.DAQ.quan.comdemo.repository.TaiKhoanRepository;
import K23.CNT1._5.DAQ.quan.comdemo.service.AttendanceService;
import K23.CNT1._5.DAQ.quan.comdemo.service.EmployeeService;
import K23.CNT1._5.DAQ.quan.comdemo.service.SalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private TaiKhoanRepository taiKhoanRepository;

    @Autowired
    private SalaryService salaryService;

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<ApiResponse<NhanVien>> getProfile() {
        Claims claims = getClaims();
        if (claims == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Chưa xác thực"));

        Integer maNhanVien = claims.get("maNhanVien", Integer.class);
        NhanVien nv = employeeService.getOne(maNhanVien);
        if (nv == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Không tìm thấy thông tin nhân viên"));
        }
        return ResponseEntity.ok(ApiResponse.ok(nv));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<NhanVien>> updateProfile(
            @RequestParam Map<String, Object> body,
            @RequestParam(value = "avatar", required = false) MultipartFile avatarFile) {
        Claims claims = getClaims();
        if (claims == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Chưa xác thực"));

        Integer maNhanVien = claims.get("maNhanVien", Integer.class);
        try {
            String avatarPath = null;
            if (avatarFile != null && !avatarFile.isEmpty()) {
                String fileName = UUID.randomUUID().toString() + "_" + avatarFile.getOriginalFilename();
                File uploadDir = new File("uploads/avatars");
                if (!uploadDir.exists()) uploadDir.mkdirs();
                File dest = new File(uploadDir, fileName);
                avatarFile.transferTo(dest);
                avatarPath = "/uploads/avatars/" + fileName;
            }

            NhanVien updated = employeeService.update(maNhanVien, body, avatarPath);
            return ResponseEntity.ok(ApiResponse.ok("Cập nhật trang cá nhân thành công", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi cập nhật: " + e.getMessage()));
        }
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<String>> changePassword(@RequestBody PasswordChangeRequest req) {
        Claims claims = getClaims();
        if (claims == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Chưa xác thực"));

        Integer maTaiKhoan = claims.get("maTaiKhoan", Integer.class);
        TaiKhoan tk = taiKhoanRepository.findById(maTaiKhoan).orElse(null);
        if (tk == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Không tìm thấy tài khoản"));

        if (req.getCurrentPassword() == null || req.getNewPassword() == null || req.getConfirmPassword() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Vui lòng điền đầy đủ thông tin"));
        }

        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Mật khẩu mới không khớp"));
        }

        if (req.getNewPassword().length() < 6) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Mật khẩu phải có ít nhất 6 ký tự"));
        }

        boolean isMatch = passwordEncoder.matches(req.getCurrentPassword(), tk.getMatKhau()) ||
                          req.getCurrentPassword().equals(tk.getMatKhau());
        if (!isMatch) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Mật khẩu hiện tại không đúng"));
        }

        tk.setMatKhau(passwordEncoder.encode(req.getNewPassword()));
        taiKhoanRepository.save(tk);

        return ResponseEntity.ok(ApiResponse.ok("Đổi mật khẩu thành công", null));
    }

    @GetMapping("/salary")
    public ResponseEntity<ApiResponse<List<BangLuong>>> getMySalary(@RequestParam(required = false) Integer maNhanVien) {
        Claims claims = getClaims();
        if (claims == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Chưa xác thực"));

        String tenQuyen = claims.get("tenQuyen", String.class);
        if (!"Admin".equals(tenQuyen) && !"NhanSu".equals(tenQuyen) || maNhanVien == null) {
            maNhanVien = claims.get("maNhanVien", Integer.class);
        }

        return ResponseEntity.ok(ApiResponse.ok(salaryService.getByEmployee(maNhanVien)));
    }

    @GetMapping("/attendance")
    public ResponseEntity<ApiResponse<List<ChamCong>>> getMyAttendance(
            @RequestParam(required = false) Integer thang,
            @RequestParam(required = false) Integer nam) {
        Claims claims = getClaims();
        if (claims == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Chưa xác thực"));

        Integer maNhanVien = claims.get("maNhanVien", Integer.class);
        if (thang == null) thang = LocalDate.now().getMonthValue();
        if (nam == null) nam = LocalDate.now().getYear();

        return ResponseEntity.ok(ApiResponse.ok(attendanceService.getByEmployeeMonth(maNhanVien, thang, nam)));
    }

    private Claims getClaims() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Claims claims) {
            return claims;
        }
        return null;
    }
}
