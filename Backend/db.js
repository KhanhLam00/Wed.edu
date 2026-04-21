const mysql = require('mysql2/promise');

// Kiểm tra xem có biến DATABASE_URL (từ Render/Railway) không, nếu không thì dùng localhost
const connectionString = process.env.DATABASE_URL || {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'smart_math',
  port: 3306,
};

// Khởi tạo pool - mysql2 rất thông minh, nó có thể nhận vào 1 cái Link hoặc 1 cái Object
const pool = mysql.createPool(connectionString);

pool.getConnection()
  .then(conn => {
    console.log('✅ Kết nối Database thành công!');
    // Nếu dùng link từ Railway, nó sẽ in ra host của Railway
    console.log('Kết nối tới:', typeof connectionString === 'string' ? 'Cloud Database' : 'Localhost');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Lỗi kết nối Database:', err.message);
  });

module.exports = pool;
