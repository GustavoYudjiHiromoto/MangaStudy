const express = require('express');
const router = express.Router();
const { getDecks, createDeck, deleteDeck } = require('../controllers/deckController');
const authMiddleware = require('../middleware/auth');

// Todas as rotas de deck precisam estar logado
router.use(authMiddleware);

router.get('/', getDecks);
router.post('/', createDeck);
router.delete('/:id', deleteDeck);

module.exports = router;