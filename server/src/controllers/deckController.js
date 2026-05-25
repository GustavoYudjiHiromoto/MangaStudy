const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Listar todos os decks do usuário
const getDecks = async (req, res) => {
  try {
    const decks = await prisma.deck.findMany({
      where: { userId: req.userId },
      include: { _count: { select: { flashcards: true } } },
    });

    res.json(decks);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar decks' });
  }
};

// Criar um deck novo
const createDeck = async (req, res) => {
  const { title, description } = req.body;

  try {
    const deck = await prisma.deck.create({
      data: { title, description, userId: req.userId },
    });

    res.status(201).json(deck);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar deck' });
  }
};

// Deletar um deck
const deleteDeck = async (req, res) => {
  const { id } = req.params;

  try {
    // Verifica se o deck pertence ao usuário
    const deck = await prisma.deck.findUnique({ where: { id } });

    if (!deck || deck.userId !== req.userId) {
      return res.status(404).json({ error: 'Deck não encontrado' });
    }

    await prisma.deck.delete({ where: { id } });

    res.json({ message: 'Deck deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar deck' });
  }
};

module.exports = { getDecks, createDeck, deleteDeck };