package K23.CNT1._5.DAQ.quan.comdemo.service;

import K23.CNT1._5.DAQ.quan.comdemo.entity.KhenThuongKyLuat;
import K23.CNT1._5.DAQ.quan.comdemo.entity.NhanVien;
import K23.CNT1._5.DAQ.quan.comdemo.repository.KhenThuongKyLuatRepository;
import K23.CNT1._5.DAQ.quan.comdemo.repository.NhanVienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class RewardService {

    @Autowired
    private KhenThuongKyLuatRepository khenThuongKyLuatRepository;

    @Autowired
    private NhanVienRepository nhanVienRepository;

    public Page<KhenThuongKyLuat> getAll(int page, int limit, Integer maNhanVien, String loai, String search) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "maKTKL"));
        return khenThuongKyLuatRepository.filterRewards(maNhanVien, loai, search, pageable);
    }

    public KhenThuongKyLuat getOne(Integer id) {
        return khenThuongKyLuatRepository.findById(id).orElse(null);
    }

    public KhenThuongKyLuat create(Map<String, Object> body) {
        Integer maNhanVien = Integer.parseInt(body.get("maNhanVien").toString());
        NhanVien nv = nhanVienRepository.findById(maNhanVien).orElseThrow(() -> new NoSuchElementException("Không tìm thấy nhân viên"));

        KhenThuongKyLuat ktkl = KhenThuongKyLuat.builder()
                .nhanVien(nv)
                .loai((String) body.get("loai"))
                .soTien(body.get("soTien") != null ? new BigDecimal(body.get("soTien").toString()) : BigDecimal.ZERO)
                .lyDo((String) body.get("lyDo"))
                .ngay(body.get("ngay") != null ? LocalDate.parse(body.get("ngay").toString()) : LocalDate.now())
                .build();

        return khenThuongKyLuatRepository.save(ktkl);
    }

    public KhenThuongKyLuat update(Integer id, Map<String, Object> body) {
        KhenThuongKyLuat ktkl = khenThuongKyLuatRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Không tìm thấy bản ghi"));

        if (body.containsKey("loai")) ktkl.setLoai((String) body.get("loai"));
        if (body.containsKey("soTien") && body.get("soTien") != null) ktkl.setSoTien(new BigDecimal(body.get("soTien").toString()));
        if (body.containsKey("lyDo")) ktkl.setLyDo((String) body.get("lyDo"));
        if (body.containsKey("ngay") && body.get("ngay") != null) ktkl.setNgay(LocalDate.parse(body.get("ngay").toString()));

        return khenThuongKyLuatRepository.save(ktkl);
    }

    public void delete(Integer id) {
        khenThuongKyLuatRepository.deleteById(id);
    }
}
