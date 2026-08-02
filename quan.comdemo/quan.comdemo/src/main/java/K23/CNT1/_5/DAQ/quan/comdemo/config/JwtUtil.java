package K23.CNT1._5.DAQ.quan.comdemo.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    @Value("${jwt.remember-expiration}")
    private long rememberExpiration;

    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Integer maTaiKhoan, Integer maNhanVien, String tenDangNhap,
                                Integer maQuyen, String tenQuyen, String hoTen, String avatar,
                                boolean rememberMe) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("maTaiKhoan", maTaiKhoan);
        claims.put("maNhanVien", maNhanVien);
        claims.put("tenDangNhap", tenDangNhap);
        claims.put("maQuyen", maQuyen);
        claims.put("tenQuyen", tenQuyen);
        claims.put("hoTen", hoTen);
        claims.put("avatar", avatar);

        long exp = rememberMe ? rememberExpiration : expiration;

        return Jwts.builder()
                .claims(claims)
                .subject(tenDangNhap)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + exp))
                .signWith(getSigningKey())
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = extractClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}
