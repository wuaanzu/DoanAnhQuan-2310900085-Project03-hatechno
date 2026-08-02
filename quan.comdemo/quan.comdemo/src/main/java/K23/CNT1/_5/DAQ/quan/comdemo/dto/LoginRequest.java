package K23.CNT1._5.DAQ.quan.comdemo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    private String identifier;
    private String tenDangNhap;
    private String password;
    private String matKhau;
    private Boolean rememberMe;

    public String getEffectiveIdentifier() {
        if (identifier != null && !identifier.trim().isEmpty()) return identifier.trim();
        if (tenDangNhap != null && !tenDangNhap.trim().isEmpty()) return tenDangNhap.trim();
        return null;
    }

    public String getEffectivePassword() {
        if (password != null && !password.trim().isEmpty()) return password.trim();
        if (matKhau != null && !matKhau.trim().isEmpty()) return matKhau.trim();
        return null;
    }
}
