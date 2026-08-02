package K23.CNT1._5.DAQ.quan.comdemo.config;

import K23.CNT1._5.DAQ.quan.comdemo.entity.*;
import K23.CNT1._5.DAQ.quan.comdemo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private QuyenRepository quyenRepository;

    @Autowired
    private PhongBanRepository phongBanRepository;

    @Autowired
    private ChucVuRepository chucVuRepository;

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private TaiKhoanRepository taiKhoanRepository;

    @Autowired
    private ChamCongRepository chamCongRepository;

    @Autowired
    private BangLuongRepository bangLuongRepository;

    @Autowired
    private DonNghiPhepRepository donNghiPhepRepository;

    @Autowired
    private KhenThuongKyLuatRepository khenThuongKyLuatRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Quyen
        if (quyenRepository.count() == 0) {
            quyenRepository.save(Quyen.builder().maQuyen(1).tenQuyen("Admin").moTa("Quản trị hệ thống").build());
            quyenRepository.save(Quyen.builder().maQuyen(2).tenQuyen("QuanLy").moTa("Quản lý phòng ban").build());
            quyenRepository.save(Quyen.builder().maQuyen(3).tenQuyen("NhanVien").moTa("Nhân viên").build());
        }

        // Seed PhongBan
        if (phongBanRepository.count() == 0) {
            phongBanRepository.save(PhongBan.builder().tenPhongBan("Phòng Công Nghệ Thông Tin").moTa("Phát triển phần mềm & hạ tầng").build());
            phongBanRepository.save(PhongBan.builder().tenPhongBan("Phòng Nhân Sự").moTa("Quản lý nhân sự & tuyển dụng").build());
            phongBanRepository.save(PhongBan.builder().tenPhongBan("Phòng Kế Toán").moTa("Quản lý tài chính & bảng lương").build());
            phongBanRepository.save(PhongBan.builder().tenPhongBan("Phòng Kinh Doanh").moTa("Phát triển thị trường & bán hàng").build());
        }

        // Seed ChucVu
        if (chucVuRepository.count() == 0) {
            chucVuRepository.save(ChucVu.builder().tenChucVu("Trưởng Phòng").phuCap(new BigDecimal("3000000")).build());
            chucVuRepository.save(ChucVu.builder().tenChucVu("Phó Phòng").phuCap(new BigDecimal("1500000")).build());
            chucVuRepository.save(ChucVu.builder().tenChucVu("Nhân Viên").phuCap(new BigDecimal("500000")).build());
        }

        // Seed NhanVien & TaiKhoan if empty
        if (nhanVienRepository.count() == 0) {
            PhongBan pbCntt = phongBanRepository.findAll().stream().filter(p -> p.getTenPhongBan().contains("Công Nghệ")).findFirst().orElse(null);
            PhongBan pbNs = phongBanRepository.findAll().stream().filter(p -> p.getTenPhongBan().contains("Nhân Sự")).findFirst().orElse(null);
            PhongBan pbKt = phongBanRepository.findAll().stream().filter(p -> p.getTenPhongBan().contains("Kế Toán")).findFirst().orElse(null);

            ChucVu cvTp = chucVuRepository.findAll().stream().filter(c -> c.getTenChucVu().contains("Trưởng")).findFirst().orElse(null);
            ChucVu cvNv = chucVuRepository.findAll().stream().filter(c -> c.getTenChucVu().contains("Nhân Viên")).findFirst().orElse(null);

            Quyen qAdmin = quyenRepository.findById(1).orElse(null);
            Quyen qNv = quyenRepository.findById(3).orElse(null);

            // 1. Admin NV
            NhanVien nv1 = NhanVien.builder()
                    .maNV("NV001")
                    .hoTen("Nguyễn Văn An")
                    .gioiTinh("Nam")
                    .ngaySinh(LocalDate.of(1990, 5, 15))
                    .dienThoai("0912345678")
                    .email("admin@hatechno.com")
                    .cccd("001090000001")
                    .diaChi("Hà Nội")
                    .ngayVaoLam(LocalDate.of(2022, 1, 1))
                    .phongBan(pbCntt)
                    .chucVu(cvTp)
                    .trangThai("DangLam")
                    .build();
            nv1 = nhanVienRepository.save(nv1);

            TaiKhoan tk1 = TaiKhoan.builder()
                    .tenDangNhap("admin")
                    .matKhau(passwordEncoder.encode("123456"))
                    .nhanVien(nv1)
                    .quyen(qAdmin)
                    .trangThai(true)
                    .build();
            taiKhoanRepository.save(tk1);

            // 2. NV 2
            NhanVien nv2 = NhanVien.builder()
                    .maNV("NV002")
                    .hoTen("Trần Thị Bình")
                    .gioiTinh("Nữ")
                    .ngaySinh(LocalDate.of(1995, 8, 20))
                    .dienThoai("0987654321")
                    .email("binhtt@hatechno.com")
                    .cccd("001095000002")
                    .diaChi("Hà Nội")
                    .ngayVaoLam(LocalDate.of(2023, 3, 15))
                    .phongBan(pbNs)
                    .chucVu(cvNv)
                    .trangThai("DangLam")
                    .build();
            nv2 = nhanVienRepository.save(nv2);

            TaiKhoan tk2 = TaiKhoan.builder()
                    .tenDangNhap("nhanvien")
                    .matKhau(passwordEncoder.encode("123456"))
                    .nhanVien(nv2)
                    .quyen(qNv)
                    .trangThai(true)
                    .build();
            taiKhoanRepository.save(tk2);

            // 3. NV 3
            NhanVien nv3 = NhanVien.builder()
                    .maNV("NV003")
                    .hoTen("Lê Hoàng Cường")
                    .gioiTinh("Nam")
                    .ngaySinh(LocalDate.of(1992, 11, 10))
                    .dienThoai("0933445566")
                    .email("cuonglh@hatechno.com")
                    .cccd("001092000003")
                    .diaChi("Hải Phòng")
                    .ngayVaoLam(LocalDate.of(2023, 6, 1))
                    .phongBan(pbKt)
                    .chucVu(cvNv)
                    .trangThai("DangLam")
                    .build();
            nv3 = nhanVienRepository.save(nv3);

            // Seed ChamCong
            LocalDate today = LocalDate.now();
            chamCongRepository.save(ChamCong.builder().nhanVien(nv1).ngayLam(today).gioVao(LocalTime.of(8, 0)).gioRa(LocalTime.of(17, 0)).soGioLam(new BigDecimal("8.0")).trangThai("DungGio").build());
            chamCongRepository.save(ChamCong.builder().nhanVien(nv2).ngayLam(today).gioVao(LocalTime.of(8, 5)).gioRa(LocalTime.of(17, 0)).soGioLam(new BigDecimal("8.0")).trangThai("DungGio").build());
            chamCongRepository.save(ChamCong.builder().nhanVien(nv3).ngayLam(today).gioVao(LocalTime.of(8, 0)).gioRa(LocalTime.of(17, 0)).soGioLam(new BigDecimal("8.0")).trangThai("DungGio").build());

            // Seed BangLuong
            int currMonth = today.getMonthValue();
            int currYear = today.getYear();
            bangLuongRepository.save(BangLuong.builder().nhanVien(nv1).thang(currMonth).nam(currYear).tongThuNhap(new BigDecimal("25000000")).tongKhauTru(new BigDecimal("2000000")).luongThucNhan(new BigDecimal("23000000")).ngayLap(today).trangThai("DaChot").build());
            bangLuongRepository.save(BangLuong.builder().nhanVien(nv2).thang(currMonth).nam(currYear).tongThuNhap(new BigDecimal("12000000")).tongKhauTru(new BigDecimal("1000000")).luongThucNhan(new BigDecimal("11000000")).ngayLap(today).trangThai("ChuaChot").build());
            bangLuongRepository.save(BangLuong.builder().nhanVien(nv3).thang(currMonth).nam(currYear).tongThuNhap(new BigDecimal("15000000")).tongKhauTru(new BigDecimal("1000000")).luongThucNhan(new BigDecimal("14000000")).ngayLap(today).trangThai("ChuaChot").build());

            // Seed DonNghiPhep
            donNghiPhepRepository.save(DonNghiPhep.builder().nhanVien(nv2).ngayBatDau(today).ngayKetThuc(today.plusDays(1)).lyDo("Nghỉ phép năm: Nghỉ việc riêng gia đình").trangThai("ChoDuyet").build());

            // Seed KhenThuongKyLuat
            khenThuongKyLuatRepository.save(KhenThuongKyLuat.builder().nhanVien(nv1).loai("KhenThuong").soTien(new BigDecimal("2000000")).lyDo("Hoàn thành xuất sắc nhiệm vụ").ngay(today).build());
        }
    }
}
