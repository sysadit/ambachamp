-- ============================================================
-- Migration AMBAchamp - tambah link_telegram di teammate_applications
-- Jalankan di phpMyAdmin > pilih db ambachamp > tab SQL > paste > Go
-- Aman dijalankan berkali-kali.
-- ============================================================

USE ambachamp;

SET @c := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA='ambachamp' AND TABLE_NAME='teammate_applications' AND COLUMN_NAME='link_telegram');
SET @q := IF(@c=0,'ALTER TABLE teammate_applications ADD COLUMN link_telegram VARCHAR(255) NULL AFTER pesan','SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

SELECT 'Migration telegram selesai' AS status;
