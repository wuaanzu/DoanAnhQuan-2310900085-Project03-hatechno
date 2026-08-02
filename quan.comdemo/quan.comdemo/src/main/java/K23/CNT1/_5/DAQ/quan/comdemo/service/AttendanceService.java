package K23.CNT1._5.DAQ.quan.comdemo.service;

import K23.CNT1._5.DAQ.quan.comdemo.entity.ChamCong;
import K23.CNT1._5.DAQ.quan.comdemo.entity.NhanVien;
import K23.CNT1._5.DAQ.quan.comdemo.repository.ChamCongRepository;
import K23.CNT1._5.DAQ.quan.comdemo.repository.NhanVienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class AttendanceService {

    @Autowired
    private ChamCongRepository chamCongRepository;

    @Autowired
    private NhanVienRepository nhanVienRepository;

    public Page<ChamCong> getAll(int page, int limit, Integer maNhanVien, Integer thang, Integer nam, String search) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "ngayLam"));
        return chamCongRepository.filterAttendance(maNhanVien, thang, nam, search, pageable);
    }

    public ChamCong getOne(Integer id) {
        return chamCongRepository.findById(id).orElse(null);
    }

    @Autowired
    private SalaryService salaryService;

    public ChamCong create(Map<String, Object> body) {
        Integer maNhanVien = Integer.parseInt(body.get("maNhanVien").toString());
        NhanVien nv = nhanVienRepository.findById(maNhanVien).orElseThrow(() -> new NoSuchElementException("Nhân viên không tồn tại"));

        LocalDate ngayLam = LocalDate.parse(body.get("ngayLam").toString());
        LocalTime gioVao = body.get("gioVao") != null ? LocalTime.parse(body.get("gioVao").toString()) : null;
        LocalTime gioRa = body.get("gioRa") != null ? LocalTime.parse(body.get("gioRa").toString()) : null;

        BigDecimal soGioLam = null;
        if (body.get("soGioLam") != null) {
            soGioLam = new BigDecimal(body.get("soGioLam").toString());
        } else if (gioVao != null && gioRa != null) {
            long minutes = java.time.Duration.between(gioVao, gioRa).toMinutes();
            soGioLam = BigDecimal.valueOf(minutes).divide(BigDecimal.valueOf(60), 2, java.math.RoundingMode.HALF_UP);
        }

        BigDecimal tangCa = body.get("tangCa") != null ? new BigDecimal(body.get("tangCa").toString()) : BigDecimal.ZERO;
        String trangThai = body.get("trangThai") != null ? body.get("trangThai").toString() : "Đúng giờ";

        ChamCong cc = ChamCong.builder()
                .nhanVien(nv)
                .ngayLam(ngayLam)
                .gioVao(gioVao)
                .gioRa(gioRa)
                .soGioLam(soGioLam)
                .tangCa(tangCa)
                .trangThai(trangThai)
                .build();

        ChamCong saved = chamCongRepository.save(cc);
        salaryService.syncSingleSalaryFromAttendance(saved.getNhanVien().getMaNhanVien(), saved.getNgayLam().getMonthValue(), saved.getNgayLam().getYear());
        return saved;
    }

    public ChamCong update(Integer id, Map<String, Object> body) {
        ChamCong cc = chamCongRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Không tìm thấy bản ghi chấm công"));

        if (body.containsKey("maNhanVien") && body.get("maNhanVien") != null) {
            Integer maNhanVien = Integer.parseInt(body.get("maNhanVien").toString());
            cc.setNhanVien(nhanVienRepository.findById(maNhanVien).orElse(null));
        }

        if (body.containsKey("ngayLam") && body.get("ngayLam") != null) cc.setNgayLam(LocalDate.parse(body.get("ngayLam").toString()));
        if (body.containsKey("gioVao") && body.get("gioVao") != null) cc.setGioVao(LocalTime.parse(body.get("gioVao").toString()));
        if (body.containsKey("gioRa") && body.get("gioRa") != null) cc.setGioRa(LocalTime.parse(body.get("gioRa").toString()));

        if (body.containsKey("soGioLam") && body.get("soGioLam") != null) {
            cc.setSoGioLam(new BigDecimal(body.get("soGioLam").toString()));
        } else if (cc.getGioVao() != null && cc.getGioRa() != null) {
            long minutes = java.time.Duration.between(cc.getGioVao(), cc.getGioRa()).toMinutes();
            cc.setSoGioLam(BigDecimal.valueOf(minutes).divide(BigDecimal.valueOf(60), 2, java.math.RoundingMode.HALF_UP));
        }

        if (body.containsKey("tangCa") && body.get("tangCa") != null) cc.setTangCa(new BigDecimal(body.get("tangCa").toString()));
        if (body.containsKey("trangThai") && body.get("trangThai") != null) cc.setTrangThai(body.get("trangThai").toString());

        ChamCong saved = chamCongRepository.save(cc);
        salaryService.syncSingleSalaryFromAttendance(saved.getNhanVien().getMaNhanVien(), saved.getNgayLam().getMonthValue(), saved.getNgayLam().getYear());
        return saved;
    }

    public void delete(Integer id) {
        ChamCong cc = chamCongRepository.findById(id).orElse(null);
        chamCongRepository.deleteById(id);
        if (cc != null && cc.getNhanVien() != null) {
            salaryService.syncSingleSalaryFromAttendance(cc.getNhanVien().getMaNhanVien(), cc.getNgayLam().getMonthValue(), cc.getNgayLam().getYear());
        }
    }

    public List<ChamCong> getByEmployeeMonth(Integer maNhanVien, Integer thang, Integer nam) {
        return chamCongRepository.findByEmployeeAndMonthYear(maNhanVien, thang, nam);
    }
}
