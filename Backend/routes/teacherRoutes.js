const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/generate-exercise', authMiddleware, teacherController.generateExercise);
router.post('/save-exercise', authMiddleware, teacherController.saveExercise);

router.get('/exercises', authMiddleware, teacherController.getExercises);
router.get('/exercises/:id', authMiddleware, teacherController.getExerciseDetail);
router.delete('/exercises/:id', authMiddleware, teacherController.deleteExercise);

router.get('/exercises/:id/submissions', authMiddleware, teacherController.getExerciseSubmissions);
router.get('/exercises/:id/submission-summary', authMiddleware, teacherController.getExerciseSubmissionSummary);
router.get('/submissions/:id/detail', authMiddleware, teacherController.getSubmissionDetail);

router.get('/dashboard-summary', authMiddleware, teacherController.getDashboardSummary);

router.get('/classes', authMiddleware, teacherController.getClasses);
router.get('/classes/:id/detail', authMiddleware, teacherController.getClassDetail);
router.get('/classes/:id/submission-summary', authMiddleware, teacherController.getClassSubmissionSummary);
router.delete('/classes/:id', authMiddleware, teacherController.deleteClass);
router.post('/create-class', authMiddleware, teacherController.createClass);
router.get('/classes/:teacherId', authMiddleware, teacherController.getClassesByTeacher);

module.exports = router;