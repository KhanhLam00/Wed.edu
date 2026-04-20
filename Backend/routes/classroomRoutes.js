const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');

router.get('/classrooms', classroomController.getAllClassrooms);
router.get('/classrooms/:id', classroomController.getClassroomById);
router.get('/classrooms/:id/members', classroomController.getClassroomMembers);
router.post('/student/join-class', classroomController.joinClass);

module.exports = router;