
DROP DATABASE IF EXISTS HATECHNO;
CREATE DATABASE HATECHNO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE HATECHNO;

CREATE TABLE Quyen (
    MaQuyen INT AUTO_INCREMENT PRIMARY KEY,
    TenQuyen VARCHAR(50) NOT NULL,
    MoTa VARCHAR(255)
);

CREATE TABLE PhongBan (
    MaPhongBan INT AUTO_INCREMENT PRIMARY KEY,
    TenPhongBan VARCHAR(100) NOT NULL,
    MoTa VARCHAR(255)
);

CREATE TABLE ChucVu (
    MaChucVu INT AUTO_INCREMENT PRIMARY KEY,
    TenChucVu VARCHAR(100) NOT NULL,
    PhuCap DECIMAL(15,2) DEFAULT 0
);

CREATE TABLE NhanVien (
    MaNhanVien INT AUTO_INCREMENT PRIMARY KEY,
    MaNV VARCHAR(20) UNIQUE NOT NULL,
    HoTen VARCHAR(150) NOT NULL,
    GioiTinh ENUM('Nam','Nu'),
    NgaySinh DATE,
    DienThoai VARCHAR(20),
    Email VARCHAR(100),
    CCCD VARCHAR(20),
    DiaChi VARCHAR(255),
    NgayVaoLam DATE,
    MaPhongBan INT,
    MaChucVu INT,
    TrangThai ENUM('DangLam','NghiViec') DEFAULT 'DangLam',
    CONSTRAINT FK_NV_PB FOREIGN KEY (MaPhongBan) REFERENCES PhongBan(MaPhongBan)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT FK_NV_CV FOREIGN KEY (MaChucVu) REFERENCES ChucVu(MaChucVu)
        ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE TaiKhoan (
    MaTaiKhoan INT AUTO_INCREMENT PRIMARY KEY,
    TenDangNhap VARCHAR(50) UNIQUE NOT NULL,
    MatKhau VARCHAR(255) NOT NULL,
    MaNhanVien INT UNIQUE,
    MaQuyen INT NOT NULL,
    TrangThai BOOLEAN DEFAULT TRUE,
    CONSTRAINT FK_TK_NV FOREIGN KEY (MaNhanVien) REFERENCES NhanVien(MaNhanVien)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_TK_Q FOREIGN KEY (MaQuyen) REFERENCES Quyen(MaQuyen)
        ON UPDATE CASCADE
);

CREATE TABLE HopDong (
    MaHopDong INT AUTO_INCREMENT PRIMARY KEY,
    MaNhanVien INT NOT NULL,
    LoaiHopDong VARCHAR(100),
    NgayBatDau DATE,
    NgayKetThuc DATE,
    LuongCoBan DECIMAL(15,2),
    CONSTRAINT FK_HD_NV FOREIGN KEY (MaNhanVien) REFERENCES NhanVien(MaNhanVien)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE ChamCong (
    MaChamCong INT AUTO_INCREMENT PRIMARY KEY,
    MaNhanVien INT NOT NULL,
    NgayLam DATE NOT NULL,
    GioVao TIME,
    GioRa TIME,
    SoGioLam DECIMAL(4,2),
    TangCa DECIMAL(4,2) DEFAULT 0,
    TrangThai VARCHAR(30),
    CONSTRAINT FK_CC_NV FOREIGN KEY (MaNhanVien) REFERENCES NhanVien(MaNhanVien)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE BangLuong (
    MaBangLuong INT AUTO_INCREMENT PRIMARY KEY,
    MaNhanVien INT NOT NULL,
    Thang INT NOT NULL,
    Nam INT NOT NULL,
    TongThuNhap DECIMAL(15,2) DEFAULT 0,
    TongKhauTru DECIMAL(15,2) DEFAULT 0,
    LuongThucNhan DECIMAL(15,2) DEFAULT 0,
    NgayLap DATE,
    TrangThai ENUM('ChuaChot','DaChot') DEFAULT 'ChuaChot',
    CONSTRAINT FK_BL_NV FOREIGN KEY (MaNhanVien) REFERENCES NhanVien(MaNhanVien)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE ChiTietBangLuong (
    MaChiTiet INT AUTO_INCREMENT PRIMARY KEY,
    MaBangLuong INT NOT NULL,
    LoaiKhoan VARCHAR(100) NOT NULL,
    SoTien DECIMAL(15,2) NOT NULL,
    GhiChu VARCHAR(255),
    CONSTRAINT FK_CTBL_BL FOREIGN KEY (MaBangLuong) REFERENCES BangLuong(MaBangLuong)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE DonNghiPhep (
    MaDon INT AUTO_INCREMENT PRIMARY KEY,
    MaNhanVien INT NOT NULL,
    NgayBatDau DATE,
    NgayKetThuc DATE,
    LyDo TEXT,
    TrangThai ENUM('ChoDuyet','DaDuyet','TuChoi') DEFAULT 'ChoDuyet',
    CONSTRAINT FK_DNP_NV FOREIGN KEY (MaNhanVien) REFERENCES NhanVien(MaNhanVien)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE KhenThuongKyLuat (
    MaKTKL INT AUTO_INCREMENT PRIMARY KEY,
    MaNhanVien INT NOT NULL,
    Loai ENUM('Thuong','KyLuat'),
    SoTien DECIMAL(15,2),
    LyDo TEXT,
    Ngay DATE,
    CONSTRAINT FK_KTKL_NV FOREIGN KEY (MaNhanVien) REFERENCES NhanVien(MaNhanVien)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX IDX_NV_PHONGBAN ON NhanVien(MaPhongBan);
CREATE INDEX IDX_NV_CHUCVU ON NhanVien(MaChucVu);
CREATE INDEX IDX_CC_NV ON ChamCong(MaNhanVien);
CREATE INDEX IDX_BL_NV ON BangLuong(MaNhanVien);

INSERT INTO Quyen(TenQuyen,MoTa) VALUES
('Admin','Quan tri'),
('NhanSu','Quan ly nhan su'),
('NhanVien','Nhan vien');

INSERT INTO PhongBan(TenPhongBan) VALUES
('Ban Giam Doc'),
('Phong Nhan Su'),
('Phong CNTT'),
('Phong Marketing'),
('Phong Ke Toan');

INSERT INTO ChucVu(TenChucVu,PhuCap) VALUES
('Giam Doc',5000000),
('Truong Phong',3000000),
('Nhan Vien',1000000);

USE HATECHNO;

INSERT INTO NhanVien
(MaNV, HoTen, GioiTinh, NgaySinh, DienThoai, Email, CCCD, DiaChi,
NgayVaoLam, MaPhongBan, MaChucVu, TrangThai)
VALUES
('NV001','Nguyễn Văn An','Nam','1995-03-12','0901000001','an@hatechno.vn','001001001001','Hà Nội','2023-01-10',3,3,'DangLam'),
('NV002','Trần Thị Bình','Nu','1997-07-21','0901000002','binh@hatechno.vn','001001001002','Hà Nội','2023-02-15',2,3,'DangLam'),
('NV003','Lê Minh Cường','Nam','1994-11-08','0901000003','cuong@hatechno.vn','001001001003','Hải Phòng','2022-09-01',3,2,'DangLam'),
('NV004','Phạm Thu Dung','Nu','1998-05-14','0901000004','dung@hatechno.vn','001001001004','Quảng Ninh','2024-01-03',4,3,'DangLam'),
('NV005','Hoàng Đức Anh','Nam','1996-09-30','0901000005','anh@hatechno.vn','001001001005','Hà Nội','2021-08-12',5,2,'DangLam'),
('NV006','Đỗ Hải Long','Nam','1993-02-17','0901000006','long@hatechno.vn','001001001006','Bắc Ninh','2020-04-05',3,3,'DangLam'),
('NV007','Vũ Thanh Mai','Nu','1999-01-20','0901000007','mai@hatechno.vn','001001001007','Hà Nội','2023-07-01',2,3,'DangLam'),
('NV008','Nguyễn Quốc Huy','Nam','1992-06-25','0901000008','huy@hatechno.vn','001001001008','Hải Dương','2019-11-11',1,1,'DangLam'),
('NV009','Trịnh Thu Hà','Nu','1997-10-10','0901000009','ha@hatechno.vn','001001001009','Nam Định','2024-03-01',4,3,'DangLam'),
('NV010','Bùi Văn Nam','Nam','1995-12-18','0901000010','nam@hatechno.vn','001001001010','Hà Nội','2022-06-06',5,3,'DangLam'),
('NV011','Phan Minh Đức','Nam','1998-08-22','0901000011','duc@hatechno.vn','001001001011','Hà Nam','2023-09-18',3,3,'DangLam'),
('NV012','Lý Thu Trang','Nu','1996-04-15','0901000012','trang@hatechno.vn','001001001012','Hà Nội','2022-12-20',2,2,'DangLam'),
('NV013','Nguyễn Khánh Linh','Nu','1999-09-09','0901000013','linh@hatechno.vn','001001001013','Quảng Ninh','2024-02-15',4,3,'DangLam'),
('NV014','Đặng Hoàng Sơn','Nam','1991-07-27','0901000014','son@hatechno.vn','001001001014','Hưng Yên','2018-03-05',3,2,'DangLam'),
('NV015','Tạ Minh Quân','Nam','1994-05-11','0901000015','quan@hatechno.vn','001001001015','Hà Nội','2021-10-01',5,3,'DangLam'),
('NV016','Ngô Thu Hương','Nu','1998-12-30','0901000016','huong@hatechno.vn','001001001016','Bắc Giang','2023-05-08',2,3,'DangLam'),
('NV017','Lưu Văn Phúc','Nam','1995-01-04','0901000017','phuc@hatechno.vn','001001001017','Hải Phòng','2020-07-15',3,3,'DangLam'),
('NV018','Mai Ngọc Ánh','Nu','1997-03-29','0901000018','ngocanh@hatechno.vn','001001001018','Hà Nội','2022-11-28',4,3,'DangLam'),
('NV019','Trần Văn Khánh','Nam','1993-11-13','0901000019','khanh@hatechno.vn','001001001019','Thái Bình','2019-09-09',5,2,'DangLam'),
('NV020','Phạm Thị Yến','Nu','1999-06-18','0901000020','yen@hatechno.vn','001001001020','Hà Nội','2024-04-01',2,3,'DangLam');

INSERT INTO TaiKhoan
(TenDangNhap, MatKhau, MaNhanVien, MaQuyen, TrangThai)
VALUES
('admin', '123456', 1, 1, TRUE),
('hr01', '123456', 2, 2, TRUE),
('it01', '123456', 3, 2, TRUE),
('marketing01', '123456', 4, 2, TRUE),
('ketoan01', '123456', 5, 2, TRUE),

('nv006', '123456', 6, 3, TRUE),
('nv007', '123456', 7, 3, TRUE),
('giamdoc', '123456', 8, 1, TRUE),
('nv009', '123456', 9, 3, TRUE),
('nv010', '123456', 10, 3, TRUE),

('nv011', '123456', 11, 3, TRUE),
('tpnhansu', '123456', 12, 2, TRUE),
('nv013', '123456', 13, 3, TRUE),
('tpcntt', '123456', 14, 2, TRUE),
('nv015', '123456', 15, 3, TRUE),

('nv016', '123456', 16, 3, TRUE),
('nv017', '123456', 17, 3, TRUE),
('nv018', '123456', 18, 3, TRUE),
('tpketoan', '123456', 19, 2, TRUE),
('nv020', '123456', 20, 3, TRUE);

INSERT INTO HopDong
(MaNhanVien, LoaiHopDong, NgayBatDau, NgayKetThuc, LuongCoBan)
VALUES
(1,'Hợp đồng không xác định thời hạn','2023-01-10',NULL,30000000),
(2,'Hợp đồng 3 năm','2023-02-15','2026-02-14',12000000),
(3,'Hợp đồng 3 năm','2022-09-01','2025-08-31',18000000),
(4,'Hợp đồng 2 năm','2024-01-03','2026-01-02',11000000),
(5,'Hợp đồng 3 năm','2021-08-12','2024-08-11',17000000),
(6,'Hợp đồng không xác định thời hạn','2020-04-05',NULL,15000000),
(7,'Hợp đồng 2 năm','2023-07-01','2025-06-30',10000000),
(8,'Hợp đồng không xác định thời hạn','2019-11-11',NULL,45000000),
(9,'Hợp đồng 2 năm','2024-03-01','2026-02-28',10000000),
(10,'Hợp đồng 3 năm','2022-06-06','2025-06-05',12000000),
(11,'Hợp đồng 2 năm','2023-09-18','2025-09-17',11000000),
(12,'Hợp đồng không xác định thời hạn','2022-12-20',NULL,18000000),
(13,'Hợp đồng 2 năm','2024-02-15','2026-02-14',10500000),
(14,'Hợp đồng không xác định thời hạn','2018-03-05',NULL,20000000),
(15,'Hợp đồng 3 năm','2021-10-01','2024-09-30',12000000),
(16,'Hợp đồng 2 năm','2023-05-08','2025-05-07',10000000),
(17,'Hợp đồng không xác định thời hạn','2020-07-15',NULL,14000000),
(18,'Hợp đồng 3 năm','2022-11-28','2025-11-27',11000000),
(19,'Hợp đồng không xác định thời hạn','2019-09-09',NULL,19000000),
(20,'Hợp đồng 2 năm','2024-04-01','2026-03-31',9500000);

INSERT INTO ChamCong
(MaNhanVien, NgayLam, GioVao, GioRa, SoGioLam, TangCa, TrangThai)
VALUES
(1,'2026-07-01','08:00:00','17:00:00',8,1,'Đúng giờ'),
(2,'2026-07-01','08:05:00','17:00:00',7.92,0,'Đi muộn'),
(3,'2026-07-01','08:00:00','18:00:00',9,1,'Tăng ca'),
(4,'2026-07-01','08:00:00','17:00:00',8,0,'Đúng giờ'),
(5,'2026-07-01','08:20:00','17:00:00',7.67,0,'Đi muộn'),
(6,'2026-07-01','08:00:00','17:30:00',8.5,0.5,'Tăng ca'),
(7,'2026-07-01','08:00:00','17:00:00',8,0,'Đúng giờ'),
(8,'2026-07-01','08:00:00','17:00:00',8,0,'Đúng giờ'),
(9,'2026-07-01','08:10:00','17:00:00',7.83,0,'Đi muộn'),
(10,'2026-07-01','08:00:00','17:00:00',8,0,'Đúng giờ'),
(11,'2026-07-01','08:00:00','17:00:00',8,0,'Đúng giờ'),
(12,'2026-07-01','08:00:00','18:00:00',9,1,'Tăng ca'),
(13,'2026-07-01','08:00:00','17:00:00',8,0,'Đúng giờ'),
(14,'2026-07-01','08:00:00','17:00:00',8,0,'Đúng giờ'),
(15,'2026-07-01','08:15:00','17:00:00',7.75,0,'Đi muộn'),
(16,'2026-07-01','08:00:00','17:30:00',8.5,0.5,'Tăng ca'),
(17,'2026-07-01','08:00:00','17:00:00',8,0,'Đúng giờ'),
(18,'2026-07-01','08:00:00','17:00:00',8,0,'Đúng giờ'),
(19,'2026-07-01','08:00:00','18:00:00',9,1,'Tăng ca'),
(20,'2026-07-01','08:00:00','17:00:00',8,0,'Đúng giờ'),

(1,'2026-07-02','08:00:00','17:00:00',8,0,'Đúng giờ'),
(2,'2026-07-02','08:00:00','17:00:00',8,0,'Đúng giờ'),
(3,'2026-07-02','08:00:00','18:00:00',9,1,'Tăng ca'),
(4,'2026-07-02','08:25:00','17:00:00',7.58,0,'Đi muộn'),
(5,'2026-07-02','08:00:00','17:00:00',8,0,'Đúng giờ'),
(6,'2026-07-02','08:00:00','17:30:00',8.5,0.5,'Tăng ca'),
(7,'2026-07-02','08:00:00','17:00:00',8,0,'Đúng giờ'),
(8,'2026-07-02','08:05:00','17:00:00',7.92,0,'Đi muộn'),
(9,'2026-07-02','08:00:00','17:00:00',8,0,'Đúng giờ'),
(10,'2026-07-02','08:00:00','17:00:00',8,0,'Đúng giờ');

INSERT INTO BangLuong
(MaNhanVien, Thang, Nam, TongThuNhap, TongKhauTru, LuongThucNhan, NgayLap, TrangThai)
VALUES
(1,7,2026,35000000,2000000,33000000,'2026-07-31','DaChot'),
(2,7,2026,13500000,500000,13000000,'2026-07-31','DaChot'),
(3,7,2026,20500000,1000000,19500000,'2026-07-31','DaChot'),
(4,7,2026,12000000,300000,11700000,'2026-07-31','DaChot'),
(5,7,2026,19500000,1000000,18500000,'2026-07-31','DaChot'),
(6,7,2026,17000000,700000,16300000,'2026-07-31','DaChot'),
(7,7,2026,11000000,300000,10700000,'2026-07-31','DaChot'),
(8,7,2026,50000000,3000000,47000000,'2026-07-31','DaChot'),
(9,7,2026,11500000,300000,11200000,'2026-07-31','DaChot'),
(10,7,2026,13000000,500000,12500000,'2026-07-31','DaChot'),
(11,7,2026,12000000,300000,11700000,'2026-07-31','DaChot'),
(12,7,2026,21000000,1000000,20000000,'2026-07-31','DaChot'),
(13,7,2026,11500000,300000,11200000,'2026-07-31','DaChot'),
(14,7,2026,23000000,1000000,22000000,'2026-07-31','DaChot'),
(15,7,2026,13000000,500000,12500000,'2026-07-31','DaChot'),
(16,7,2026,11000000,300000,10700000,'2026-07-31','DaChot'),
(17,7,2026,16000000,700000,15300000,'2026-07-31','DaChot'),
(18,7,2026,12000000,300000,11700000,'2026-07-31','DaChot'),
(19,7,2026,22000000,1000000,21000000,'2026-07-31','DaChot'),
(20,7,2026,10500000,300000,10200000,'2026-07-31','DaChot');

INSERT INTO ChiTietBangLuong
(MaBangLuong, LoaiKhoan, SoTien, GhiChu)
VALUES
(1,'Lương cơ bản',30000000,''),
(1,'Phụ cấp',3000000,'Phụ cấp chức vụ'),
(1,'Thưởng KPI',2000000,'Hoàn thành KPI'),
(1,'Khấu trừ BHXH',2000000,'BHXH'),

(2,'Lương cơ bản',12000000,''),
(2,'Phụ cấp',1000000,''),
(2,'Thưởng KPI',500000,''),
(2,'Khấu trừ BHXH',500000,''),

(3,'Lương cơ bản',18000000,''),
(3,'Phụ cấp',1500000,''),
(3,'Thưởng KPI',1000000,''),
(3,'Khấu trừ BHXH',1000000,''),

(4,'Lương cơ bản',11000000,''),
(4,'Phụ cấp',500000,''),
(4,'Thưởng KPI',500000,''),
(4,'Khấu trừ BHXH',300000,''),

(5,'Lương cơ bản',17000000,''),
(5,'Phụ cấp',1000000,''),
(5,'Thưởng KPI',1500000,''),
(5,'Khấu trừ BHXH',1000000,''),

(6,'Lương cơ bản',15000000,''),
(6,'Phụ cấp',1000000,''),
(6,'Thưởng KPI',1000000,''),
(6,'Khấu trừ BHXH',700000,''),

(7,'Lương cơ bản',10000000,''),
(7,'Phụ cấp',500000,''),
(7,'Thưởng KPI',500000,''),
(7,'Khấu trừ BHXH',300000,''),

(8,'Lương cơ bản',45000000,''),
(8,'Phụ cấp',3000000,''),
(8,'Thưởng KPI',2000000,''),
(8,'Khấu trừ BHXH',3000000,''),

(9,'Lương cơ bản',10000000,''),
(9,'Phụ cấp',500000,''),
(9,'Thưởng KPI',1000000,''),
(9,'Khấu trừ BHXH',300000,''),

(10,'Lương cơ bản',12000000,''),
(10,'Phụ cấp',500000,''),
(10,'Thưởng KPI',500000,''),
(10,'Khấu trừ BHXH',500000,''),

(11,'Lương cơ bản',11000000,''),
(11,'Phụ cấp',500000,''),
(11,'Thưởng KPI',500000,''),
(11,'Khấu trừ BHXH',300000,''),

(12,'Lương cơ bản',18000000,''),
(12,'Phụ cấp',2000000,''),
(12,'Thưởng KPI',1000000,''),
(12,'Khấu trừ BHXH',1000000,''),

(13,'Lương cơ bản',10500000,''),
(13,'Phụ cấp',500000,''),
(13,'Thưởng KPI',500000,''),
(13,'Khấu trừ BHXH',300000,''),

(14,'Lương cơ bản',20000000,''),
(14,'Phụ cấp',2000000,''),
(14,'Thưởng KPI',1000000,''),
(14,'Khấu trừ BHXH',1000000,''),

(15,'Lương cơ bản',12000000,''),
(15,'Phụ cấp',500000,''),
(15,'Thưởng KPI',500000,''),
(15,'Khấu trừ BHXH',500000,''),

(16,'Lương cơ bản',10000000,''),
(16,'Phụ cấp',500000,''),
(16,'Thưởng KPI',500000,''),
(16,'Khấu trừ BHXH',300000,''),

(17,'Lương cơ bản',14000000,''),
(17,'Phụ cấp',1000000,''),
(17,'Thưởng KPI',1000000,''),
(17,'Khấu trừ BHXH',700000,''),

(18,'Lương cơ bản',11000000,''),
(18,'Phụ cấp',500000,''),
(18,'Thưởng KPI',500000,''),
(18,'Khấu trừ BHXH',300000,''),

(19,'Lương cơ bản',19000000,''),
(19,'Phụ cấp',2000000,''),
(19,'Thưởng KPI',1000000,''),
(19,'Khấu trừ BHXH',1000000,''),

(20,'Lương cơ bản',9500000,''),
(20,'Phụ cấp',500000,''),
(20,'Thưởng KPI',500000,''),
(20,'Khấu trừ BHXH',300000,'');

INSERT INTO DonNghiPhep
(MaNhanVien, NgayBatDau, NgayKetThuc, LyDo, TrangThai)
VALUES
(2,'2026-07-10','2026-07-11','Nghỉ ốm','DaDuyet'),
(4,'2026-07-15','2026-07-15','Việc gia đình','DaDuyet'),
(5,'2026-07-18','2026-07-19','Du lịch','ChoDuyet'),
(7,'2026-07-22','2026-07-22','Khám sức khỏe','DaDuyet'),
(9,'2026-07-25','2026-07-25','Việc cá nhân','ChoDuyet'),
(10,'2026-07-12','2026-07-13','Nghỉ phép năm','DaDuyet'),
(11,'2026-07-20','2026-07-20','Đám cưới người thân','DaDuyet'),
(12,'2026-07-27','2026-07-28','Du lịch','ChoDuyet'),
(13,'2026-07-05','2026-07-05','Ốm','DaDuyet'),
(14,'2026-07-30','2026-07-30','Việc cá nhân','TuChoi'),
(15,'2026-07-08','2026-07-08','Khám bệnh','DaDuyet'),
(16,'2026-07-17','2026-07-17','Nghỉ phép năm','DaDuyet'),
(17,'2026-07-24','2026-07-24','Có việc đột xuất','ChoDuyet'),
(18,'2026-07-21','2026-07-22','Du lịch','DaDuyet'),
(19,'2026-07-16','2026-07-16','Việc gia đình','DaDuyet'),
(20,'2026-07-29','2026-07-29','Khám sức khỏe','ChoDuyet');

INSERT INTO KhenThuongKyLuat
(MaNhanVien, Loai, SoTien, LyDo, Ngay)
VALUES
(1,'Thuong',3000000,'Hoàn thành xuất sắc KPI','2026-07-31'),
(2,'Thuong',1000000,'Hoàn thành công việc đúng hạn','2026-07-31'),
(3,'Thuong',2000000,'Đóng góp dự án CNTT','2026-07-31'),
(4,'KyLuat',300000,'Đi muộn nhiều lần','2026-07-31'),
(5,'Thuong',1500000,'Doanh số tốt','2026-07-31'),
(6,'Thuong',1000000,'Hỗ trợ đồng nghiệp','2026-07-31'),
(7,'KyLuat',200000,'Nghỉ không báo trước','2026-07-31'),
(8,'Thuong',5000000,'Lãnh đạo xuất sắc','2026-07-31'),
(9,'Thuong',500000,'Hoàn thành KPI','2026-07-31'),
(10,'KyLuat',300000,'Đi muộn','2026-07-31'),
(11,'Thuong',1000000,'Đóng góp sáng kiến','2026-07-31'),
(12,'Thuong',2000000,'Quản lý tốt phòng ban','2026-07-31'),
(13,'Thuong',500000,'Làm việc hiệu quả','2026-07-31'),
(14,'Thuong',2500000,'Hoàn thành dự án lớn','2026-07-31'),
(15,'KyLuat',200000,'Đi muộn nhiều lần','2026-07-31'),
(16,'Thuong',700000,'Làm việc tích cực','2026-07-31'),
(17,'Thuong',1200000,'Tăng ca hỗ trợ dự án','2026-07-31'),
(18,'Thuong',1000000,'Đạt KPI tháng','2026-07-31'),
(19,'Thuong',2000000,'Quản lý tốt nhân viên','2026-07-31'),
(20,'Thuong',500000,'Hoàn thành công việc','2026-07-31');

SELECT * FROM KhenThuongKyLuat;
SELECT * FROM DonNghiPhep;
SELECT * FROM ChiTietBangLuong;
SELECT * FROM BangLuong;
SELECT * FROM ChamCong;
SELECT * FROM HopDong;
SELECT * FROM TaiKhoan;
SELECT * FROM NhanVien;