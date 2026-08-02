package K23.CNT1._5.DAQ.quan.comdemo.controller;

import io.jsonwebtoken.Claims;
import K23.CNT1._5.DAQ.quan.comdemo.dto.*;
import K23.CNT1._5.DAQ.quan.comdemo.entity.TaiKhoan;
import K23.CNT1._5.DAQ.quan.comdemo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(
            @ModelAttribute RegisterRequest request,
            @RequestParam(value = "avatar", required = false) MultipartFile avatarFile) {
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

            String msg = authService.register(request, avatarPath);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(msg, null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Lỗi máy chủ: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        return ResponseEntity.ok(ApiResponse.ok("Đăng xuất thành công", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Object>> getMe() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof Claims claims)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Chưa đăng nhập"));
        }

        Integer maTaiKhoan = claims.get("maTaiKhoan", Integer.class);
        TaiKhoan tk = authService.findById(maTaiKhoan);
        if (tk == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Không tìm thấy tài khoản"));
        }

        Map<String, Object> safeUser = new HashMap<>();
        safeUser.put("maTaiKhoan", tk.getMaTaiKhoan());
        safeUser.put("tenDangNhap", tk.getTenDangNhap());
        safeUser.put("trangThai", tk.getTrangThai());
        if (tk.getNhanVien() != null) {
            safeUser.put("maNhanVien", tk.getNhanVien().getMaNhanVien());
            safeUser.put("hoTen", tk.getNhanVien().getHoTen());
            safeUser.put("email", tk.getNhanVien().getEmail());
            safeUser.put("avatar", tk.getNhanVien().getAvatar());
        }
        if (tk.getQuyen() != null) {
            safeUser.put("maQuyen", tk.getQuyen().getMaQuyen());
            safeUser.put("tenQuyen", tk.getQuyen().getTenQuyen());
        }

        return ResponseEntity.ok(ApiResponse.ok(safeUser));
    }
}
