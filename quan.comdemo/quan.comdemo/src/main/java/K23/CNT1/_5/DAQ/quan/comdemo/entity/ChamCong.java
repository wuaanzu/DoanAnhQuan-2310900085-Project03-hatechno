package K23.CNT1._5.DAQ.quan.comdemo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "ChamCong")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChamCong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaChamCong")
    @JsonProperty("MaChamCong")
    private Integer maChamCong;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "MaNhanVien", nullable = false)
    @JsonIgnore
    private NhanVien nhanVien;

    @Column(name = "NgayLam", nullable = false)
    @JsonProperty("NgayLam")
    private LocalDate ngayLam;

    @Column(name = "GioVao")
    @JsonProperty("GioVao")
    private LocalTime gioVao;

    @Column(name = "GioRa")
    @JsonProperty("GioRa")
    private LocalTime gioRa;

    @Column(name = "SoGioLam", precision = 4, scale = 2)
    @JsonProperty("SoGioLam")
    private BigDecimal soGioLam;

    @Column(name = "TangCa", precision = 4, scale = 2)
    @JsonProperty("TangCa")
    private BigDecimal tangCa;

    @Column(name = "TrangThai", length = 30)
    @JsonProperty("TrangThai")
    private String trangThai;

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
