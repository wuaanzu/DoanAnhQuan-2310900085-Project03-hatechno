package K23.CNT1._5.DAQ.quan.comdemo.repository;

import K23.CNT1._5.DAQ.quan.comdemo.entity.DonNghiPhep;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface DonNghiPhepRepository extends JpaRepository<DonNghiPhep, Integer> {

    long countByTrangThai(String trangThai);

    @Query("SELECT dnp FROM DonNghiPhep dnp WHERE " +
           "(:maNhanVien IS NULL OR dnp.nhanVien.maNhanVien = :maNhanVien) AND " +
           "(:trangThai IS NULL OR :trangThai = '' OR dnp.trangThai = :trangThai) AND " +
           "(:search IS NULL OR :search = '' OR LOWER(dnp.nhanVien.hoTen) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(dnp.nhanVien.maNV) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<DonNghiPhep> filterLeaves(@Param("maNhanVien") Integer maNhanVien,
                                  @Param("trangThai") String trangThai,
                                  @Param("search") String search,
                                  Pageable pageable);

    @Query(value = "SELECT 'Nghỉ phép' as loai, nv.HoTen as hoTen, dnp.TrangThai as trangThai, dnp.NgayBatDau as ngay " +
                   "FROM DonNghiPhep dnp LEFT JOIN NhanVien nv ON dnp.MaNhanVien = nv.MaNhanVien " +
                   "ORDER BY dnp.MaDon DESC LIMIT 5", nativeQuery = true)
    List<Map<String, Object>> findRecentActivity();
}
