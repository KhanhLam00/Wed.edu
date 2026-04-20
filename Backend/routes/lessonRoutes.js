const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');

router.get('/lessons', lessonController.getLessons);

module.exports = router;