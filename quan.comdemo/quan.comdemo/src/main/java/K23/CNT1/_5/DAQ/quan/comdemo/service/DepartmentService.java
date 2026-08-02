package K23.CNT1._5.DAQ.quan.comdemo.service;

import K23.CNT1._5.DAQ.quan.comdemo.entity.PhongBan;
import K23.CNT1._5.DAQ.quan.comdemo.repository.NhanVienRepository;
import K23.CNT1._5.DAQ.quan.comdemo.repository.PhongBanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class DepartmentService {

    @Autowired
    private PhongBanRepository phongBanRepository;

    @Autowired
    private NhanVienRepository nhanVienRepository;

    public List<PhongBan> getAll() {
        List<PhongBan> list = phongBanRepository.findAll();
        for (PhongBan pb : list) {
            populateExtraInfo(pb);
        }
        return list;
    }

    public PhongBan getOne(Integer id) {
        PhongBan pb = phongBanRepository.findById(id).orElse(null);
        if (pb != null) {
            populateExtraInfo(pb);
        }
        return pb;
    }

    private void populateExtraInfo(PhongBan pb) {
        if (pb.getTruongPhong() != null) {
            nhanVienRepository.findById(pb.getTruongPhong()).ifPresent(nv -> pb.setTenTruongPhong(nv.getHoTen()));
        }
        long count = nhanVienRepository.countByPhongBanMaPhongBan(pb.getMaPhongBan());
        pb.setSoNhanVien(count);
    }

    public PhongBan create(PhongBan pb) {
        if (pb.getTenPhongBan() == null || pb.getTenPhongBan().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên phòng ban không được trống");
        }
        return phongBanRepository.save(pb);
    }

    public PhongBan update(Integer id, PhongBan req) {
        PhongBan pb = phongBanRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Không tìm thấy phòng ban"));
        if (req.getTenPhongBan() != null) pb.setTenPhongBan(req.getTenPhongBan());
        if (req.getTruongPhong() != null) pb.setTruongPhong(req.getTruongPhong());
        if (req.getMoTa() != null) pb.setMoTa(req.getMoTa());
        return phongBanRepository.save(pb);
    }

    public void delete(Integer id) {
        phongBanRepository.deleteById(id);
    }
}
