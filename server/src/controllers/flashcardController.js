const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Listar flashcards de um deck
const getFlashcards = async (req, res) => {
  const { id } = req.params;

  try {
    const flashcards = await prisma.flashcard.findMany({
      where: { deckId: id },
    });

    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar flashcards' });
  }
};

// Criar um flashcard
const createFlashcard = async (req, res) => {
  const { id } = req.params;
  const { front, back, reading } = req.body;

  try {
    // Verifica se o deck pertence ao usuário
    const deck = await prisma.deck.findUnique({ where: { id } });

    if (!deck || deck.userId !== req.userId) {
      return res.status(404).json({ error: 'Deck não encontrado' });
    }

    const flashcard = await prisma.flashcard.create({
      data: { front, back, reading, deckId: id },
    });

    res.status(201).json(flashcard);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar flashcard' });
  }
};

// Deletar um flashcard
const deleteFlashcard = async (req, res) => {
  const { id } = req.params;

  try {
    const flashcard = await prisma.flashcard.findUnique({ where: { id } });

    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard não encontrado' });
    }

    await prisma.flashcard.delete({ where: { id } });

    res.json({ message: 'Flashcard deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar flashcard' });
  }
};

module.exports = { getFlashcards, createFlashcard, deleteFlashcard };