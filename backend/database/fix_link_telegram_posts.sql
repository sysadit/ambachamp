-- ============================================================
-- FIX: tambah kolom link_telegram di teammate_posts
-- Ini penyebab "Terjadi kesalahan server" saat Buat Lowongan Tim.
-- Migration telegram sebelumnya keliru menambah ke tabel
-- teammate_applications, padahal kode butuhnya di teammate_posts.
--
-- Cara jalankan di VM:
--   sudo mysql ambachamp < fix_link_telegram_posts.sql
-- atau lewat phpMyAdmin: pilih db ambachamp > tab SQL > paste > Go
-- Aman dijalankan berkali-kali.
-- ============================================================

USE ambachamp;

SET @c := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'ambachamp'
    AND TABLE_NAME   = 'teammate_posts'
    AND COLUMN_NAME  = 'link_telegram');

SET @q := IF(@c = 0,
  'ALTER TABLE teammate_posts ADD COLUMN link_telegram VARCHAR(255) NULL AFTER jumlah_anggota_max',
  'SELECT 1');

PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

SELECT 'OK - kolom link_telegram di teammate_posts sudah ada' AS status;
