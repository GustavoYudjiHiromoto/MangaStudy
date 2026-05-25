const express = require('express');
const router = express.Router({ mergeParams: true });
const { getFlashcards, createFlashcard, deleteFlashcard } = require('../controllers/flashcardController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', getFlashcards);
router.post('/', createFlashcard);
router.delete('/:id', deleteFlashcard);

module.exports = router;