package K23.CNT1._5.DAQ.quan.comdemo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String hoTen;
    private String tenDangNhap;
    private String email;
    private String password;
    private String confirmPassword;
    private String dienThoai;
    private Integer maChucVu;
    private Integer maPhongBan;
}
