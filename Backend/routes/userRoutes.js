const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.put('/update-profile', userController.updateProfile);
router.put('/update-grade', userController.updateGrade);
router.put('/update-classroom', userController.updateClassroom);

module.exports = router;