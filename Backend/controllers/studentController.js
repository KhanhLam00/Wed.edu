const pool = require('../db');
const { normalizeAnswer } = require('../utils/helpers');

exports.getClassroomExercises = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { classroomId } = req.params;

    // Lấy lớp thật của học sinh đang đăng nhập
    const [userRows] = await pool.query(
      `SELECT id, classroom_id, role FROM users WHERE id = ? LIMIT 1`,
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy học sinh!' });
    }

    const student = userRows[0];

    if (student.role !== 'student') {
      return res.status(403).json({ message: 'Chỉ học sinh mới được xem bài tập lớp!' });
    }

    // Không cho xem lớp khác
    if (!student.classroom_id || String(student.classroom_id) !== String(classroomId)) {
      return res.status(403).json({ message: 'Bạn không có quyền xem bài tập của lớp này!' });
    }

    const [rows] = await pool.query(
      `SELECT 
         te.id,
         te.title,
         te.grade_level,
         te.topic,
         te.difficulty,
         te.classroom_id,
         te.created_at,
         c.class_name
       FROM teacher_exercises te
       LEFT JOIN classrooms c ON te.classroom_id = c.id
       WHERE te.classroom_id = ?
       ORDER BY te.created_at DESC`,
      [classroomId]
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
};

exports.getExerciseDetail = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { exerciseId } = req.params;

    // Lấy lớp thật của học sinh
    const [userRows] = await pool.query(
      `SELECT id, classroom_id, role FROM users WHERE id = ? LIMIT 1`,
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy học sinh!' });
    }

    const student = userRows[0];

    if (student.role !== 'student') {
      return res.status(403).json({ message: 'Chỉ học sinh mới được xem chi tiết bài tập!' });
    }

    // Chỉ lấy bài nếu bài đó thuộc lớp của học sinh
    const [exerciseRows] = await pool.query(
      `SELECT * 
       FROM teacher_exercises
       WHERE id = ? AND classroom_id = ?
       LIMIT 1`,
      [exerciseId, student.classroom_id]
    );

    if (exerciseRows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bài tập thuộc lớp của bạn!' });
    }

    const [questionRows] = await pool.query(
      `SELECT id, question_text, answer_text, explanation
       FROM teacher_exercise_questions
       WHERE exercise_id = ?
       ORDER BY id ASC`,
      [exerciseId]
    );

    res.json({
      exercise: exerciseRows[0],
      questions: questionRows
    });
  } catch (error) {
    next(error);
  }
};

exports.submitExercise = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { exerciseId, answers } = req.body;

    if (!exerciseId || !answers) {
      return res.status(400).json({ message: 'Thiếu dữ liệu nộp bài!' });
    }

    // Lấy thông tin học sinh đang đăng nhập
    const [userRows] = await pool.query(
      `SELECT id, classroom_id, role FROM users WHERE id = ? LIMIT 1`,
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy học sinh!' });
    }

    const student = userRows[0];

    if (student.role !== 'student') {
      return res.status(403).json({ message: 'Chỉ học sinh mới được nộp bài!' });
    }

    // Kiểm tra bài tập có thuộc lớp của học sinh không
    const [exerciseRows] = await pool.query(
      `SELECT id, classroom_id
       FROM teacher_exercises
       WHERE id = ? AND classroom_id = ?
       LIMIT 1`,
      [exerciseId, student.classroom_id]
    );

    if (exerciseRows.length === 0) {
      return res.status(403).json({ message: 'Bạn không có quyền nộp bài này!' });
    }

    const [questionRows] = await pool.query(
      `SELECT id, question_text, answer_text, explanation
       FROM teacher_exercise_questions
       WHERE exercise_id = ?
       ORDER BY id ASC`,
      [exerciseId]
    );

    if (questionRows.length === 0) {
      return res.status(404).json({ message: 'Không có câu hỏi nào trong bài tập này!' });
    }

    let correctCount = 0;

    const detailedResults = questionRows.map((q) => {
      const userAnswer = answers[q.id] || '';
      const isCorrect =
        normalizeAnswer(userAnswer) === normalizeAnswer(q.answer_text);

      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        question: q.question_text,
        correctAnswer: q.answer_text,
        userAnswer,
        explanation: q.explanation,
        isCorrect
      };
    });

    const totalQuestions = questionRows.length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    const [submissionResult] = await pool.query(
      `INSERT INTO teacher_exercise_submissions
       (exercise_id, user_id, score, total_questions, status)
       VALUES (?, ?, ?, ?, ?)`,
      [exerciseId, userId, score, totalQuestions, 'submitted']
    );

    const submissionId = submissionResult.insertId;

    for (const item of detailedResults) {
      await pool.query(
        `INSERT INTO teacher_exercise_submission_answers
         (submission_id, question_id, user_answer, correct_answer, explanation, is_correct)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          submissionId,
          item.questionId,
          item.userAnswer,
          item.correctAnswer,
          item.explanation || '',
          item.isCorrect ? 1 : 0
        ]
      );
    }

    res.json({
      message: 'Nộp bài thành công!',
      score,
      totalQuestions,
      correctCount,
      submissionId,
      results: detailedResults
    });
  } catch (error) {
    next(error);
  }
};