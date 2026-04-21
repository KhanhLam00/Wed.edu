const app = require('./app');

// Sửa dòng này: Ưu tiên lấy PORT từ môi trường, nếu không có thì mới dùng 5000
const PORT = process.env.PORT || 10000;

// Thêm '0.0.0.0' để Render có thể "nhìn thấy" server của bạn
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server Backend đang chạy tại cổng ${PORT}...`);
  console.log("Gemini key loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");
});
