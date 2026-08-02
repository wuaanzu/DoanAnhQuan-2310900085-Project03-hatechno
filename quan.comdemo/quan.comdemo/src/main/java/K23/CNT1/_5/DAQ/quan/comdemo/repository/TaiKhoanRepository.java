package K23.CNT1._5.DAQ.quan.comdemo.repository;

import K23.CNT1._5.DAQ.quan.comdemo.entity.TaiKhoan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, Integer> {

    Optional<TaiKhoan> findByTenDangNhap(String tenDangNhap);
    boolean existsByTenDangNhap(String tenDangNhap);

    @Query("SELECT tk FROM TaiKhoan tk WHERE tk.nhanVien.email = :email")
    Optional<TaiKhoan> findByNhanVienEmail(@Param("email") String email);

    @Query("SELECT tk FROM TaiKhoan tk WHERE tk.nhanVien.maNhanVien = :maNhanVien")
    Optional<TaiKhoan> findByMaNhanVien(@Param("maNhanVien") Integer maNhanVien);
}
