const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST: Lưu kết quả học tập
// Nếu đã có kết quả bài đó rồi thì chỉ cập nhật khi điểm mới cao hơn
router.post('/save', async (req, res) => {
  try {
    const { studentId, lessonId, score, heartsRemaining, status } = req.body;

    // 1. Tìm user theo id thật hoặc mã public_user_id
    const [users] = await pool.query(
      `SELECT * FROM users
       WHERE id = ? OR public_user_id = ?
       LIMIT 1`,
      [studentId, studentId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy học sinh!' });
    }

    const user = users[0];

    // 2. Tìm lesson theo lesson_num
    const [lessons] = await pool.query(
      `SELECT * FROM lessons
       WHERE lesson_num = ?
       LIMIT 1`,
      [lessonId]
    );

    if (lessons.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bài học!' });
    }

    const lesson = lessons[0];

    // 3. Kiểm tra đã có kết quả bài này chưa
    const [existingResults] = await pool.query(
      `SELECT * FROM results
       WHERE user_id = ? AND lesson_id = ?
       LIMIT 1`,
      [user.id, lesson.id]
    );

    if (existingResults.length > 0) {
      const existingResult = existingResults[0];

      // Chỉ cập nhật nếu điểm mới cao hơn
      if (Number(score) > Number(existingResult.score)) {
        await pool.query(
          `UPDATE results
           SET score = ?, hearts_remaining = ?, status = ?
           WHERE id = ?`,
          [score, heartsRemaining, status, existingResult.id]
        );
      }
    } else {
      // Chưa có thì thêm mới
      await pool.query(
        `INSERT INTO results (user_id, lesson_id, score, hearts_remaining, status)
         VALUES (?, ?, ?, ?, ?)`,
        [user.id, lesson.id, score, heartsRemaining, status]
      );
    }

    res.status(200).json({ message: 'Lưu điểm thành công!' });
  } catch (error) {
    console.error('Lỗi /save:', error);
    res.status(500).json({ message: 'Lỗi lưu điểm', error: error.message });
  }
});

// GET: Lấy danh sách bài đã học của một học sinh cụ thể
router.get('/student/:id', async (req, res) => {
  try {
    const studentParam = req.params.id;

    // Tìm user theo id hoặc public_user_id
    const [users] = await pool.query(
      `SELECT * FROM users
       WHERE id = ? OR public_user_id = ?
       LIMIT 1`,
      [studentParam, studentParam]
    );

    if (users.length === 0) {
      return res.json([]);
    }

    const user = users[0];

    // Lấy kết quả và đổi tên field cho khớp frontend cũ
    const [results] = await pool.query(
      `SELECT
          r.id,
          u.public_user_id AS studentId,
          l.lesson_num AS lessonId,
          r.score,
          r.hearts_remaining AS heartsRemaining,
          r.status,
          r.created_at AS createdAt,
          r.updated_at AS updatedAt
       FROM results r
       JOIN users u ON r.user_id = u.id
       JOIN lessons l ON r.lesson_id = l.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [user.id]
    );

    res.json(results);
  } catch (err) {
    console.error('Lỗi /student/:id:', err);
    res.status(500).json({ message: 'Lỗi khi lấy tiến độ học tập', error: err.message });
  }
});

// GET: Lấy toàn bộ kết quả để hiển thị trên Dashboard Giáo viên
router.get('/all', async (req, res) => {
  try {
    const [results] = await pool.query(
      `SELECT
          r.id,
          u.public_user_id AS studentId,
          u.username,
          u.email,
          l.lesson_num AS lessonId,
          r.score,
          r.hearts_remaining AS heartsRemaining,
          r.status,
          r.created_at AS createdAt,
          r.updated_at AS updatedAt
       FROM results r
       JOIN users u ON r.user_id = u.id
       JOIN lessons l ON r.lesson_id = l.id
       ORDER BY r.created_at DESC`
    );

    res.json(results);
  } catch (err) {
    console.error('Lỗi /all:', err);
    res.status(500).json({ message: 'Không thể lấy danh sách kết quả', error: err.message });
  }
});

module.exports = router;