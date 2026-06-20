// src/config/database.js
// Koneksi ke MySQL menggunakan mysql2 dengan connection pool
// Connection pool lebih efisien karena reuse koneksi yang ada

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               process.env.DB_PORT     || 3306,
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'ambachamp',
  waitForConnections: true,
  connectionLimit:    10,   // max 10 koneksi bersamaan
  queueLimit:         0,
  charset:            'utf8mb4',
});

// Test koneksi saat server pertama kali jalan
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Database MySQL terhubung!');
    conn.release();
  } catch (err) {
    console.error('❌ Gagal konek database:', err.message);
    process.exit(1); // Stop server kalau DB ga bisa konek
  }
}

testConnection();

module.exports = pool;
