package K23.CNT1._5.DAQ.quan.comdemo.service;

import K23.CNT1._5.DAQ.quan.comdemo.entity.ChucVu;
import K23.CNT1._5.DAQ.quan.comdemo.entity.NhanVien;
import K23.CNT1._5.DAQ.quan.comdemo.entity.PhongBan;
import K23.CNT1._5.DAQ.quan.comdemo.repository.ChucVuRepository;
import K23.CNT1._5.DAQ.quan.comdemo.repository.NhanVienRepository;
import K23.CNT1._5.DAQ.quan.comdemo.repository.PhongBanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class EmployeeService {

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private PhongBanRepository phongBanRepository;

    @Autowired
    private ChucVuRepository chucVuRepository;

    public Page<NhanVien> getAll(int page, int limit, String search, Integer maPhongBan,
                                 Integer maChucVu, String trangThai, String sortBy, String sortDir) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir.toUpperCase()),
                sortBy.equalsIgnoreCase("MaNhanVien") ? "maNhanVien" : sortBy);
        Pageable pageable = PageRequest.of(page - 1, limit, sort);

        return nhanVienRepository.filterEmployees(search, maPhongBan, maChucVu, trangThai, pageable);
    }

    public NhanVien getOne(Integer id) {
        return nhanVienRepository.findById(id).orElse(null);
    }

    @Transactional
    public NhanVien create(Map<String, Object> body, String avatarPath) {
        String maNV = (String) body.get("maNV");
        if (maNV != null && !maNV.isEmpty() && nhanVienRepository.existsByMaNV(maNV)) {
            throw new IllegalArgumentException("Mã nhân viên đã tồn tại");
        }

        if (maNV == null || maNV.isEmpty()) {
            String maxMaNV = nhanVienRepository.findMaxMaNV();
            int nextNum = 1;
            if (maxMaNV != null && maxMaNV.startsWith("NV")) {
                try {
                    nextNum = Integer.parseInt(maxMaNV.substring(2)) + 1;
                } catch (Exception ignored) {}
            }
            maNV = String.format("NV%03d", nextNum);
        }

        Integer maPB = body.get("maPhongBan") != null ? Integer.parseInt(body.get("maPhongBan").toString()) : null;
        Integer maCV = body.get("maChucVu") != null ? Integer.parseInt(body.get("maChucVu").toString()) : null;

        PhongBan pb = maPB != null ? phongBanRepository.findById(maPB).orElse(null) : null;
        ChucVu cv = maCV != null ? chucVuRepository.findById(maCV).orElse(null) : null;

        NhanVien nv = NhanVien.builder()
                .maNV(maNV)
                .hoTen((String) body.get("hoTen"))
                .gioiTinh((String) body.get("gioiTinh"))
                .ngaySinh(body.get("ngaySinh") != null ? LocalDate.parse(body.get("ngaySinh").toString()) : null)
                .dienThoai((String) body.get("dienThoai"))
                .email((String) body.get("email"))
                .cccd((String) body.get("cccd"))
                .diaChi((String) body.get("diaChi"))
                .ngayVaoLam(body.get("ngayVaoLam") != null ? LocalDate.parse(body.get("ngayVaoLam").toString()) : LocalDate.now())
                .phongBan(pb)
                .chucVu(cv)
                .trangThai(body.get("trangThai") != null ? body.get("trangThai").toString() : "DangLam")
                .avatar(avatarPath)
                .build();

        return nhanVienRepository.save(nv);
    }

    @Transactional
    public NhanVien update(Integer id, Map<String, Object> body, String avatarPath) {
        NhanVien nv = nhanVienRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Không tìm thấy nhân viên"));

        if (body.containsKey("hoTen")) nv.setHoTen((String) body.get("hoTen"));
        if (body.containsKey("gioiTinh")) nv.setGioiTinh((String) body.get("gioiTinh"));
        if (body.containsKey("ngaySinh") && body.get("ngaySinh") != null) nv.setNgaySinh(LocalDate.parse(body.get("ngaySinh").toString()));
        if (body.containsKey("dienThoai")) nv.setDienThoai((String) body.get("dienThoai"));
        if (body.containsKey("email")) nv.setEmail((String) body.get("email"));
        if (body.containsKey("cccd")) nv.setCccd((String) body.get("cccd"));
        if (body.containsKey("diaChi")) nv.setDiaChi((String) body.get("diaChi"));
        if (body.containsKey("ngayVaoLam") && body.get("ngayVaoLam") != null) nv.setNgayVaoLam(LocalDate.parse(body.get("ngayVaoLam").toString()));
        if (body.containsKey("trangThai")) nv.setTrangThai((String) body.get("trangThai"));

        if (body.containsKey("maPhongBan")) {
            Integer maPB = body.get("maPhongBan") != null ? Integer.parseInt(body.get("maPhongBan").toString()) : null;
            nv.setPhongBan(maPB != null ? phongBanRepository.findById(maPB).orElse(null) : null);
        }

        if (body.containsKey("maChucVu")) {
            Integer maCV = body.get("maChucVu") != null ? Integer.parseInt(body.get("maChucVu").toString()) : null;
            nv.setChucVu(maCV != null ? chucVuRepository.findById(maCV).orElse(null) : null);
        }

        if (avatarPath != null) {
            nv.setAvatar(avatarPath);
        }

        return nhanVienRepository.save(nv);
    }

    @Transactional
    public void delete(Integer id) {
        nhanVienRepository.deleteById(id);
    }

    public List<NhanVien> getAllSimple() {
        return nhanVienRepository.findAll();
    }
}
