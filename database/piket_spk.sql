-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 29, 2026 at 08:43 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `piket_spk`
--

-- --------------------------------------------------------

--
-- Table structure for table `anggota`
--

CREATE TABLE `anggota` (
  `id` int NOT NULL,
  `sn` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nim` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis_kelamin` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '123456',
  `file_krs` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_jadwal` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `anggota`
--

INSERT INTO `anggota` (`id`, `sn`, `nim`, `nama`, `jenis_kelamin`, `password`, `file_krs`, `status_jadwal`) VALUES
(3, 'SN. A13-020', '2311512025', 'Naufal Rafiif Irwan', 'L', '123456', NULL, 'draft'),
(4, 'SN. A13-019', '2311512009', 'Naela Amira Najwa Efendi', 'P', '123456', NULL, 'draft'),
(5, 'SN. A13-023', '2311512007', 'Rizki Dafa Naldi', 'L', '123456', NULL, 'draft'),
(6, 'SN. A14-001', '2311122042', 'Adzra Lathifa', 'P', '123456', NULL, 'draft'),
(7, 'SN. A14-002', '2411521002', 'Alfi Zikri', 'L', '123456', NULL, 'draft'),
(8, 'SN. A14-003', '2411511012', 'Alif Ilham Permata', 'L', '123456', NULL, 'draft'),
(9, 'SN. A14-004', '2410532042', 'Alvina Roslinda', 'P', '123456', NULL, 'draft'),
(10, 'SN. A14-005', '2411523006', 'Alya Salsa Nabila', 'P', '123456', NULL, 'draft'),
(11, 'SN. A14-006', '2311121017', 'Amara Marshinta', 'P', '123456', NULL, 'draft'),
(12, 'SN. A14-007', '2411532011', 'Aufan Taufiqurrahman', 'L', '123456', NULL, 'draft'),
(13, 'SN. A14-008', '2310432022', 'Azlin Fahira', 'P', '123456', NULL, 'draft'),
(14, 'SN. A14-009', '2410533026', 'Daffa Miftahul Hansyaf', 'L', '123456', NULL, 'draft'),
(15, 'SN. A14-010', '2411522016', 'Dea Arlia', 'P', '123456', NULL, 'draft'),
(16, 'SN. A14-011', '2411521001', 'Dhyva Aulia Hendri', 'P', '123456', NULL, 'draft'),
(17, 'SN. A14-012', '2311122015', 'Dwi Rani Putri Jonet', 'P', '123456', NULL, 'draft'),
(18, 'SN. A14-013', '2311523004', 'Fachri Akbar', 'L', '123456', NULL, 'draft'),
(19, 'SN. A14-014', '2411521009', 'Farrel Ghufran Rahman', 'L', '123456', NULL, 'draft'),
(20, 'SN. A14-015', '2410953003', 'Fathurrahman Ahmadi', 'L', '123456', NULL, 'draft'),
(21, 'SN. A14-016', '2411523012', 'Fazila Hassana Rahmat', 'P', '123456', NULL, 'draft'),
(22, 'SN. A14-018', '2411512007', 'Hafid Fitrah Ramadhan', 'L', '123456', NULL, 'draft'),
(23, 'SN. A14-019', '2311121020', 'Isma Desra Dini Sari', 'P', '123456', NULL, 'draft'),
(24, 'SN. A14-020', '2411513018', 'Izzatul Mahdiyah', 'P', '123456', NULL, 'draft'),
(25, 'SN. A14-021', '2410431021', 'Java Maulana', 'L', '123456', NULL, 'draft'),
(26, 'SN. A14-022', '2411522006', 'Kevin Rahmat Illahi', 'L', '123456', NULL, 'draft'),
(27, 'SN. A14-023', '2311522022', 'Laila Qadriyah', 'P', '123456', NULL, 'draft'),
(28, 'SN. A14-024', '2310822036', 'Lian Indah Maharani', 'P', '123456', NULL, 'draft'),
(29, 'SN. A14-025', '2410911032', 'Muhammad Bagas Yusron', 'L', '123456', NULL, 'draft'),
(30, 'SN. A14-026', '2311532009', 'Muhammad Dawi Syauqi', 'L', '123456', NULL, 'draft'),
(31, 'SN. A14-027', '2411522024', 'Muhammad Habib', 'L', '123456', NULL, 'draft'),
(32, 'SN. A14-028', '2411522035', 'Muhammad Zada Aufa Ningrat', 'L', '123456', NULL, 'draft'),
(33, 'SN. A14-029', '2411512015', 'Muhammad Zaki', 'L', '123456', NULL, 'draft'),
(34, 'SN. A14-030', '2410962004', 'Nabilah Macika Parelia', 'P', '123456', NULL, 'draft'),
(35, 'SN. A14-031', '2311513038', 'Novalino', 'L', '123456', NULL, 'draft'),
(36, 'SN. A14-032', '2311512036', 'Rahmat Fajar Saputra', 'L', '123456', NULL, 'draft'),
(37, 'SN. A14-033', '2411522030', 'Rangga Arsya Bima', 'L', '123456', NULL, 'approved'),
(38, 'SN. A14-034', '2411512030', 'Rayhan Habibi', 'L', '123456', NULL, 'draft'),
(39, 'SN. A14-035', '2311532014', 'Reynard Ghazy Tsaqif', 'L', '123456', NULL, 'draft'),
(40, 'SN. A14-036', '2411523020', 'Sheva Ramadhan', 'L', '123456', NULL, 'draft'),
(41, 'SN. A14-037', '2311523036', 'Varissa Anzani Badri', 'P', '123456', NULL, 'draft'),
(42, 'SN. A14-038', '2311523006', 'Zhahra ‘Idhya Astwoti', 'P', '123456', NULL, 'draft');

-- --------------------------------------------------------

--
-- Table structure for table `jadwalhari`
--

CREATE TABLE `jadwalhari` (
  `id` int NOT NULL,
  `anggotaId` int NOT NULL,
  `hari` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shift1` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'kosong',
  `shift2` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'kosong',
  `shift3` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'kosong',
  `shift4` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'kosong',
  `sks` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jadwalhari`
--

INSERT INTO `jadwalhari` (`id`, `anggotaId`, `hari`, `shift1`, `shift2`, `shift3`, `shift4`, `sks`) VALUES
(21, 3, 'senin', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(22, 3, 'selasa', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(23, 3, 'rabu', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(24, 3, 'kamis', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(25, 3, 'jumat', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(26, 4, 'senin', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(27, 4, 'selasa', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(28, 4, 'rabu', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(29, 4, 'kamis', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(30, 4, 'jumat', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(31, 5, 'senin', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(32, 5, 'selasa', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(33, 5, 'rabu', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(34, 5, 'kamis', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(35, 5, 'jumat', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(36, 6, 'senin', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(37, 6, 'selasa', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(38, 6, 'rabu', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(39, 6, 'kamis', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(40, 6, 'jumat', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(41, 7, 'senin', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(42, 7, 'selasa', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(43, 7, 'rabu', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(44, 7, 'kamis', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(45, 7, 'jumat', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(46, 8, 'senin', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(47, 8, 'selasa', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(48, 8, 'rabu', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(49, 8, 'kamis', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(50, 8, 'jumat', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(51, 9, 'senin', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(52, 9, 'selasa', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(53, 9, 'rabu', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(54, 9, 'kamis', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(55, 9, 'jumat', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(56, 10, 'senin', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(57, 10, 'selasa', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(58, 10, 'rabu', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(59, 10, 'kamis', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(60, 10, 'jumat', 'kosong', 'kosong', 'kosong', 'kosong', 0),
(61, 37, 'senin', 'kegiatan', 'kegiatan', 'kegiatan', 'kegiatan', 0),
(62, 37, 'selasa', 'kegiatan', 'kegiatan', 'kegiatan', 'kegiatan', 0),
(63, 37, 'rabu', 'kegiatan', 'kegiatan', 'kegiatan', 'kegiatan', 0),
(64, 37, 'kamis', 'kegiatan', 'kegiatan', 'kegiatan', 'kegiatan', 0),
(65, 37, 'jumat', 'kegiatan', 'kegiatan', 'kegiatan', 'kegiatan', 0);

-- --------------------------------------------------------

--
-- Table structure for table `kelaskrs`
--

CREATE TABLE `kelaskrs` (
  `id` int NOT NULL,
  `jadwalId` int NOT NULL,
  `namaMatkul` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jamMulai` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jamSelesai` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kriteria`
--

CREATE TABLE `kriteria` (
  `id` int NOT NULL,
  `kode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bobot` double NOT NULL,
  `tipe` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kriteria`
--

INSERT INTO `kriteria` (`id`, `kode`, `nama`, `bobot`, `tipe`, `deskripsi`) VALUES
(1, 'C1', 'Kekosongan (Kosong=5, Isi=1)', 0.5, 'benefit', NULL),
(2, 'C2', 'Jeda / Jam Kosong', 0.25, 'benefit', NULL),
(3, 'C3', 'Beban SKS Hari Ini', 0.15, 'cost', NULL),
(4, 'C4', 'Gender (Penyesuaian Shift)', 0.1, 'benefit', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pengaturansistem`
--

CREATE TABLE `pengaturansistem` (
  `id` int NOT NULL,
  `nama_pengaturan` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'buka',
  `batas_waktu` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pengaturansistem`
--

INSERT INTO `pengaturansistem` (`id`, `nama_pengaturan`, `status`, `batas_waktu`) VALUES
(1, 'PERIODE_ISI_JADWAL', 'buka', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `penugasanpiket`
--

CREATE TABLE `penugasanpiket` (
  `id` int NOT NULL,
  `anggotaId` int NOT NULL,
  `hari` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shift` int NOT NULL,
  `tanggal` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `anggota`
--
ALTER TABLE `anggota`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Anggota_sn_key` (`sn`),
  ADD UNIQUE KEY `Anggota_nim_key` (`nim`);

--
-- Indexes for table `jadwalhari`
--
ALTER TABLE `jadwalhari`
  ADD PRIMARY KEY (`id`),
  ADD KEY `JadwalHari_anggotaId_fkey` (`anggotaId`);

--
-- Indexes for table `kelaskrs`
--
ALTER TABLE `kelaskrs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `KelasKRS_jadwalId_fkey` (`jadwalId`);

--
-- Indexes for table `kriteria`
--
ALTER TABLE `kriteria`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Kriteria_kode_key` (`kode`);

--
-- Indexes for table `pengaturansistem`
--
ALTER TABLE `pengaturansistem`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `PengaturanSistem_nama_pengaturan_key` (`nama_pengaturan`);

--
-- Indexes for table `penugasanpiket`
--
ALTER TABLE `penugasanpiket`
  ADD PRIMARY KEY (`id`),
  ADD KEY `PenugasanPiket_anggotaId_fkey` (`anggotaId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `anggota`
--
ALTER TABLE `anggota`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `jadwalhari`
--
ALTER TABLE `jadwalhari`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `kelaskrs`
--
ALTER TABLE `kelaskrs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `kriteria`
--
ALTER TABLE `kriteria`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `pengaturansistem`
--
ALTER TABLE `pengaturansistem`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `penugasanpiket`
--
ALTER TABLE `penugasanpiket`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `jadwalhari`
--
ALTER TABLE `jadwalhari`
  ADD CONSTRAINT `JadwalHari_anggotaId_fkey` FOREIGN KEY (`anggotaId`) REFERENCES `anggota` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `kelaskrs`
--
ALTER TABLE `kelaskrs`
  ADD CONSTRAINT `KelasKRS_jadwalId_fkey` FOREIGN KEY (`jadwalId`) REFERENCES `jadwalhari` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `penugasanpiket`
--
ALTER TABLE `penugasanpiket`
  ADD CONSTRAINT `PenugasanPiket_anggotaId_fkey` FOREIGN KEY (`anggotaId`) REFERENCES `anggota` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
