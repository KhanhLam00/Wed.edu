const pool = require('../db');
const genAI = require('../utils/gemini');
const { generateClassCode } = require('../utils/helpers');

exports.generateExercise = async (req, res, next) => {
  try {
    const { gradeLevel, topic, difficulty, questionCount } = req.body;

    if (!gradeLevel || !topic || !difficulty || !questionCount) {
      return res.status(400).json({ message: 'Thiếu dữ liệu để tạo bài tập!' });
    }

    if (!process.env.GEMINI_API_KEY || !genAI) {
      return res.status(500).json({ message: 'Thiếu GEMINI_API_KEY trong file .env' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
Bạn là một trợ lý AI hỗ trợ giáo viên tiểu học tạo bài tập môn Toán.

Hãy tạo bài tập cho:
- Khối lớp: ${gradeLevel}
- Chủ đề: ${topic}
- Độ khó: ${difficulty}
- Số câu: ${questionCount}

Yêu cầu:
1. Viết bằng tiếng Việt dễ hiểu.
2. Phù hợp với học sinh tiểu học.
3. Mỗi câu có:
   - question: nội dung câu hỏi
   - answer: đáp án đúng
   - explanation: giải thích ngắn
4. Trả về đúng định dạng JSON như sau:

{
  "title": "Tên bộ bài tập",
  "gradeLevel": ${gradeLevel},
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "question": "Câu hỏi 1",
      "answer": "Đáp án 1",
      "explanation": "Giải thích 1"
    }
  ]
}

Chỉ trả về JSON, không thêm markdown, không thêm giải thích ngoài JSON.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let jsonData;
    try {
      jsonData = JSON.parse(text);
    } catch (err) {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      jsonData = JSON.parse(cleaned);
    }

    res.json(jsonData);
  } catch (error) {
    next(error);
  }
};

exports.saveExercise = async (req, res, next) => {
  try {
    const {
      title,
      gradeLevel,
      topic,
      difficulty,
      classroomId,
      questions
    } = req.body;

    const teacherId = req.user.id;

    if (!title || !gradeLevel || !topic || !difficulty || !classroomId || !questions?.length) {
      return res.status(400).json({ message: 'Thiếu dữ liệu để lưu bài tập!' });
    }

    // kiểm tra lớp có thật sự thuộc giáo viên này không
    const [classRows] = await pool.query(
      `SELECT * FROM classrooms WHERE id = ? AND teacher_id = ? LIMIT 1`,
      [classroomId, teacherId]
    );

    if (classRows.length === 0) {
      return res.status(403).json({ message: 'Bạn không có quyền lưu bài cho lớp này!' });
    }

    const [exerciseResult] = await pool.query(
      `INSERT INTO teacher_exercises
       (title, grade_level, topic, difficulty, classroom_id, teacher_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, gradeLevel, topic, difficulty, classroomId, teacherId]
    );

    const exerciseId = exerciseResult.insertId;

    for (const q of questions) {
      await pool.query(
        `INSERT INTO teacher_exercise_questions
         (exercise_id, question_text, answer_text, explanation)
         VALUES (?, ?, ?, ?)`,
        [exerciseId, q.question, q.answer, q.explanation || '']
      );
    }

    res.json({
      message: 'Lưu bài tập thành công!',
      exerciseId
    });
  } catch (error) {
    next(error);
  }
};

exports.getExercises = async (req, res, next) => {
  try {
    const teacherId = req.user.id;

    const [rows] = await pool.query(
      `SELECT 
         te.id,
         te.title,
         te.grade_level,
         te.topic,
         te.difficulty,
         te.classroom_id,
         te.teacher_id,
         te.created_at,
         c.class_name
       FROM teacher_exercises te
       LEFT JOIN classrooms c ON te.classroom_id = c.id
       WHERE te.teacher_id = ?
       ORDER BY te.created_at DESC`,
      [teacherId]
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
};

exports.getExerciseDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;

    const [exerciseRows] = await pool.query(
      `SELECT 
         te.*,
         c.class_name
       FROM teacher_exercises te
       LEFT JOIN classrooms c ON te.classroom_id = c.id
       WHERE te.id = ? AND te.teacher_id = ?
       LIMIT 1`,
      [id, teacherId]
    );

    if (exerciseRows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bài tập!' });
    }

    const [questionRows] = await pool.query(
      `SELECT id, question_text, answer_text, explanation
       FROM teacher_exercise_questions
       WHERE exercise_id = ?
       ORDER BY id ASC`,
      [id]
    );

    res.json({
      exercise: exerciseRows[0],
      questions: questionRows
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteExercise = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;

    const [exerciseRows] = await pool.query(
      `SELECT * FROM teacher_exercises WHERE id = ? AND teacher_id = ? LIMIT 1`,
      [id, teacherId]
    );

    if (exerciseRows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bài tập để xóa!' });
    }

    await pool.query(
      `DELETE FROM teacher_exercise_questions WHERE exercise_id = ?`,
      [id]
    );

    await pool.query(
      `DELETE FROM teacher_exercises WHERE id = ? AND teacher_id = ?`,
      [id, teacherId]
    );

    res.json({ message: 'Xóa bài tập thành công!' });
  } catch (error) {
    next(error);
  }
};

exports.getExerciseSubmissions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;

    // kiểm tra bài này có thuộc giáo viên hiện tại không
    const [exerciseRows] = await pool.query(
      `SELECT * FROM teacher_exercises WHERE id = ? AND teacher_id = ? LIMIT 1`,
      [id, teacherId]
    );

    if (exerciseRows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bài tập!' });
    }

    const [rows] = await pool.query(
      `SELECT 
         tes.id,
         tes.exercise_id,
         tes.user_id,
         tes.score,
         tes.total_questions,
         tes.status,
         tes.submitted_at,
         u.username,
         u.public_user_id,
         u.class_name
       FROM teacher_exercise_submissions tes
       LEFT JOIN users u ON tes.user_id = u.id
       WHERE tes.exercise_id = ?
       ORDER BY tes.submitted_at DESC`,
      [id]
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
};

exports.getExerciseSubmissionSummary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;

    const [exerciseRows] = await pool.query(
      `SELECT * FROM teacher_exercises WHERE id = ? AND teacher_id = ? LIMIT 1`,
      [id, teacherId]
    );

    if (exerciseRows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bài tập!' });
    }

    const [rows] = await pool.query(
      `SELECT 
         COUNT(*) AS total_submissions,
         AVG(score) AS average_score,
         MAX(score) AS highest_score,
         MIN(score) AS lowest_score
       FROM teacher_exercise_submissions
       WHERE exercise_id = ?`,
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.getDashboardSummary = async (req, res, next) => {
  try {
    const teacherId = req.user.id;

    const [[exerciseCountRow]] = await pool.query(
      `SELECT COUNT(*) AS total_exercises
       FROM teacher_exercises
       WHERE teacher_id = ?`,
      [teacherId]
    );

    const [[submissionCountRow]] = await pool.query(
      `SELECT COUNT(*) AS total_submissions
       FROM teacher_exercise_submissions tes
       INNER JOIN teacher_exercises te ON tes.exercise_id = te.id
       WHERE te.teacher_id = ?`,
      [teacherId]
    );

    const [[classroomCountRow]] = await pool.query(
      `SELECT COUNT(*) AS total_classrooms
       FROM classrooms
       WHERE teacher_id = ?`,
      [teacherId]
    );

    res.json({
      totalExercises: exerciseCountRow.total_exercises || 0,
      totalSubmissions: submissionCountRow.total_submissions || 0,
      totalClassrooms: classroomCountRow.total_classrooms || 0
    });
  } catch (error) {
    next(error);
  }
};

exports.getClasses = async (req, res, next) => {
  try {
    const teacherId = req.user.id;

    const [rows] = await pool.query(
      `SELECT 
         c.id,
         c.class_code,
         c.class_name,
         c.grade_level,
         COUNT(DISTINCT u.id) AS total_students,
         COUNT(DISTINCT te.id) AS total_exercises
       FROM classrooms c
       LEFT JOIN users u ON c.id = u.classroom_id AND u.role = 'student'
       LEFT JOIN teacher_exercises te ON c.id = te.classroom_id
       WHERE c.teacher_id = ?
       GROUP BY c.id, c.class_code, c.class_name, c.grade_level
       ORDER BY c.grade_level ASC, c.class_code ASC`,
      [teacherId]
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
};

exports.getClassDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;

    const [classRows] = await pool.query(
      `SELECT * FROM classrooms WHERE id = ? AND teacher_id = ? LIMIT 1`,
      [id, teacherId]
    );

    if (classRows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy lớp của giáo viên này!' });
    }

    const [studentRows] = await pool.query(
      `SELECT id, username, public_user_id, avatar
       FROM users
       WHERE classroom_id = ? AND role = 'student'
       ORDER BY id DESC`,
      [id]
    );

    const [exerciseRows] = await pool.query(
      `SELECT 
         te.id,
         te.title,
         te.topic,
         te.difficulty,
         COUNT(tes.id) AS total_submissions
       FROM teacher_exercises te
       LEFT JOIN teacher_exercise_submissions tes ON te.id = tes.exercise_id
       WHERE te.classroom_id = ? AND te.teacher_id = ?
       GROUP BY te.id, te.title, te.topic, te.difficulty
       ORDER BY te.id DESC`,
      [id, teacherId]
    );

    res.json({
      classroom: classRows[0],
      students: studentRows,
      exercises: exerciseRows
    });
  } catch (error) {
    next(error);
  }
};

exports.getClassSubmissionSummary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;

    const [rows] = await pool.query(
      `SELECT 
         COUNT(tes.id) AS total_submissions,
         COUNT(DISTINCT tes.user_id) AS total_students_submitted,
         AVG(tes.score) AS average_score
       FROM teacher_exercises te
       LEFT JOIN teacher_exercise_submissions tes ON te.id = tes.exercise_id
       WHERE te.classroom_id = ? AND te.teacher_id = ?`,
      [id, teacherId]
    );

    res.json(rows[0] || {
      total_submissions: 0,
      total_students_submitted: 0,
      average_score: 0
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;

    const [classRows] = await pool.query(
      `SELECT * FROM classrooms WHERE id = ? AND teacher_id = ? LIMIT 1`,
      [id, teacherId]
    );

    if (classRows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy lớp để xóa!' });
    }

    const classroom = classRows[0];

    await pool.query(
      `UPDATE users
       SET classroom_id = NULL, class_name = NULL
       WHERE classroom_id = ? AND role = 'student'`,
      [id]
    );

    await pool.query(
      `DELETE FROM classrooms WHERE id = ? AND teacher_id = ?`,
      [id, teacherId]
    );

    res.json({
      message: `Đã xóa lớp ${classroom.class_name} thành công!`
    });
  } catch (error) {
    next(error);
  }
};

exports.getSubmissionDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;

    const [submissionRows] = await pool.query(
      `SELECT 
         tes.*,
         u.username,
         u.public_user_id,
         u.class_name,
         te.title AS exercise_title,
         te.topic,
         te.difficulty,
         te.teacher_id
       FROM teacher_exercise_submissions tes
       LEFT JOIN users u ON tes.user_id = u.id
       LEFT JOIN teacher_exercises te ON tes.exercise_id = te.id
       WHERE tes.id = ? AND te.teacher_id = ?
       LIMIT 1`,
      [id, teacherId]
    );

    if (submissionRows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bài nộp!' });
    }

    const [answerRows] = await pool.query(
      `SELECT 
         tesa.*,
         teq.question_text
       FROM teacher_exercise_submission_answers tesa
       LEFT JOIN teacher_exercise_questions teq ON tesa.question_id = teq.id
       WHERE tesa.submission_id = ?
       ORDER BY tesa.id ASC`,
      [id]
    );

    res.json({
      submission: submissionRows[0],
      answers: answerRows
    });
  } catch (error) {
    next(error);
  }
};

exports.createClass = async (req, res, next) => {
  try {
    const { className, gradeLevel } = req.body;
    const teacherId = req.user.id;

    if (!className || !gradeLevel) {
      return res.status(400).json({ message: 'Thiếu dữ liệu!' });
    }

    const classCode = generateClassCode();

    await pool.query(
      `INSERT INTO classrooms (class_code, class_name, grade_level, teacher_id)
       VALUES (?, ?, ?, ?)`,
      [classCode, className, gradeLevel, teacherId]
    );

    res.json({
      message: 'Tạo lớp thành công!',
      classCode
    });
  } catch (error) {
    next(error);
  }
};

exports.getClassesByTeacher = async (req, res, next) => {
  try {
    const teacherId = req.user.id;

    const [rows] = await pool.query(
      `SELECT * FROM classrooms WHERE teacher_id = ?`,
      [teacherId]
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
};