const mysql = require('mysql2/promise');

// Cách kết nối cực kỳ bền bỉ (Robust connection)
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL, // Thử dùng link trước
  // Nếu link không chạy, các dòng dưới đây sẽ "cứu cánh"
  host: process.env.MYSQLHOST || 'shinkansen.proxy.rlwy.net',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'auNNIaIQLWwXuwQWaPCKRcCiYIcCXhuC',
  database: process.env.MYSQLDATABASE || 'railway',
  port: process.env.MYSQLPORT || 51782,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(conn => {
    console.log('✅ KẾT NỐI DATABASE THÀNH CÔNG!');
    conn.release();
  })
  .catch(err => {
    console.error('❌ LỖI MYSQL THẬT SỰ ĐÂY RỒI:', err.code);
    console.error('❌ TIN NHẮN LỖI:', err.message);
  });

module.exports = pool;
