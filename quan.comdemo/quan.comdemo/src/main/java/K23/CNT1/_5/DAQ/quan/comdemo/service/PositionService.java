package K23.CNT1._5.DAQ.quan.comdemo.service;

import K23.CNT1._5.DAQ.quan.comdemo.entity.ChucVu;
import K23.CNT1._5.DAQ.quan.comdemo.repository.ChucVuRepository;
import K23.CNT1._5.DAQ.quan.comdemo.repository.NhanVienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class PositionService {

    @Autowired
    private ChucVuRepository chucVuRepository;

    @Autowired
    private NhanVienRepository nhanVienRepository;

    public List<ChucVu> getAll() {
        List<ChucVu> list = chucVuRepository.findAll();
        for (ChucVu cv : list) {
            populateExtraInfo(cv);
        }
        return list;
    }

    public ChucVu getOne(Integer id) {
        ChucVu cv = chucVuRepository.findById(id).orElse(null);
        if (cv != null) {
            populateExtraInfo(cv);
        }
        return cv;
    }

    private void populateExtraInfo(ChucVu cv) {
        long count = nhanVienRepository.countByChucVuMaChucVu(cv.getMaChucVu());
        cv.setSoNhanVien(count);
    }

    public ChucVu create(ChucVu cv) {
        if (cv.getTenChucVu() == null || cv.getTenChucVu().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên chức vụ không được trống");
        }
        return chucVuRepository.save(cv);
    }

    public ChucVu update(Integer id, ChucVu req) {
        ChucVu cv = chucVuRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Không tìm thấy chức vụ"));
        if (req.getTenChucVu() != null) cv.setTenChucVu(req.getTenChucVu());
        if (req.getPhuCap() != null) cv.setPhuCap(req.getPhuCap());
        if (req.getMoTa() != null) cv.setMoTa(req.getMoTa());
        return chucVuRepository.save(cv);
    }

    public void delete(Integer id) {
        chucVuRepository.deleteById(id);
    }
}
