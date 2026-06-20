-- jalanin ini di phpMyAdmin tab SQL, aman dijalanin berkali-kali
-- gunanya buat ngecek + masukin ulang akun admin kalau kehapus/ke-skip

USE ambachamp;

-- cek dulu apakah akun admin udah ada
SELECT id, nama, email, role FROM users WHERE email = 'admin@ambachamp.id';

-- reset/insert akun admin default
INSERT INTO users (nama, email, password, role)
SELECT 'Admin AMBAchamp', 'admin@ambachamp.id',
       '$2a$10$1.IXaHuKrIGLq0nKRYnG9OycqIUdddugAKIleqh0vkUppCmvOnebm', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@ambachamp.id');

UPDATE users
SET nama = 'Admin AMBAchamp',
    password = '$2a$10$1.IXaHuKrIGLq0nKRYnG9OycqIUdddugAKIleqh0vkUppCmvOnebm',
    role = 'admin',
    is_active = TRUE
WHERE email = 'admin@ambachamp.id';

-- cek lagi buat mastiin udah masuk
SELECT id, nama, email, role, is_active FROM users WHERE email = 'admin@ambachamp.id';
