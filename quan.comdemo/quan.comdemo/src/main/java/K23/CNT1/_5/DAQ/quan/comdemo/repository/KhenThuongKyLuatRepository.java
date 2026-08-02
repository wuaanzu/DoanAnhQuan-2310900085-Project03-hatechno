package K23.CNT1._5.DAQ.quan.comdemo.repository;

import K23.CNT1._5.DAQ.quan.comdemo.entity.KhenThuongKyLuat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface KhenThuongKyLuatRepository extends JpaRepository<KhenThuongKyLuat, Integer> {

    @Query("SELECT ktkl FROM KhenThuongKyLuat ktkl WHERE " +
           "(:maNhanVien IS NULL OR ktkl.nhanVien.maNhanVien = :maNhanVien) AND " +
           "(:loai IS NULL OR :loai = '' OR ktkl.loai = :loai) AND " +
           "(:search IS NULL OR :search = '' OR LOWER(ktkl.nhanVien.hoTen) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(ktkl.nhanVien.maNV) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<KhenThuongKyLuat> filterRewards(@Param("maNhanVien") Integer maNhanVien,
                                         @Param("loai") String loai,
                                         @Param("search") String search,
                                         Pageable pageable);

    @Query(value = "SELECT COALESCE(SUM(SoTien), 0) FROM KhenThuongKyLuat WHERE Loai = 'Thuong' AND MONTH(Ngay) = MONTH(CURRENT_DATE()) AND YEAR(Ngay) = YEAR(CURRENT_DATE())", nativeQuery = true)
    BigDecimal totalBonusThisMonth();

    @Query(value = "SELECT COALESCE(SUM(SoTien), 0) FROM KhenThuongKyLuat WHERE Loai = 'KyLuat' AND MONTH(Ngay) = MONTH(CURRENT_DATE()) AND YEAR(Ngay) = YEAR(CURRENT_DATE())", nativeQuery = true)
    BigDecimal totalDeductionThisMonth();
}
