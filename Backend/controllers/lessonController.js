const pool = require('../db');

exports.getLessons = async (req, res, next) => {
  try {
    const { gradeLevel } = req.query;

    let query = `
      SELECT
        id,
        lesson_num AS lessonNum,
        title,
        content,
        type,
        position,
        grade_level AS gradeLevel
      FROM lessons
    `;
    let params = [];

    if (gradeLevel) {
      query += ' WHERE grade_level = ?';
      params.push(gradeLevel);
    }

    query += ' ORDER BY lesson_num ASC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};