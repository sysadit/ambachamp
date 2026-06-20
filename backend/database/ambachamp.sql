-- ============================================================
-- AMBAchamp - Database Schema
-- Platform Informasi Lomba Mahasiswa - Capuchino4life
-- ============================================================

CREATE DATABASE IF NOT EXISTS ambachamp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ambachamp;

-- ============================================================
-- TABLE: users
-- Menyimpan semua pengguna: mahasiswa, penyelenggara, admin
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  nama          VARCHAR(100)  NOT NULL,
  email         VARCHAR(100)  NOT NULL UNIQUE,
  phone         VARCHAR(20)   NULL,
  whatsapp      VARCHAR(20)   NULL,
  password      VARCHAR(255)  NOT NULL,
  role          ENUM('mahasiswa', 'penyelenggara', 'admin') DEFAULT 'mahasiswa',
  tipe_penyelenggara ENUM('individu','organisasi') NULL COMMENT 'Khusus penyelenggara',
  nama_organisasi VARCHAR(150) NULL COMMENT 'Diisi kalau penyelenggara organisasi',
  nim           VARCHAR(20)   NULL COMMENT 'Khusus mahasiswa',
  jurusan       VARCHAR(100)  NULL,
  foto_profil   VARCHAR(255)  NULL,
  bio           TEXT          NULL,
  prestasi      TEXT          NULL COMMENT 'JSON array riwayat prestasi',
  is_active     BOOLEAN       DEFAULT TRUE,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: lomba
-- Menyimpan informasi kompetisi yang diunggah penyelenggara
-- ============================================================
CREATE TABLE IF NOT EXISTS lomba (
  id                    INT PRIMARY KEY AUTO_INCREMENT,
  judul                 VARCHAR(200)  NOT NULL,
  deskripsi             TEXT          NOT NULL,
  kategori              ENUM('teknologi_digital','sains_riset','olahraga','seni_kreatif') NOT NULL,
  tingkat               ENUM('kampus','nasional','internasional') NOT NULL,
  biaya_pendaftaran     INT           DEFAULT 0 COMMENT 'Rp, 0 = gratis',
  deadline_pendaftaran  DATE          NOT NULL,
  tanggal_pelaksanaan   DATE          NULL,
  poster                VARCHAR(255)  NULL,
  link_pendaftaran      VARCHAR(500)  NULL,
  link_sosmed           VARCHAR(500)  NULL,
  contact_person        VARCHAR(150)  NULL,
  penyelenggara_id      INT           NOT NULL,
  status                ENUM('pending','verified','rejected') DEFAULT 'pending',
  alasan_penolakan      TEXT          NULL COMMENT 'Diisi admin jika rejected',
  created_at            TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (penyelenggara_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- TABLE: wishlist
-- Menyimpan lomba yang di-save oleh mahasiswa
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlist (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  user_id     INT NOT NULL,
  lomba_id    INT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_wishlist (user_id, lomba_id),
  FOREIGN KEY (user_id)  REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (lomba_id) REFERENCES lomba(id) ON DELETE CASCADE
);

-- ============================================================
-- TABLE: teammate_posts
-- Post pencarian anggota tim untuk lomba tertentu
-- ============================================================
CREATE TABLE IF NOT EXISTS teammate_posts (
  id                  INT PRIMARY KEY AUTO_INCREMENT,
  lomba_id            INT           NOT NULL,
  pembuat_id          INT           NOT NULL,
  judul               VARCHAR(200)  NOT NULL,
  deskripsi           TEXT          NOT NULL,
  posisi_dibutuhkan   TEXT          NOT NULL COMMENT 'JSON array of {posisi, jumlah, keahlian}',
  jumlah_anggota_max  INT           DEFAULT 3,
  status              ENUM('open','closed') DEFAULT 'open',
  created_at          TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lomba_id)    REFERENCES lomba(id)  ON DELETE CASCADE,
  FOREIGN KEY (pembuat_id)  REFERENCES users(id)  ON DELETE CASCADE
);

-- ============================================================
-- TABLE: teammate_applications
-- Lamaran pelamar ke sebuah teammate post
-- ============================================================
CREATE TABLE IF NOT EXISTS teammate_applications (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  post_id     INT           NOT NULL,
  pelamar_id  INT           NOT NULL,
  posisi      VARCHAR(100)  NOT NULL,
  pesan       TEXT          NULL,
  status      ENUM('pending','diterima','ditolak') DEFAULT 'pending',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_application (post_id, pelamar_id),
  FOREIGN KEY (post_id)    REFERENCES teammate_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (pelamar_id) REFERENCES users(id)         ON DELETE CASCADE
);

-- ============================================================
-- TABLE: notifikasi
-- Notifikasi per user (deadline, update status, dll)
-- ============================================================
CREATE TABLE IF NOT EXISTS notifikasi (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  user_id     INT           NOT NULL,
  judul       VARCHAR(200)  NOT NULL,
  pesan       TEXT          NOT NULL,
  tipe        ENUM('deadline','verifikasi','teammate','sistem') DEFAULT 'sistem',
  is_read     BOOLEAN       DEFAULT FALSE,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- SEED DATA: Admin default
-- Password: admin123 (akan di-hash oleh bcrypt saat runtime)
-- ============================================================
INSERT INTO users (nama, email, password, role) VALUES
('Admin AMBAchamp', 'admin@ambachamp.id', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
-- Password di atas = 'password' dalam bcrypt hash
-- Ganti password setelah pertama login via API

-- ============================================================
-- INDEX untuk performa query
-- ============================================================
CREATE INDEX idx_lomba_status    ON lomba(status);
CREATE INDEX idx_lomba_kategori  ON lomba(kategori);
CREATE INDEX idx_lomba_deadline  ON lomba(deadline_pendaftaran);
CREATE INDEX idx_notif_user      ON notifikasi(user_id, is_read);
CREATE INDEX idx_wishlist_user   ON wishlist(user_id);
