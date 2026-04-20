const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/classroom-exercises/:classroomId', authMiddleware, studentController.getClassroomExercises);
router.get('/exercise-detail/:exerciseId', authMiddleware, studentController.getExerciseDetail);
router.post('/submit-exercise', authMiddleware, studentController.submitExercise);

module.exports = router;