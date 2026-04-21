
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const aiRoutes = require('./routes/aiRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const resultRoutes = require('./routes/resultRoutes');

const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Test DB khi khởi động
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Đã kết nối MySQL thành công!");
    conn.release();
  } catch (err) {
    console.error("❌ Lỗi kết nối MySQL:", err.message);
  }
})();

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', lessonRoutes);
app.use('/api', aiRoutes);
app.use('/api', leaderboardRoutes);
app.use('/api', classroomRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/results', resultRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
