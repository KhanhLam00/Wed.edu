const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/ai/generate-math', aiController.generateMath);
router.post('/ai/solve-from-image', aiController.solveFromImage);
router.post('/ai/explain', aiController.explainAnswer);

module.exports = router;