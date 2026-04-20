const pool = require('../db');

exports.getAllClassrooms = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, class_code, class_name, grade_level, teacher_id
       FROM classrooms
       ORDER BY grade_level ASC, class_code ASC`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

exports.getClassroomById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT 
        c.id,
        c.class_code,
        c.class_name,
        c.grade_level,
        c.teacher_id,
        u.username AS teacher_name,
        u.avatar AS teacher_avatar
      FROM classrooms c
      LEFT JOIN users u ON c.teacher_id = u.id
      WHERE c.id = ?
      LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy lớp học!' });
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.getClassroomMembers = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT
         u.id,
         u.public_user_id,
         u.username,
         u.avatar,
         u.role,
         u.classroom_id
       FROM users u
       WHERE u.classroom_id = ? AND u.role = 'student'
       ORDER BY u.username ASC`,
      [id]
    );

    const members = rows.map((student) => ({
      id: student.public_user_id || student.id,
      name: student.username,
      avatar: student.avatar || 'https://cdn-icons-png.flaticon.com/128/4140/4140048.png'
    }));

    res.json(members);
  } catch (error) {
    next(error);
  }
};

exports.joinClass = async (req, res, next) => {
  try {
    const { userId, classCode } = req.body;

    if (!userId || !classCode) {
      return res.status(400).json({ message: 'Thiếu dữ liệu!' });
    }

    const cleanCode = String(classCode).trim().toUpperCase();

    const [rows] = await pool.query(
      `SELECT * FROM classrooms WHERE UPPER(TRIM(class_code)) = ? LIMIT 1`,
      [cleanCode]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Mã lớp không tồn tại!' });
    }

    const classroom = rows[0];

    await pool.query(
      `UPDATE users
       SET classroom_id = ?, class_name = ?, grade_level = ?
       WHERE id = ?`,
      [classroom.id, classroom.class_name, classroom.grade_level, userId]
    );

    res.json({
      message: 'Tham gia lớp thành công!',
      classroom
    });
  } catch (error) {
    next(error);
  }
};