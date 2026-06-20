-- ============================================================
-- Migration: kolom kontak, tipe penyelenggara, kategori baru
-- Jalankan di phpMyAdmin > tab SQL. Aman dijalankan berkali-kali.
-- ============================================================

USE ambachamp;

-- helper: tambah kolom kalau belum ada
DROP PROCEDURE IF EXISTS add_col;
DELIMITER //
CREATE PROCEDURE add_col(IN tbl VARCHAR(64), IN col VARCHAR(64), IN def TEXT)
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = 'ambachamp' AND TABLE_NAME = tbl AND COLUMN_NAME = col
  ) THEN
    SET @q = CONCAT('ALTER TABLE ', tbl, ' ADD COLUMN ', col, ' ', def);
    PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;
  END IF;
END //
DELIMITER ;

CALL add_col('users', 'phone', 'VARCHAR(20) NULL AFTER email');
CALL add_col('users', 'whatsapp', 'VARCHAR(20) NULL AFTER phone');
CALL add_col('users', 'tipe_penyelenggara', "ENUM('individu','organisasi') NULL AFTER role");
CALL add_col('users', 'nama_organisasi', 'VARCHAR(150) NULL AFTER tipe_penyelenggara');
CALL add_col('lomba', 'link_sosmed', 'VARCHAR(500) NULL AFTER link_pendaftaran');
CALL add_col('lomba', 'contact_person', 'VARCHAR(150) NULL AFTER link_sosmed');

DROP PROCEDURE add_col;

-- ganti enum kategori ke 4 kategori baru
ALTER TABLE lomba MODIFY COLUMN kategori
  ENUM('teknologi_digital','sains_riset','olahraga','seni_kreatif') NOT NULL;

SELECT 'Migration selesai' AS status;
