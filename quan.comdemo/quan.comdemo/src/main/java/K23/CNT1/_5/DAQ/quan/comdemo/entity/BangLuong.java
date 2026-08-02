package K23.CNT1._5.DAQ.quan.comdemo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "BangLuong")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BangLuong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaBangLuong")
    @JsonProperty("MaBangLuong")
    private Integer maBangLuong;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "MaNhanVien", nullable = false)
    @JsonIgnore
    private NhanVien nhanVien;

    @Column(name = "Thang", nullable = false)
    @JsonProperty("Thang")
    private Integer thang;

    @Column(name = "Nam", nullable = false)
    @JsonProperty("Nam")
    private Integer nam;

    @Column(name = "TongThuNhap", precision = 15, scale = 2)
    @JsonProperty("TongThuNhap")
    private BigDecimal tongThuNhap;

    @Column(name = "TongKhauTru", precision = 15, scale = 2)
    @JsonProperty("TongKhauTru")
    private BigDecimal tongKhauTru;

    @Column(name = "LuongThucNhan", precision = 15, scale = 2)
    @JsonProperty("LuongThucNhan")
    private BigDecimal luongThucNhan;

    @Column(name = "NgayLap")
    @JsonProperty("NgayLap")
    private LocalDate ngayLap;

    @Column(name = "TrangThai", length = 20)
    @JsonProperty("TrangThai")
    private String trangThai;

    @JsonProperty("MaNhanVien")
    public Integer getMaNhanVien() {
        return nhanVien != null ? nhanVien.getMaNhanVien() : null;
    }

    @JsonProperty("MaNV")
    public String getMaNV() {
        return nhanVien != null ? nhanVien.getMaNV() : null;
    }

    @JsonProperty("HoTen")
    public String getHoTen() {
        return nhanVien != null ? nhanVien.getHoTen() : null;
    }

    @JsonProperty("TenPhongBan")
    public String getTenPhongBan() {
        return nhanVien != null && nhanVien.getPhongBan() != null ? nhanVien.getPhongBan().getTenPhongBan() : null;
    }

    @JsonProperty("TenChucVu")
    public String getTenChucVu() {
        return nhanVien != null && nhanVien.getChucVu() != null ? nhanVien.getChucVu().getTenChucVu() : null;
    }

    @JsonProperty("Avatar")
    public String getAvatar() {
        return nhanVien != null ? nhanVien.getAvatar() : null;
    }
}
