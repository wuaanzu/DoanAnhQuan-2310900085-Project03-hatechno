package K23.CNT1._5.DAQ.quan.comdemo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private boolean success;
    private String message;
    private String token;
    private UserInfo user;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserInfo {
        private Integer maTaiKhoan;
        private Integer maNhanVien;
        private String tenDangNhap;
        private String hoTen;
        private String email;
        private Integer maQuyen;
        private String tenQuyen;
        private String avatar;
    }
}
