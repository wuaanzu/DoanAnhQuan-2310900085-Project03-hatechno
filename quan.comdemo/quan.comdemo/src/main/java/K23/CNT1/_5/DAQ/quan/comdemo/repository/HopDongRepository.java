package K23.CNT1._5.DAQ.quan.comdemo.repository;

import K23.CNT1._5.DAQ.quan.comdemo.entity.HopDong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HopDongRepository extends JpaRepository<HopDong, Integer> {
    Optional<HopDong> findByNhanVienMaNhanVien(Integer maNhanVien);
}
