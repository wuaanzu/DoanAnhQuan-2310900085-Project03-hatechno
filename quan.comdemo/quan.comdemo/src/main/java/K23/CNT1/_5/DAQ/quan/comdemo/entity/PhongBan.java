package K23.CNT1._5.DAQ.quan.comdemo.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "PhongBan")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhongBan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaPhongBan")
    @JsonProperty("MaPhongBan")
    private Integer maPhongBan;

    @Column(name = "TenPhongBan", nullable = false, length = 100)
    @JsonProperty("TenPhongBan")
    private String tenPhongBan;

    @Column(name = "TruongPhong")
    @JsonProperty("TruongPhong")
    private Integer truongPhong;

    @Column(name = "MoTa", length = 255)
    @JsonProperty("MoTa")
    private String moTa;

    @Transient
    @JsonProperty("TenTruongPhong")
    private String tenTruongPhong;

    @Transient
    @JsonProperty("SoNhanVien")
    private Long soNhanVien;
}
