const pool = require('../db');

exports.getLeaderboard = async (req, res, next) => {
  try {
    const userClass = req.query.className || null;

    let query = `
      SELECT
        u.id,
        u.public_user_id,
        u.username,
        u.avatar,
        COALESCE(SUM(r.score), 0) AS totalStars
      FROM users u
      LEFT JOIN results r ON u.id = r.user_id
      WHERE u.role = 'student'
    `;

    const params = [];

    if (userClass) {
      query += ` AND u.class_name = ? `;
      params.push(userClass);
    }

    query += `
      GROUP BY u.id, u.public_user_id, u.username, u.avatar
      ORDER BY totalStars DESC
      LIMIT 5
    `;

    const [rows] = await pool.query(query, params);

    const leaderboard = rows.map((student) => ({
      id: student.public_user_id || student.id,
      name: student.username,
      stars: Number(student.totalStars) || 0,
      avatar: student.avatar || "https://cdn-icons-png.flaticon.com/128/4140/4140048.png"
    }));

    res.status(200).json(leaderboard);
  } catch (error) {
    next(error);
  }
};