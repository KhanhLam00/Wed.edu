const pool = require('../db');
const bcrypt = require('bcrypt');
const { TEACHER_SECRET_CODE } = require('../utils/constants');
const { generatePublicUserId } = require('../utils/helpers');
const jwt = require('jsonwebtoken');

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


const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      userId: user.public_user_id,
      role: user.role,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};


exports.googleLogin = async (req, res, next) => {
  try {
    const { name, email, avatar, role, className } = req.body;

    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    let user;

    if (existingUsers.length > 0) {
      user = existingUsers[0];
      console.log(`🔄 USER CŨ QUAY LẠI: ${email}`);
    } else {
      const publicUserId = generatePublicUserId(role || 'student');

      const [insertResult] = await pool.query(
        `INSERT INTO users (public_user_id, username, email, password, role, class_name, avatar)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          publicUserId,
          name,
          email,
          'google_account_no_password',
          role || '',
          className || '',
          avatar || ''
        ]
      );

      const [newUsers] = await pool.query(
        'SELECT * FROM users WHERE id = ? LIMIT 1',
        [insertResult.insertId]
      );

      user = newUsers[0];
      console.log(`✨ ĐÃ TẠO USER GOOGLE MỚI: ${email} | ID: ${user.public_user_id}`);
    }

    const needsOnboarding = !user.role || (user.role === 'student' && !user.class_name);

      const token = generateToken(user);

      res.status(200).json({
        message: "Đăng nhập Google thành công!",
        token,
        needsOnboarding,
        user: buildUserResponse(user)
      });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { email, username, password, role, teacherCode } = req.body;

    if (role === 'teacher' && teacherCode && teacherCode !== TEACHER_SECRET_CODE) {
      return res.status(403).json({ message: "Mã xác thực giáo viên không đúng!" });
    }

    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Email này đã tồn tại!" });
    }

    const publicUserId = generatePublicUserId(role);
    const hashedPassword = await bcrypt.hash(password, 10);

    const [insertResult] = await pool.query(
      `INSERT INTO users (public_user_id, email, username, password, role)
       VALUES (?, ?, ?, ?, ?)`,
      [publicUserId, email, username, hashedPassword, role || 'student']
    );

    const [newUsers] = await pool.query(
      'SELECT * FROM users WHERE id = ? LIMIT 1',
      [insertResult.insertId]
    );

    const user = newUsers[0];

    const token = generateToken(user);

    res.status(200).json({
      message: "Đăng ký thành công!",
      token,
      user: buildUserResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu!" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu!" });
    }

    const needsOnboarding = !user.role || (user.role === 'student' && !user.class_name);

const token = generateToken(user);

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      needsOnboarding,
      user: buildUserResponse(user)
    });
  } catch (error) {
    next(error);
  }
};