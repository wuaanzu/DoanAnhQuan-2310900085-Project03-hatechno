package K23.CNT1._5.DAQ.quan.comdemo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Quyen")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quyen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaQuyen")
    private Integer maQuyen;

    @Column(name = "TenQuyen", nullable = false, length = 50)
    private String tenQuyen;

    @Column(name = "MoTa", length = 255)
    private String moTa;
}
