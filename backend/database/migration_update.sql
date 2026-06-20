-- ============================================================
-- Migration AMBAchamp - update kolom kontak, tipe penyelenggara, kategori baru
-- Jalankan di phpMyAdmin > pilih db ambachamp > tab SQL > paste > Go
-- Aman dijalankan berkali-kali.
-- ============================================================

USE ambachamp;

-- ---- users: phone, whatsapp, tipe penyelenggara, nama organisasi ----
SET @c := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='ambachamp' AND TABLE_NAME='users' AND COLUMN_NAME='phone');
SET @q := IF(@c=0,'ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL AFTER email','SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

SET @c := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='ambachamp' AND TABLE_NAME='users' AND COLUMN_NAME='whatsapp');
SET @q := IF(@c=0,'ALTER TABLE users ADD COLUMN whatsapp VARCHAR(20) NULL AFTER phone','SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

SET @c := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='ambachamp' AND TABLE_NAME='users' AND COLUMN_NAME='tipe_penyelenggara');
SET @q := IF(@c=0,"ALTER TABLE users ADD COLUMN tipe_penyelenggara ENUM('individu','organisasi') NULL AFTER role",'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

SET @c := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='ambachamp' AND TABLE_NAME='users' AND COLUMN_NAME='nama_organisasi');
SET @q := IF(@c=0,'ALTER TABLE users ADD COLUMN nama_organisasi VARCHAR(150) NULL AFTER tipe_penyelenggara','SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

-- ---- lomba: link_sosmed, contact_person ----
SET @c := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='ambachamp' AND TABLE_NAME='lomba' AND COLUMN_NAME='link_sosmed');
SET @q := IF(@c=0,'ALTER TABLE lomba ADD COLUMN link_sosmed VARCHAR(500) NULL AFTER link_pendaftaran','SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

SET @c := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='ambachamp' AND TABLE_NAME='lomba' AND COLUMN_NAME='contact_person');
SET @q := IF(@c=0,'ALTER TABLE lomba ADD COLUMN contact_person VARCHAR(150) NULL AFTER link_sosmed','SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

-- ---- lomba: ganti enum kategori ke 4 kategori baru ----
-- catatan: data kategori lama bakal jadi kosong/invalid, isi ulang manual kalau ada.
ALTER TABLE lomba MODIFY COLUMN kategori
  ENUM('teknologi_digital','sains_riset','olahraga','seni_kreatif') NOT NULL;

SELECT 'Migration selesai' AS status;
