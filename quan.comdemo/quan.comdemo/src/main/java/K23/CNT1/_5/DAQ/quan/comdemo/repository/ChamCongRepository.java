package K23.CNT1._5.DAQ.quan.comdemo.repository;

import K23.CNT1._5.DAQ.quan.comdemo.entity.ChamCong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChamCongRepository extends JpaRepository<ChamCong, Integer> {

    @Query("SELECT cc FROM ChamCong cc WHERE " +
           "(:maNhanVien IS NULL OR cc.nhanVien.maNhanVien = :maNhanVien) AND " +
           "(:thang IS NULL OR MONTH(cc.ngayLam) = :thang) AND " +
           "(:nam IS NULL OR YEAR(cc.ngayLam) = :nam) AND " +
           "(:search IS NULL OR :search = '' OR LOWER(cc.nhanVien.hoTen) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(cc.nhanVien.maNV) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<ChamCong> filterAttendance(@Param("maNhanVien") Integer maNhanVien,
                                    @Param("thang") Integer thang,
                                    @Param("nam") Integer nam,
                                    @Param("search") String search,
                                    Pageable pageable);

    @Query("SELECT cc FROM ChamCong cc WHERE cc.nhanVien.maNhanVien = :maNhanVien AND MONTH(cc.ngayLam) = :thang AND YEAR(cc.ngayLam) = :nam ORDER BY cc.ngayLam DESC")
    List<ChamCong> findByEmployeeAndMonthYear(@Param("maNhanVien") Integer maNhanVien,
                                               @Param("thang") Integer thang,
                                               @Param("nam") Integer nam);
}
