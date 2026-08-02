package K23.CNT1._5.DAQ.quan.comdemo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "NhanVien")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NhanVien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaNhanVien")
    @JsonProperty("MaNhanVien")
    private Integer maNhanVien;

    @Column(name = "MaNV", unique = true, nullable = false, length = 20)
    @JsonProperty("MaNV")
    private String maNV;

    @Column(name = "HoTen", nullable = false, length = 150)
    @JsonProperty("HoTen")
    private String hoTen;

    @Column(name = "GioiTinh", length = 10)
    @JsonProperty("GioiTinh")
    private String gioiTinh;

    @Column(name = "NgaySinh")
    @JsonProperty("NgaySinh")
    private LocalDate ngaySinh;

    @Column(name = "DienThoai", length = 20)
    @JsonProperty("DienThoai")
    private String dienThoai;

    @Column(name = "Email", length = 100)
    @JsonProperty("Email")
    private String email;

    @Column(name = "CCCD", length = 20)
    @JsonProperty("CCCD")
    private String cccd;

    @Column(name = "DiaChi", length = 255)
    @JsonProperty("DiaChi")
    private String diaChi;

    @Column(name = "NgayVaoLam")
    @JsonProperty("NgayVaoLam")
    private LocalDate ngayVaoLam;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "MaPhongBan")
    @JsonIgnore
    private PhongBan phongBan;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "MaChucVu")
    @JsonIgnore
    private ChucVu chucVu;

    @Column(name = "TrangThai", length = 20)
    @JsonProperty("TrangThai")
    private String trangThai;

    @Column(name = "Avatar", length = 255)
    @JsonProperty("Avatar")
    private String avatar;

    @JsonProperty("MaPhongBan")
    public Integer getMaPhongBan() {
        return phongBan != null ? phongBan.getMaPhongBan() : null;
    }

    @JsonProperty("TenPhongBan")
    public String getTenPhongBan() {
        return phongBan != null ? phongBan.getTenPhongBan() : null;
    }

    @JsonProperty("MaChucVu")
    public Integer getMaChucVu() {
        return chucVu != null ? chucVu.getMaChucVu() : null;
    }

    @JsonProperty("TenChucVu")
    public String getTenChucVu() {
        return chucVu != null ? chucVu.getTenChucVu() : null;
    }
}
