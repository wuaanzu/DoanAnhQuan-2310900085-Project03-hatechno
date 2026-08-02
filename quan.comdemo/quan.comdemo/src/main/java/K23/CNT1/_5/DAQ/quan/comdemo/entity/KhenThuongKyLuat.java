package K23.CNT1._5.DAQ.quan.comdemo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "KhenThuongKyLuat")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KhenThuongKyLuat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaKTKL")
    @JsonProperty("MaKTKL")
    private Integer maKTKL;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "MaNhanVien", nullable = false)
    @JsonIgnore
    private NhanVien nhanVien;

    @Column(name = "Loai", length = 20)
    @JsonProperty("Loai")
    private String loai;

    @Column(name = "SoTien", precision = 15, scale = 2)
    @JsonProperty("SoTien")
    private BigDecimal soTien;

    @Column(name = "LyDo", columnDefinition = "TEXT")
    @JsonProperty("LyDo")
    private String lyDo;

    @Column(name = "Ngay")
    @JsonProperty("Ngay")
    private LocalDate ngay;

    @JsonProperty("MaNhanVien")
    public Integer getMaNhanVien() {
        return nhanVien != null ? nhanVien.getMaNhanVien() : null;
    }

    @JsonProperty("HoTen")
    public String getHoTen() {
        return nhanVien != null ? nhanVien.getHoTen() : null;
    }

    @JsonProperty("TenPhongBan")
    public String getTenPhongBan() {
        return nhanVien != null && nhanVien.getPhongBan() != null ? nhanVien.getPhongBan().getTenPhongBan() : null;
    }

    @JsonProperty("Avatar")
    public String getAvatar() {
        return nhanVien != null ? nhanVien.getAvatar() : null;
    }
}
