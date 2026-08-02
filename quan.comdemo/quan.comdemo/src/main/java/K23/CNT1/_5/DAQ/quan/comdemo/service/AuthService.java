package K23.CNT1._5.DAQ.quan.comdemo.service;

import K23.CNT1._5.DAQ.quan.comdemo.config.JwtUtil;
import K23.CNT1._5.DAQ.quan.comdemo.dto.LoginRequest;
import K23.CNT1._5.DAQ.quan.comdemo.dto.LoginResponse;
import K23.CNT1._5.DAQ.quan.comdemo.dto.RegisterRequest;
import K23.CNT1._5.DAQ.quan.comdemo.entity.ChucVu;
import K23.CNT1._5.DAQ.quan.comdemo.entity.NhanVien;
import K23.CNT1._5.DAQ.quan.comdemo.entity.PhongBan;
import K23.CNT1._5.DAQ.quan.comdemo.entity.Quyen;
import K23.CNT1._5.DAQ.quan.comdemo.entity.TaiKhoan;
import K23.CNT1._5.DAQ.quan.comdemo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private TaiKhoanRepository taiKhoanRepository;

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private QuyenRepository quyenRepository;

    @Autowired
    private PhongBanRepository phongBanRepository;

    @Autowired
    private ChucVuRepository chucVuRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        if (request.getIdentifier() == null || request.getIdentifier().trim().isEmpty() ||
            request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return LoginResponse.builder()
                    .success(false)
                    .message("Vui lòng nhập tên đăng nhập/email và mật khẩu")
                    .build();
        }

        String identifier = request.getIdentifier().trim();
        Optional<TaiKhoan> userOpt = taiKhoanRepository.findByTenDangNhap(identifier);

        if (userOpt.isEmpty()) {
            userOpt = taiKhoanRepository.findByNhanVienEmail(identifier);
        }

        if (userOpt.isEmpty() || (userOpt.get().getTrangThai() != null && !userOpt.get().getTrangThai())) {
            return LoginResponse.builder()
                    .success(false)
                    .message("Tài khoản không tồn tại hoặc đã bị khóa")
                    .build();
        }

        TaiKhoan user = userOpt.get();

        // Check password: BCrypt or Plaintext fallback
        boolean match = passwordEncoder.matches(request.getPassword(), user.getMatKhau()) ||
                        request.getPassword().equals(user.getMatKhau());

        if (!match) {
            return LoginResponse.builder()
                    .success(false)
                    .message("Mật khẩu không chính xác")
                    .build();
        }

        NhanVien nv = user.getNhanVien();
        Quyen q = user.getQuyen();

        boolean remember = request.getRememberMe() != null && request.getRememberMe();

        String token = jwtUtil.generateToken(
                user.getMaTaiKhoan(),
                nv != null ? nv.getMaNhanVien() : null,
                user.getTenDangNhap(),
                q != null ? q.getMaQuyen() : 3,
                q != null ? q.getTenQuyen() : "NhanVien",
                nv != null ? nv.getHoTen() : user.getTenDangNhap(),
                nv != null ? nv.getAvatar() : null,
                remember
        );

        LoginResponse.UserInfo userInfo = LoginResponse.UserInfo.builder()
                .maTaiKhoan(user.getMaTaiKhoan())
                .maNhanVien(nv != null ? nv.getMaNhanVien() : null)
                .tenDangNhap(user.getTenDangNhap())
                .hoTen(nv != null ? nv.getHoTen() : user.getTenDangNhap())
                .email(nv != null ? nv.getEmail() : null)
                .maQuyen(q != null ? q.getMaQuyen() : 3)
                .tenQuyen(q != null ? q.getTenQuyen() : "NhanVien")
                .avatar(nv != null ? nv.getAvatar() : null)
                .build();

        return LoginResponse.builder()
                .success(true)
                .message("Đăng nhập thành công")
                .token(token)
                .user(userInfo)
                .build();
    }

    @Transactional
    public String register(RegisterRequest req, String avatarPath) {
        if (req.getHoTen() == null || req.getTenDangNhap() == null ||
            req.getEmail() == null || req.getPassword() == null) {
            throw new IllegalArgumentException("Vui lòng điền đầy đủ thông tin bắt buộc");
        }

        if (!req.getPassword().equals(req.getConfirmPassword())) {
            throw new IllegalArgumentException("Mật khẩu xác nhận không khớp");
        }

        if (req.getPassword().length() < 6) {
            throw new IllegalArgumentException("Mật khẩu phải có ít nhất 6 ký tự");
        }

        if (taiKhoanRepository.existsByTenDangNhap(req.getTenDangNhap())) {
            throw new IllegalArgumentException("Tên đăng nhập đã được sử dụng");
        }

        // Tự tạo mã nhân viên
        String maxMaNV = nhanVienRepository.findMaxMaNV();
        int nextNum = 1;
        if (maxMaNV != null && maxMaNV.startsWith("NV")) {
            try {
                nextNum = Integer.parseInt(maxMaNV.substring(2)) + 1;
            } catch (Exception ignored) {}
        }
        String maNV = String.format("NV%03d", nextNum);

        PhongBan pb = req.getMaPhongBan() != null ? phongBanRepository.findById(req.getMaPhongBan()).orElse(null) : null;
        ChucVu cv = req.getMaChucVu() != null ? chucVuRepository.findById(req.getMaChucVu()).orElse(null) : chucVuRepository.findById(3).orElse(null);

        NhanVien nv = NhanVien.builder()
                .maNV(maNV)
                .hoTen(req.getHoTen())
                .email(req.getEmail())
                .dienThoai(req.getDienThoai())
                .phongBan(pb)
                .chucVu(cv)
                .ngayVaoLam(LocalDate.now())
                .trangThai("DangLam")
                .avatar(avatarPath)
                .build();

        nv = nhanVienRepository.save(nv);

        Quyen quyenNhanVien = quyenRepository.findById(3).orElseGet(() ->
                quyenRepository.findByTenQuyen("NhanVien").orElse(null)
        );

        TaiKhoan tk = TaiKhoan.builder()
                .tenDangNhap(req.getTenDangNhap())
                .matKhau(passwordEncoder.encode(req.getPassword()))
                .nhanVien(nv)
                .quyen(quyenNhanVien)
                .trangThai(true)
                .build();

        taiKhoanRepository.save(tk);

        return "Đăng ký thành công! Vui lòng đăng nhập.";
    }

    public TaiKhoan findById(Integer maTaiKhoan) {
        return taiKhoanRepository.findById(maTaiKhoan).orElse(null);
    }
}
