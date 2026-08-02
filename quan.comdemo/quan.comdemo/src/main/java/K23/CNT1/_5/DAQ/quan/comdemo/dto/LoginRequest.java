package K23.CNT1._5.DAQ.quan.comdemo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    private String identifier;
    private String password;
    private Boolean rememberMe;
}
