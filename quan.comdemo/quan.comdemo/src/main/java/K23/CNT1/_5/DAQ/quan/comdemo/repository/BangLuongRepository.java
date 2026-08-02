package K23.CNT1._5.DAQ.quan.comdemo.repository;

import K23.CNT1._5.DAQ.quan.comdemo.entity.BangLuong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Repository
public interface BangLuongRepository extends JpaRepository<BangLuong, Integer> {

    @Query("SELECT bl FROM BangLuong bl WHERE " +
           "(:maNhanVien IS NULL OR bl.nhanVien.maNhanVien = :maNhanVien) AND " +
           "(:thang IS NULL OR bl.thang = :thang) AND " +
           "(:nam IS NULL OR bl.nam = :nam) AND " +
           "(:search IS NULL OR :search = '' OR LOWER(bl.nhanVien.hoTen) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(bl.nhanVien.maNV) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<BangLuong> filterSalary(@Param("maNhanVien") Integer maNhanVien,
                                 @Param("thang") Integer thang,
                                 @Param("nam") Integer nam,
                                 @Param("search") String search,
                                 Pageable pageable);

    @Query("SELECT bl FROM BangLuong bl WHERE bl.nhanVien.maNhanVien = :maNhanVien ORDER BY bl.nam DESC, bl.thang DESC")
    List<BangLuong> findByNhanVienMaNhanVien(@Param("maNhanVien") Integer maNhanVien);

    BangLuong findByNhanVienMaNhanVienAndThangAndNam(Integer maNhanVien, Integer thang, Integer nam);

    @Query(value = "SELECT SUM(LuongThucNhan) as TongLuong, SUM(TongThuNhap) as TongThuNhap, SUM(TongKhauTru) as TongKhauTru " +
                   "FROM BangLuong WHERE Thang = MONTH(CURRENT_DATE()) AND Nam = YEAR(CURRENT_DATE())", nativeQuery = true)
    Map<String, Object> totalThisMonth();

    @Query(value = "SELECT SUM(LuongThucNhan) as TongLuong, SUM(TongThuNhap) as TongThuNhap, SUM(TongKhauTru) as TongKhauTru " +
                   "FROM BangLuong WHERE (Nam, Thang) = (SELECT Nam, Thang FROM BangLuong ORDER BY Nam DESC, Thang DESC LIMIT 1)", nativeQuery = true)
    Map<String, Object> totalLatestMonth();

    @Query(value = "SELECT Thang as thang, SUM(LuongThucNhan) as tongLuong, SUM(TongThuNhap) as tongThuNhap, SUM(TongKhauTru) as tongKhauTru " +
                   "FROM BangLuong WHERE Nam = :nam GROUP BY Thang ORDER BY Thang ASC", nativeQuery = true)
    List<Map<String, Object>> statsByMonth(@Param("nam") Integer nam);

    @Query(value = "SELECT nv.HoTen as hoTen, nv.MaNV as maNV, pb.TenPhongBan as tenPhongBan, cv.TenChucVu as tenChucVu, " +
                   "bl.LuongThucNhan as luongThucNhan, nv.Avatar as avatar " +
                   "FROM BangLuong bl " +
                   "JOIN NhanVien nv ON bl.MaNhanVien = nv.MaNhanVien " +
                   "LEFT JOIN PhongBan pb ON nv.MaPhongBan = pb.MaPhongBan " +
                   "LEFT JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu " +
                   "WHERE (:thang IS NULL OR bl.Thang = :thang) AND (:nam IS NULL OR bl.Nam = :nam) " +
                   "ORDER BY bl.LuongThucNhan DESC LIMIT 10", nativeQuery = true)
    List<Map<String, Object>> topEmployees(@Param("thang") Integer thang, @Param("nam") Integer nam);

    @Query(value = "SELECT Nam as nam, Thang as thang, SUM(TongThuNhap) as tongThuNhap, SUM(TongKhauTru) as tongKhauTru, " +
                   "SUM(LuongThucNhan) as tongLuong, COUNT(*) as soNhanVien " +
                   "FROM BangLuong GROUP BY Nam, Thang ORDER BY Nam DESC, Thang DESC LIMIT 12", nativeQuery = true)
    List<Map<String, Object>> totalCostReport();
}
