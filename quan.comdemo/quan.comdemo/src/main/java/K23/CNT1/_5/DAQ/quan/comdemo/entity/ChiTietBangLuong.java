package K23.CNT1._5.DAQ.quan.comdemo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "ChiTietBangLuong")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChiTietBangLuong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaChiTiet")
    private Integer maChiTiet;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "MaBangLuong", nullable = false)
    private BangLuong bangLuong;

    @Column(name = "LoaiKhoan", nullable = false, length = 100)
    private String loaiKhoan;

    @Column(name = "SoTien", nullable = false, precision = 15, scale = 2)
    private BigDecimal soTien;

    @Column(name = "GhiChu", length = 255)
    private String ghiChu;
}
