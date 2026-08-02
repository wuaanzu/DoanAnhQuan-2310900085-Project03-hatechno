package K23.CNT1._5.DAQ.quan.comdemo.repository;

import K23.CNT1._5.DAQ.quan.comdemo.entity.ChiTietBangLuong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChiTietBangLuongRepository extends JpaRepository<ChiTietBangLuong, Integer> {
    List<ChiTietBangLuong> findByBangLuongMaBangLuong(Integer maBangLuong);
    void deleteByBangLuongMaBangLuong(Integer maBangLuong);
}
