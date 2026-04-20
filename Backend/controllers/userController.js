const pool = require('../db');
const { TEACHER_SECRET_CODE } = require('../utils/constants');

const buildUserResponse = (user) => ({
  _id: user.id,
  id: user.id,
  userId: user.public_user_id,
  username: user.username,
  email: user.email,
  role: user.role,
  className: user.class_name,
  gradeLevel: user.grade_level,
  classroomId: user.classroom_id,
  avatar: user.avatar
});

exports.updateProfile = async (req, res, next) => {
  try {
    const { userId, username, role, teacherCode } = req.body;

    if (role === 'teacher' && teacherCode !== TEACHER_SECRET_CODE) {
      return res.status(403).json({ message: "Mã xác thực giáo viên không đúng!" });
    }

    await pool.query(
      `UPDATE users
       SET username = ?, role = ?
       WHERE public_user_id = ? OR id = ?`,
      [username, role, userId, userId]
    );

    const [updatedUsers] = await pool.query(
      `SELECT * FROM users
       WHERE public_user_id = ? OR id = ?
       LIMIT 1`,
      [userId, userId]
    );

    if (updatedUsers.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    res.status(200).json({
      message: "Cập nhật hồ sơ thành công!",
      user: buildUserResponse(updatedUsers[0])
    });
  } catch (error) {
    next(error);
  }
};

exports.updateGrade = async (req, res, next) => {
  try {
    const { userId, className, gradeLevel } = req.body;

    await pool.query(
      `UPDATE users
       SET class_name = ?, grade_level = ?
       WHERE public_user_id = ? OR id = ?`,
      [className, gradeLevel, userId, userId]
    );

    const [updatedUsers] = await pool.query(
      `SELECT * FROM users
       WHERE public_user_id = ? OR id = ?
       LIMIT 1`,
      [userId, userId]
    );

    if (updatedUsers.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    res.status(200).json({
      message: "Bé đã vào lớp thành công!",
      user: buildUserResponse(updatedUsers[0])
    });
  } catch (error) {
    next(error);
  }
};

exports.updateClassroom = async (req, res, next) => {
  try {
    const { userId, classroomId } = req.body;

    const [classrooms] = await pool.query(
      `SELECT * FROM classrooms WHERE id = ? LIMIT 1`,
      [classroomId]
    );

    if (classrooms.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy lớp học!' });
    }

    const classroom = classrooms[0];

    await pool.query(
      `UPDATE users
       SET classroom_id = ?, class_name = ?, grade_level = ?
       WHERE public_user_id = ? OR id = ?`,
      [classroom.id, classroom.class_name, classroom.grade_level, userId, userId]
    );

    const [updatedUsers] = await pool.query(
      `SELECT * FROM users
       WHERE public_user_id = ? OR id = ?
       LIMIT 1`,
      [userId, userId]
    );

    const user = updatedUsers[0];

    res.json({
      message: 'Cập nhật lớp học thành công!',
      user: buildUserResponse(user),
      classroom
    });
  } catch (error) {
    next(error);
  }
};