package K23.CNT1._5.DAQ.quan.comdemo.repository;

import K23.CNT1._5.DAQ.quan.comdemo.entity.ChucVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChucVuRepository extends JpaRepository<ChucVu, Integer> {
}
