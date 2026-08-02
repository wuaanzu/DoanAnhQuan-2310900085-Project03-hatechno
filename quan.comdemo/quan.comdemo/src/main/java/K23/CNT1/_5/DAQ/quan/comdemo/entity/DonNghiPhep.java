package K23.CNT1._5.DAQ.quan.comdemo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "DonNghiPhep")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonNghiPhep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaDon")
    @JsonProperty("MaDon")
    private Integer maDon;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "MaNhanVien", nullable = false)
    @JsonIgnore
    private NhanVien nhanVien;

    @Column(name = "NgayBatDau")
    @JsonProperty("NgayBatDau")
    private LocalDate ngayBatDau;

    @Column(name = "NgayKetThuc")
    @JsonProperty("NgayKetThuc")
    private LocalDate ngayKetThuc;

    @Column(name = "LyDo", columnDefinition = "TEXT")
    @JsonProperty("LyDo")
    private String lyDo;

    @Column(name = "TrangThai", length = 20)
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

    @JsonProperty("SoNgay")
    public Long getSoNgay() {
        if (ngayBatDau != null && ngayKetThuc != null) {
            return ChronoUnit.DAYS.between(ngayBatDau, ngayKetThuc) + 1;
        }
        return 1L;
    }
}
