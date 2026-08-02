package K23.CNT1._5.DAQ.quan.comdemo.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "ChucVu")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChucVu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaChucVu")
    @JsonProperty("MaChucVu")
    private Integer maChucVu;

    @Column(name = "TenChucVu", nullable = false, length = 100)
    @JsonProperty("TenChucVu")
    private String tenChucVu;

    @Column(name = "PhuCap", precision = 15, scale = 2)
    @JsonProperty("PhuCap")
    private BigDecimal phuCap;

    @Column(name = "MoTa", length = 255)
    @JsonProperty("MoTa")
    private String moTa;

    @Transient
    @JsonProperty("SoNhanVien")
    private Long soNhanVien;
}
