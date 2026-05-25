const express = require('express');
const router = express.Router();
const { getCardsToReview, reviewCard } = require('../controllers/studyController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/review', getCardsToReview);
router.post('/review/:id', reviewCard);

module.exports = router;