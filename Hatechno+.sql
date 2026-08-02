-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: hatechno
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bangluong`
--

DROP TABLE IF EXISTS `bangluong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bangluong` (
  `MaBangLuong` int NOT NULL AUTO_INCREMENT,
  `MaNhanVien` int NOT NULL,
  `Thang` int NOT NULL,
  `Nam` int NOT NULL,
  `TongThuNhap` decimal(15,2) DEFAULT '0.00',
  `TongKhauTru` decimal(15,2) DEFAULT '0.00',
  `LuongThucNhan` decimal(15,2) DEFAULT '0.00',
  `NgayLap` date DEFAULT NULL,
  `TrangThai` enum('ChuaChot','DaChot') COLLATE utf8mb4_unicode_ci DEFAULT 'ChuaChot',
  PRIMARY KEY (`MaBangLuong`),
  KEY `IDX_BL_NV` (`MaNhanVien`),
  CONSTRAINT `FK_BL_NV` FOREIGN KEY (`MaNhanVien`) REFERENCES `nhanvien` (`MaNhanVien`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bangluong`
--

LOCK TABLES `bangluong` WRITE;
/*!40000 ALTER TABLE `bangluong` DISABLE KEYS */;
INSERT INTO `bangluong` VALUES (1,1,7,2026,35000000.00,2000000.00,33000000.00,'2026-07-31','DaChot'),(2,2,7,2026,13500000.00,500000.00,13000000.00,'2026-07-31','DaChot'),(4,4,7,2026,12000000.00,300000.00,11700000.00,'2026-07-31','DaChot'),(5,5,7,2026,19500000.00,1000000.00,18500000.00,'2026-07-31','DaChot'),(6,6,7,2026,17000000.00,700000.00,16300000.00,'2026-07-31','DaChot'),(7,7,7,2026,11000000.00,300000.00,10700000.00,'2026-07-31','DaChot'),(8,8,7,2026,50000000.00,3000000.00,47000000.00,'2026-07-31','DaChot'),(9,9,7,2026,11500000.00,300000.00,11200000.00,'2026-07-31','DaChot'),(10,10,7,2026,13000000.00,500000.00,12500000.00,'2026-07-31','DaChot'),(11,11,7,2026,12000000.00,300000.00,11700000.00,'2026-07-31','DaChot'),(12,12,7,2026,21000000.00,1000000.00,20000000.00,'2026-07-31','DaChot'),(13,13,7,2026,11500000.00,300000.00,11200000.00,'2026-07-31','DaChot'),(15,15,7,2026,13000000.00,500000.00,12500000.00,'2026-07-31','DaChot'),(16,16,7,2026,11000000.00,300000.00,10700000.00,'2026-07-31','DaChot'),(17,17,7,2026,16000000.00,700000.00,15300000.00,'2026-07-31','DaChot'),(18,18,7,2026,12000000.00,300000.00,11700000.00,'2026-07-31','DaChot'),(19,19,7,2026,22000000.00,1000000.00,21000000.00,'2026-07-31','DaChot'),(20,20,7,2026,10500000.00,300000.00,10200000.00,'2026-07-31','DaChot');
/*!40000 ALTER TABLE `bangluong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chamcong`
--

DROP TABLE IF EXISTS `chamcong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chamcong` (
  `MaChamCong` int NOT NULL AUTO_INCREMENT,
  `MaNhanVien` int NOT NULL,
  `NgayLam` date NOT NULL,
  `GioVao` time DEFAULT NULL,
  `GioRa` time DEFAULT NULL,
  `SoGioLam` decimal(4,2) DEFAULT NULL,
  `TangCa` decimal(4,2) DEFAULT '0.00',
  `TrangThai` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaChamCong`),
  KEY `IDX_CC_NV` (`MaNhanVien`),
  CONSTRAINT `FK_CC_NV` FOREIGN KEY (`MaNhanVien`) REFERENCES `nhanvien` (`MaNhanVien`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chamcong`
--

LOCK TABLES `chamcong` WRITE;
/*!40000 ALTER TABLE `chamcong` DISABLE KEYS */;
INSERT INTO `chamcong` VALUES (1,1,'2026-07-01','08:00:00','17:00:00',8.00,1.00,'Đúng giờ'),(2,2,'2026-07-01','08:05:00','17:00:00',7.92,0.00,'Đi muộn'),(4,4,'2026-07-01','08:00:00','17:00:00',8.00,0.00,'Đúng giờ'),(5,5,'2026-07-01','08:20:00','17:00:00',7.67,0.00,'Đi muộn'),(6,6,'2026-07-01','08:00:00','17:30:00',8.50,0.50,'Tăng ca'),(7,7,'2026-07-01','08:00:00','17:00:00',8.00,0.00,'Đúng giờ'),(8,8,'2026-07-01','08:00:00','17:00:00',8.00,0.00,'Đúng giờ'),(9,9,'2026-07-01','08:10:00','17:00:00',7.83,0.00,'Đi muộn'),(10,10,'2026-07-01','08:00:00','17:00:00',8.00,0.00,'Đúng giờ'),(11,11,'2026-07-01','08:00:00','17:00:00',8.00,0.00,'Đúng giờ'),(12,12,'2026-07-01','08:00:00','18:00:00',9.00,1.00,'Tăng ca'),(13,13,'2026-07-01','08:00:00','17:00:00',8.00,0.00,'Đúng giờ'),(14,14,'2026-07-01','08:00:00','17:00:00',8.00,0.00,'Đúng giờ'),(15,15,'2026-07-01','08:15:00','17:00:00',7.75,0.00,'Đi muộn'),(16,16,'2026-07-01','08:00:00','17:30:00',8.50,0.50,'Tăng ca'),(17,17,'2026-07-01','08:00:00','17:00:00',8.00,0.00,'Đúng giờ'),(18,18,'2026-07-01','08:00:00','17:00:00',8.00,0.00,'Đúng giờ'),(19,19,'2026-07-01','08:00:00','18:00:00',9.00,1.00,'Tăng ca'),(20,20,'2026-07-01','08:00:00','17:00:00',8.00,0.00,'Đúng giờ'),(21,1,'2026-07-02','08:00:00','17:00:00',8.00,0.00,'Đúng giờ'),(22,2,'2026-07-02','08:00:00','17:00:00',8.00,0.00,'Đúng giờ'),(24,4,'2026-07-02','08:25:00','17:00:00',7.58,0.00,'Đi muộn'),(25,5,'2026-07-02','08:00:00','17:00:00',8.00,0.00,'Đúng giờ'),(26,6,'2026-07-02','08:00:00','17:30:00',8.50,0.50,'Tăng ca'),(27,7,'2026-07-02','08:00:00','17:00:00',8.00,0.00,'Đúng giờ'),(28,8,'2026-07-02','08:05:00','17:00:00',7.92,0.00,'Đi muộn'),(29,9,'2026-07-02','08:00:00','17:00:00',8.00,0.00,'Đúng giờ'),(30,10,'2026-07-02','08:00:00','17:00:00',8.00,0.00,'Đúng giờ'),(31,21,'2026-07-31','11:00:00','20:00:00',8.00,3.00,'Đi muộn'),(32,10,'2026-07-31','08:00:00','17:00:00',8.00,0.00,'Đúng giờ');
/*!40000 ALTER TABLE `chamcong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chitietbangluong`
--

DROP TABLE IF EXISTS `chitietbangluong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chitietbangluong` (
  `MaChiTiet` int NOT NULL AUTO_INCREMENT,
  `MaBangLuong` int NOT NULL,
  `LoaiKhoan` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SoTien` decimal(15,2) NOT NULL,
  `GhiChu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaChiTiet`),
  KEY `FK_CTBL_BL` (`MaBangLuong`),
  CONSTRAINT `FK_CTBL_BL` FOREIGN KEY (`MaBangLuong`) REFERENCES `bangluong` (`MaBangLuong`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chitietbangluong`
--

LOCK TABLES `chitietbangluong` WRITE;
/*!40000 ALTER TABLE `chitietbangluong` DISABLE KEYS */;
INSERT INTO `chitietbangluong` VALUES (1,1,'Lương cơ bản',30000000.00,''),(2,1,'Phụ cấp',3000000.00,'Phụ cấp chức vụ'),(3,1,'Thưởng KPI',2000000.00,'Hoàn thành KPI'),(4,1,'Khấu trừ BHXH',2000000.00,'BHXH'),(5,2,'Lương cơ bản',12000000.00,''),(6,2,'Phụ cấp',1000000.00,''),(7,2,'Thưởng KPI',500000.00,''),(8,2,'Khấu trừ BHXH',500000.00,''),(13,4,'Lương cơ bản',11000000.00,''),(14,4,'Phụ cấp',500000.00,''),(15,4,'Thưởng KPI',500000.00,''),(16,4,'Khấu trừ BHXH',300000.00,''),(17,5,'Lương cơ bản',17000000.00,''),(18,5,'Phụ cấp',1000000.00,''),(19,5,'Thưởng KPI',1500000.00,''),(20,5,'Khấu trừ BHXH',1000000.00,''),(21,6,'Lương cơ bản',15000000.00,''),(22,6,'Phụ cấp',1000000.00,''),(23,6,'Thưởng KPI',1000000.00,''),(24,6,'Khấu trừ BHXH',700000.00,''),(25,7,'Lương cơ bản',10000000.00,''),(26,7,'Phụ cấp',500000.00,''),(27,7,'Thưởng KPI',500000.00,''),(28,7,'Khấu trừ BHXH',300000.00,''),(29,8,'Lương cơ bản',45000000.00,''),(30,8,'Phụ cấp',3000000.00,''),(31,8,'Thưởng KPI',2000000.00,''),(32,8,'Khấu trừ BHXH',3000000.00,''),(33,9,'Lương cơ bản',10000000.00,''),(34,9,'Phụ cấp',500000.00,''),(35,9,'Thưởng KPI',1000000.00,''),(36,9,'Khấu trừ BHXH',300000.00,''),(37,10,'Lương cơ bản',12000000.00,''),(38,10,'Phụ cấp',500000.00,''),(39,10,'Thưởng KPI',500000.00,''),(40,10,'Khấu trừ BHXH',500000.00,''),(41,11,'Lương cơ bản',11000000.00,''),(42,11,'Phụ cấp',500000.00,''),(43,11,'Thưởng KPI',500000.00,''),(44,11,'Khấu trừ BHXH',300000.00,''),(45,12,'Lương cơ bản',18000000.00,''),(46,12,'Phụ cấp',2000000.00,''),(47,12,'Thưởng KPI',1000000.00,''),(48,12,'Khấu trừ BHXH',1000000.00,''),(49,13,'Lương cơ bản',10500000.00,''),(50,13,'Phụ cấp',500000.00,''),(51,13,'Thưởng KPI',500000.00,''),(52,13,'Khấu trừ BHXH',300000.00,''),(57,15,'Lương cơ bản',12000000.00,''),(58,15,'Phụ cấp',500000.00,''),(59,15,'Thưởng KPI',500000.00,''),(60,15,'Khấu trừ BHXH',500000.00,''),(61,16,'Lương cơ bản',10000000.00,''),(62,16,'Phụ cấp',500000.00,''),(63,16,'Thưởng KPI',500000.00,''),(64,16,'Khấu trừ BHXH',300000.00,''),(65,17,'Lương cơ bản',14000000.00,''),(66,17,'Phụ cấp',1000000.00,''),(67,17,'Thưởng KPI',1000000.00,''),(68,17,'Khấu trừ BHXH',700000.00,''),(69,18,'Lương cơ bản',11000000.00,''),(70,18,'Phụ cấp',500000.00,''),(71,18,'Thưởng KPI',500000.00,''),(72,18,'Khấu trừ BHXH',300000.00,''),(73,19,'Lương cơ bản',19000000.00,''),(74,19,'Phụ cấp',2000000.00,''),(75,19,'Thưởng KPI',1000000.00,''),(76,19,'Khấu trừ BHXH',1000000.00,''),(77,20,'Lương cơ bản',9500000.00,''),(78,20,'Phụ cấp',500000.00,''),(79,20,'Thưởng KPI',500000.00,''),(80,20,'Khấu trừ BHXH',300000.00,'');
/*!40000 ALTER TABLE `chitietbangluong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chucvu`
--

DROP TABLE IF EXISTS `chucvu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chucvu` (
  `MaChucVu` int NOT NULL AUTO_INCREMENT,
  `TenChucVu` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `PhuCap` decimal(15,2) DEFAULT '0.00',
  `MoTa` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaChucVu`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chucvu`
--

LOCK TABLES `chucvu` WRITE;
/*!40000 ALTER TABLE `chucvu` DISABLE KEYS */;
INSERT INTO `chucvu` VALUES (1,'Giam Doc',5000000.00,NULL),(2,'Truong Phong',3000000.00,NULL),(3,'Nhan Vien',1000000.00,NULL),(4,'Đào Lửa',5000000.00,NULL);
/*!40000 ALTER TABLE `chucvu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donnghiphep`
--

DROP TABLE IF EXISTS `donnghiphep`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donnghiphep` (
  `MaDon` int NOT NULL AUTO_INCREMENT,
  `MaNhanVien` int NOT NULL,
  `NgayBatDau` date DEFAULT NULL,
  `NgayKetThuc` date DEFAULT NULL,
  `LyDo` text COLLATE utf8mb4_unicode_ci,
  `TrangThai` enum('ChoDuyet','DaDuyet','TuChoi') COLLATE utf8mb4_unicode_ci DEFAULT 'ChoDuyet',
  PRIMARY KEY (`MaDon`),
  KEY `FK_DNP_NV` (`MaNhanVien`),
  CONSTRAINT `FK_DNP_NV` FOREIGN KEY (`MaNhanVien`) REFERENCES `nhanvien` (`MaNhanVien`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donnghiphep`
--

LOCK TABLES `donnghiphep` WRITE;
/*!40000 ALTER TABLE `donnghiphep` DISABLE KEYS */;
INSERT INTO `donnghiphep` VALUES (1,2,'2026-07-10','2026-07-11','Nghỉ ốm','DaDuyet'),(2,4,'2026-07-15','2026-07-15','Việc gia đình','DaDuyet'),(3,5,'2026-07-18','2026-07-19','Du lịch','ChoDuyet'),(4,7,'2026-07-22','2026-07-22','Khám sức khỏe','DaDuyet'),(5,9,'2026-07-25','2026-07-25','Việc cá nhân','ChoDuyet'),(6,10,'2026-07-12','2026-07-13','Nghỉ phép năm','DaDuyet'),(7,11,'2026-07-20','2026-07-20','Đám cưới người thân','DaDuyet'),(8,12,'2026-07-27','2026-07-28','Du lịch','ChoDuyet'),(9,13,'2026-07-05','2026-07-05','Ốm','DaDuyet'),(10,14,'2026-07-30','2026-07-30','Việc cá nhân','TuChoi'),(11,15,'2026-07-08','2026-07-08','Khám bệnh','DaDuyet'),(12,16,'2026-07-17','2026-07-17','Nghỉ phép năm','DaDuyet'),(13,17,'2026-07-24','2026-07-24','Có việc đột xuất','ChoDuyet'),(14,18,'2026-07-21','2026-07-22','Du lịch','DaDuyet'),(15,19,'2026-07-16','2026-07-16','Việc gia đình','DaDuyet'),(16,20,'2026-07-29','2026-07-29','Khám sức khỏe','ChoDuyet'),(18,1,'2026-07-31','2026-08-01','Đi ăn cỗ cưới Cristiano Ronaldo','ChoDuyet');
/*!40000 ALTER TABLE `donnghiphep` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hopdong`
--

DROP TABLE IF EXISTS `hopdong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hopdong` (
  `MaHopDong` int NOT NULL AUTO_INCREMENT,
  `MaNhanVien` int NOT NULL,
  `LoaiHopDong` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NgayBatDau` date DEFAULT NULL,
  `NgayKetThuc` date DEFAULT NULL,
  `LuongCoBan` decimal(15,2) DEFAULT NULL,
  PRIMARY KEY (`MaHopDong`),
  KEY `FK_HD_NV` (`MaNhanVien`),
  CONSTRAINT `FK_HD_NV` FOREIGN KEY (`MaNhanVien`) REFERENCES `nhanvien` (`MaNhanVien`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hopdong`
--

LOCK TABLES `hopdong` WRITE;
/*!40000 ALTER TABLE `hopdong` DISABLE KEYS */;
INSERT INTO `hopdong` VALUES (1,1,'Hợp đồng không xác định thời hạn','2023-01-10',NULL,30000000.00),(2,2,'Hợp đồng 3 năm','2023-02-15','2026-02-14',12000000.00),(4,4,'Hợp đồng 2 năm','2024-01-03','2026-01-02',11000000.00),(5,5,'Hợp đồng 3 năm','2021-08-12','2024-08-11',17000000.00),(6,6,'Hợp đồng không xác định thời hạn','2020-04-05',NULL,15000000.00),(7,7,'Hợp đồng 2 năm','2023-07-01','2025-06-30',10000000.00),(8,8,'Hợp đồng không xác định thời hạn','2019-11-11',NULL,45000000.00),(9,9,'Hợp đồng 2 năm','2024-03-01','2026-02-28',10000000.00),(10,10,'Hợp đồng 3 năm','2022-06-06','2025-06-05',12000000.00),(11,11,'Hợp đồng 2 năm','2023-09-18','2025-09-17',11000000.00),(12,12,'Hợp đồng không xác định thời hạn','2022-12-20',NULL,18000000.00),(13,13,'Hợp đồng 2 năm','2024-02-15','2026-02-14',10500000.00),(14,14,'Hợp đồng không xác định thời hạn','2018-03-05',NULL,20000000.00),(15,15,'Hợp đồng 3 năm','2021-10-01','2024-09-30',12000000.00),(16,16,'Hợp đồng 2 năm','2023-05-08','2025-05-07',10000000.00),(17,17,'Hợp đồng không xác định thời hạn','2020-07-15',NULL,14000000.00),(18,18,'Hợp đồng 3 năm','2022-11-28','2025-11-27',11000000.00),(19,19,'Hợp đồng không xác định thời hạn','2019-09-09',NULL,19000000.00),(20,20,'Hợp đồng 2 năm','2024-04-01','2026-03-31',9500000.00);
/*!40000 ALTER TABLE `hopdong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khenthuongkyluat`
--

DROP TABLE IF EXISTS `khenthuongkyluat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khenthuongkyluat` (
  `MaKTKL` int NOT NULL AUTO_INCREMENT,
  `MaNhanVien` int NOT NULL,
  `Loai` enum('Thuong','KyLuat') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SoTien` decimal(15,2) DEFAULT NULL,
  `LyDo` text COLLATE utf8mb4_unicode_ci,
  `Ngay` date DEFAULT NULL,
  PRIMARY KEY (`MaKTKL`),
  KEY `FK_KTKL_NV` (`MaNhanVien`),
  CONSTRAINT `FK_KTKL_NV` FOREIGN KEY (`MaNhanVien`) REFERENCES `nhanvien` (`MaNhanVien`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khenthuongkyluat`
--

LOCK TABLES `khenthuongkyluat` WRITE;
/*!40000 ALTER TABLE `khenthuongkyluat` DISABLE KEYS */;
INSERT INTO `khenthuongkyluat` VALUES (4,4,'KyLuat',300000.00,'Đi muộn nhiều lần','2026-07-31'),(5,5,'Thuong',1500000.00,'Doanh số tốt','2026-07-31'),(6,6,'Thuong',1000000.00,'Hỗ trợ đồng nghiệp','2026-07-31'),(7,7,'KyLuat',200000.00,'Nghỉ không báo trước','2026-07-31'),(8,8,'Thuong',5000000.00,'Lãnh đạo xuất sắc','2026-07-31'),(9,9,'Thuong',500000.00,'Hoàn thành KPI','2026-07-31'),(10,10,'KyLuat',300000.00,'Đi muộn','2026-07-31'),(12,12,'Thuong',2000000.00,'Quản lý tốt phòng ban','2026-07-31'),(13,13,'Thuong',500000.00,'Làm việc hiệu quả','2026-07-31'),(14,14,'Thuong',2500000.00,'Hoàn thành dự án lớn','2026-07-31'),(15,15,'KyLuat',200000.00,'Đi muộn nhiều lần','2026-07-31'),(16,16,'Thuong',700000.00,'Làm việc tích cực','2026-07-31'),(17,17,'Thuong',1200000.00,'Tăng ca hỗ trợ dự án','2026-07-31'),(18,18,'Thuong',1000000.00,'Đạt KPI tháng','2026-07-31'),(19,19,'Thuong',2000000.00,'Quản lý tốt nhân viên','2026-07-31'),(20,20,'Thuong',500000.00,'Hoàn thành công việc','2026-07-31'),(21,1,'Thuong',7000000.00,'Quá đẳng cấp','2026-07-31'),(22,1,'Thuong',5000000.00,'Quá đẳng cấp ','2026-07-31');
/*!40000 ALTER TABLE `khenthuongkyluat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhanvien`
--

DROP TABLE IF EXISTS `nhanvien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhanvien` (
  `MaNhanVien` int NOT NULL AUTO_INCREMENT,
  `MaNV` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `HoTen` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `GioiTinh` enum('Nam','Nu') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NgaySinh` date DEFAULT NULL,
  `DienThoai` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CCCD` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DiaChi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NgayVaoLam` date DEFAULT NULL,
  `MaPhongBan` int DEFAULT NULL,
  `MaChucVu` int DEFAULT NULL,
  `TrangThai` enum('DangLam','NghiViec') COLLATE utf8mb4_unicode_ci DEFAULT 'DangLam',
  `Avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaNhanVien`),
  UNIQUE KEY `MaNV` (`MaNV`),
  KEY `IDX_NV_PHONGBAN` (`MaPhongBan`),
  KEY `IDX_NV_CHUCVU` (`MaChucVu`),
  CONSTRAINT `FK_NV_CV` FOREIGN KEY (`MaChucVu`) REFERENCES `chucvu` (`MaChucVu`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_NV_PB` FOREIGN KEY (`MaPhongBan`) REFERENCES `phongban` (`MaPhongBan`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhanvien`
--

LOCK TABLES `nhanvien` WRITE;
/*!40000 ALTER TABLE `nhanvien` DISABLE KEYS */;
INSERT INTO `nhanvien` VALUES (1,'NV001','Phạm Văn Vũ','Nam','1995-03-12','0901000001','an@hatechno.vn','001001001001','Hà Nội','2023-01-10',3,3,'DangLam','/uploads/avatars/avatar-1785466462827-678126206.jpg'),(2,'NV002','Trần Thị Bình','Nu','1997-07-21','0901000002','binh@hatechno.vn','001001001002','Hà Nội','2023-02-15',2,3,'DangLam',NULL),(4,'NV004','Phạm Thu Dung','Nu','1998-05-14','0901000004','dung@hatechno.vn','001001001004','Quảng Ninh','2024-01-03',4,3,'DangLam',NULL),(5,'NV005','Hoàng Đức Anh','Nam','1996-09-30','0901000005','anh@hatechno.vn','001001001005','Hà Nội','2021-08-12',5,2,'DangLam',NULL),(6,'NV006','Đỗ Hải Long','Nam','1993-02-17','0901000006','long@hatechno.vn','001001001006','Bắc Ninh','2020-04-05',3,3,'DangLam',NULL),(7,'NV007','Vũ Thanh Mai','Nu','1999-01-20','0901000007','mai@hatechno.vn','001001001007','Hà Nội','2023-07-01',2,3,'DangLam',NULL),(8,'NV008','Nguyễn Quốc Huy','Nam','1992-06-25','0901000008','huy@hatechno.vn','001001001008','Hải Dương','2019-11-11',1,1,'DangLam',NULL),(9,'NV009','Trịnh Thu Hà','Nu','1997-10-10','0901000009','ha@hatechno.vn','001001001009','Nam Định','2024-03-01',4,3,'DangLam',NULL),(10,'NV010','Bùi Văn Nam','Nam','1995-12-18','0901000010','nam@hatechno.vn','001001001010','Hà Nội','2022-06-06',5,3,'DangLam',NULL),(11,'NV011','Phan Minh Đức','Nam','1998-08-22','0901000011','duc@hatechno.vn','001001001011','Hà Nam','2023-09-18',3,3,'DangLam',NULL),(12,'NV012','Lý Thu Trang','Nu','1996-04-15','0901000012','trang@hatechno.vn','001001001012','Hà Nội','2022-12-20',2,2,'DangLam',NULL),(13,'NV013','Nguyễn Khánh Linh','Nu','1999-09-09','0901000013','linh@hatechno.vn','001001001013','Quảng Ninh','2024-02-15',4,3,'DangLam',NULL),(14,'NV014','Đặng Hoàng Sơn','Nam','1991-07-27','0901000014','son@hatechno.vn','001001001014','Hưng Yên','2018-03-05',3,2,'DangLam',NULL),(15,'NV015','Tạ Minh Quân','Nam','1994-05-11','0901000015','quan@hatechno.vn','001001001015','Hà Nội','2021-10-01',5,3,'DangLam',NULL),(16,'NV016','Ngô Thu Hương','Nu','1998-12-30','0901000016','huong@hatechno.vn','001001001016','Bắc Giang','2023-05-08',2,3,'DangLam',NULL),(17,'NV017','Lưu Văn Phúc','Nam','1995-01-04','0901000017','phuc@hatechno.vn','001001001017','Hải Phòng','2020-07-15',3,3,'DangLam',NULL),(18,'NV018','Mai Ngọc Ánh','Nu','1997-03-29','0901000018','ngocanh@hatechno.vn','001001001018','Hà Nội','2022-11-28',4,3,'DangLam',NULL),(19,'NV019','Trần Văn Khánh','Nam','1993-11-13','0901000019','khanh@hatechno.vn','001001001019','Thái Bình','2019-09-09',5,2,'DangLam',NULL),(20,'NV020','Phạm Thị Yến','Nu','1999-06-18','0901000020','yen@hatechno.vn','001001001020','Hà Nội','2024-04-01',2,3,'DangLam',NULL),(21,'NV25','Nguyễn Đỗ Hiền Nam',NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-30',NULL,2,'DangLam',NULL);
/*!40000 ALTER TABLE `nhanvien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phongban`
--

DROP TABLE IF EXISTS `phongban`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phongban` (
  `MaPhongBan` int NOT NULL AUTO_INCREMENT,
  `TenPhongBan` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MoTa` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TruongPhong` int DEFAULT NULL,
  PRIMARY KEY (`MaPhongBan`),
  KEY `FK_PB_TruongPhong` (`TruongPhong`),
  CONSTRAINT `FK_PB_TruongPhong` FOREIGN KEY (`TruongPhong`) REFERENCES `nhanvien` (`MaNhanVien`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phongban`
--

LOCK TABLES `phongban` WRITE;
/*!40000 ALTER TABLE `phongban` DISABLE KEYS */;
INSERT INTO `phongban` VALUES (1,'Ban Giam Doc',NULL,1),(2,'Phong Nhan Su',NULL,14),(3,'Phong CNTT',NULL,8),(4,'Phong Marketing',NULL,6),(5,'Phong Ke Toan',NULL,13),(6,'Đào Lửa',NULL,21);
/*!40000 ALTER TABLE `phongban` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quyen`
--

DROP TABLE IF EXISTS `quyen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quyen` (
  `MaQuyen` int NOT NULL AUTO_INCREMENT,
  `TenQuyen` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MoTa` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaQuyen`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quyen`
--

LOCK TABLES `quyen` WRITE;
/*!40000 ALTER TABLE `quyen` DISABLE KEYS */;
INSERT INTO `quyen` VALUES (1,'Admin','Quan tri'),(2,'NhanSu','Quan ly nhan su'),(3,'NhanVien','Nhan vien');
/*!40000 ALTER TABLE `quyen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taikhoan`
--

DROP TABLE IF EXISTS `taikhoan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taikhoan` (
  `MaTaiKhoan` int NOT NULL AUTO_INCREMENT,
  `TenDangNhap` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MatKhau` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaNhanVien` int DEFAULT NULL,
  `MaQuyen` int NOT NULL,
  `TrangThai` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`MaTaiKhoan`),
  UNIQUE KEY `TenDangNhap` (`TenDangNhap`),
  UNIQUE KEY `MaNhanVien` (`MaNhanVien`),
  KEY `FK_TK_Q` (`MaQuyen`),
  CONSTRAINT `FK_TK_NV` FOREIGN KEY (`MaNhanVien`) REFERENCES `nhanvien` (`MaNhanVien`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_TK_Q` FOREIGN KEY (`MaQuyen`) REFERENCES `quyen` (`MaQuyen`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taikhoan`
--

LOCK TABLES `taikhoan` WRITE;
/*!40000 ALTER TABLE `taikhoan` DISABLE KEYS */;
INSERT INTO `taikhoan` VALUES (1,'admin','123456',1,1,1),(2,'hr01','123456',2,2,1),(4,'marketing01','123456',4,2,1),(5,'ketoan01','123456',5,2,1),(6,'nv006','123456',6,3,1),(7,'nv007','123456',7,3,1),(8,'giamdoc','123456',8,1,1),(9,'nv009','123456',9,3,1),(10,'nv010','123456',10,3,1),(11,'nv011','123456',11,3,1),(12,'tpnhansu','123456',12,2,1),(13,'nv013','123456',13,3,1),(14,'tpcntt','123456',14,2,1),(15,'nv015','123456',15,3,1),(16,'nv016','123456',16,3,1),(17,'nv017','123456',17,3,1),(18,'nv018','123456',18,3,1),(19,'tpketoan','123456',19,2,1),(20,'nv020','123456',20,3,1);
/*!40000 ALTER TABLE `taikhoan` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-31 15:53:21
