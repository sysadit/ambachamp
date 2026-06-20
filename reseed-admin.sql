-- jalanin ini di phpMyAdmin tab SQL, aman dijalanin berkali-kali
-- gunanya buat ngecek + masukin ulang akun admin kalau kehapus/ke-skip

USE ambachamp;

-- cek dulu apakah akun admin udah ada
SELECT id, nama, email, role FROM users WHERE email = 'admin@ambachamp.id';

-- kalau hasil di atas kosong (no rows), jalanin insert di bawah ini
INSERT INTO users (nama, email, password, role)
SELECT 'Admin AMBAchamp', 'admin@ambachamp.id',
       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@ambachamp.id');

-- cek lagi buat mastiin udah masuk
SELECT id, nama, email, role, is_active FROM users WHERE email = 'admin@ambachamp.id';
