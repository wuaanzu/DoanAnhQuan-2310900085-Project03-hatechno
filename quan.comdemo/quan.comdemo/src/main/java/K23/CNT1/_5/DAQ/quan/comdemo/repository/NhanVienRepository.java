package K23.CNT1._5.DAQ.quan.comdemo.repository;

import K23.CNT1._5.DAQ.quan.comdemo.entity.NhanVien;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, Integer> {

    Optional<NhanVien> findByMaNV(String maNV);
    Optional<NhanVien> findByEmail(String email);
    boolean existsByMaNV(String maNV);

    @Query("SELECT nv.maNV FROM NhanVien nv ORDER BY nv.maNhanVien DESC LIMIT 1")
    String findMaxMaNV();

    List<NhanVien> findTop5ByOrderByMaNhanVienDesc();

    long countByTrangThai(String trangThai);
    long countByPhongBanMaPhongBan(Integer maPhongBan);
    long countByChucVuMaChucVu(Integer maChucVu);

    @Query("SELECT nv FROM NhanVien nv WHERE " +
           "(:search IS NULL OR :search = '' OR LOWER(nv.hoTen) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(nv.maNV) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(nv.email) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(nv.dienThoai) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:maPhongBan IS NULL OR nv.phongBan.maPhongBan = :maPhongBan) AND " +
           "(:maChucVu IS NULL OR nv.chucVu.maChucVu = :maChucVu) AND " +
           "(:trangThai IS NULL OR :trangThai = '' OR nv.trangThai = :trangThai)")
    Page<NhanVien> filterEmployees(@Param("search") String search,
                                   @Param("maPhongBan") Integer maPhongBan,
                                   @Param("maChucVu") Integer maChucVu,
                                   @Param("trangThai") String trangThai,
                                   Pageable pageable);

    @Query(value = "SELECT pb.TenPhongBan as tenPhongBan, COUNT(nv.MaNhanVien) as soLuong " +
                   "FROM PhongBan pb " +
                   "LEFT JOIN NhanVien nv ON pb.MaPhongBan = nv.MaPhongBan " +
                   "GROUP BY pb.MaPhongBan, pb.TenPhongBan", nativeQuery = true)
    List<Map<String, Object>> statsByDepartment();

    @Query(value = "SELECT nv.HoTen as hoTen, nv.MaNV as maNV, pb.TenPhongBan as tenPhongBan, cv.TenChucVu as tenChucVu, " +
                   "COALESCE(hd.LuongCoBan, 10000000) as luongThucNhan, nv.Avatar as avatar " +
                   "FROM NhanVien nv " +
                   "LEFT JOIN PhongBan pb ON nv.MaPhongBan = pb.MaPhongBan " +
                   "LEFT JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu " +
                   "LEFT JOIN HopDong hd ON nv.MaNhanVien = hd.MaNhanVien " +
                   "ORDER BY luongThucNhan DESC LIMIT 10", nativeQuery = true)
    List<Map<String, Object>> topEmployeesByBaseSalary();

    @Query(value = "SELECT SUM(COALESCE(hd.LuongCoBan, 10000000)) FROM NhanVien nv LEFT JOIN HopDong hd ON nv.MaNhanVien = hd.MaNhanVien", nativeQuery = true)
    BigDecimal totalEstimatedSalary();
}
