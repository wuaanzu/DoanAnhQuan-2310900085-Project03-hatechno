package K23.CNT1._5.DAQ.quan.comdemo.service;

import K23.CNT1._5.DAQ.quan.comdemo.entity.DonNghiPhep;
import K23.CNT1._5.DAQ.quan.comdemo.entity.NhanVien;
import K23.CNT1._5.DAQ.quan.comdemo.repository.DonNghiPhepRepository;
import K23.CNT1._5.DAQ.quan.comdemo.repository.NhanVienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class LeaveService {

    @Autowired
    private DonNghiPhepRepository donNghiPhepRepository;

    @Autowired
    private NhanVienRepository nhanVienRepository;

    public Page<DonNghiPhep> getAll(int page, int limit, Integer maNhanVien, String trangThai, String search) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "maDon"));
        return donNghiPhepRepository.filterLeaves(maNhanVien, trangThai, search, pageable);
    }

    public DonNghiPhep getOne(Integer id) {
        return donNghiPhepRepository.findById(id).orElse(null);
    }

    public DonNghiPhep create(Map<String, Object> body, Integer userMaNhanVien, String userRole) {
        Integer maNhanVien = "NhanVien".equals(userRole) && userMaNhanVien != null ?
                userMaNhanVien : Integer.parseInt(body.get("maNhanVien").toString());

        NhanVien nv = nhanVienRepository.findById(maNhanVien).orElseThrow(() -> new NoSuchElementException("Không tìm thấy nhân viên"));

        DonNghiPhep dnp = DonNghiPhep.builder()
                .nhanVien(nv)
                .ngayBatDau(body.get("ngayBatDau") != null ? LocalDate.parse(body.get("ngayBatDau").toString()) : null)
                .ngayKetThuc(body.get("ngayKetThuc") != null ? LocalDate.parse(body.get("ngayKetThuc").toString()) : null)
                .lyDo((String) body.get("lyDo"))
                .trangThai(body.get("trangThai") != null ? body.get("trangThai").toString() : "ChoDuyet")
                .build();

        return donNghiPhepRepository.save(dnp);
    }

    public DonNghiPhep update(Integer id, Map<String, Object> body) {
        DonNghiPhep dnp = donNghiPhepRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Không tìm thấy đơn"));

        if (body.containsKey("ngayBatDau") && body.get("ngayBatDau") != null) dnp.setNgayBatDau(LocalDate.parse(body.get("ngayBatDau").toString()));
        if (body.containsKey("ngayKetThuc") && body.get("ngayKetThuc") != null) dnp.setNgayKetThuc(LocalDate.parse(body.get("ngayKetThuc").toString()));
        if (body.containsKey("lyDo")) dnp.setLyDo((String) body.get("lyDo"));
        if (body.containsKey("trangThai")) dnp.setTrangThai((String) body.get("trangThai"));

        return donNghiPhepRepository.save(dnp);
    }

    public DonNghiPhep approve(Integer id) {
        DonNghiPhep dnp = donNghiPhepRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Không tìm thấy đơn"));
        dnp.setTrangThai("DaDuyet");
        return donNghiPhepRepository.save(dnp);
    }

    public DonNghiPhep reject(Integer id) {
        DonNghiPhep dnp = donNghiPhepRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Không tìm thấy đơn"));
        dnp.setTrangThai("TuChoi");
        return donNghiPhepRepository.save(dnp);
    }

    public void delete(Integer id) {
        donNghiPhepRepository.deleteById(id);
    }
}
