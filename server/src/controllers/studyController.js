const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Algoritmo SM-2
const calculateSRS = (quality, intervalDays, easeFactor) => {
  let newInterval;
  let newEaseFactor = easeFactor;

  if (quality < 3) {
    // Errou — volta pro começo
    newInterval = 1;
  } else {
    // Acertou — aumenta o intervalo
    if (intervalDays === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(intervalDays * easeFactor);
    }

    // Ajusta o fator de facilidade baseado na nota
    newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    // Fator mínimo é 1.3 — card nunca fica "impossível"
    if (newEaseFactor < 1.3) newEaseFactor = 1.3;
  }

  // Calcula a data da próxima revisão
  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + newInterval);

  return { newInterval, newEaseFactor, nextReviewAt };
};

// Buscar flashcards pra revisar hoje
const getCardsToReview = async (req, res) => {
  try {
    const flashcards = await prisma.flashcard.findMany({
      where: {
        deck: { userId: req.userId },
        nextReviewAt: { lte: new Date() },
      },
    });

    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cards para revisão' });
  }
};

// Revisar um flashcard
const reviewCard = async (req, res) => {
  const { id } = req.params;
  const { quality } = req.body;

  if (quality < 0 || quality > 5) {
    return res.status(400).json({ error: 'Nota deve ser entre 0 e 5' });
  }

  try {
    const flashcard = await prisma.flashcard.findUnique({ where: { id } });

    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard não encontrado' });
    }

    // Calcula novos valores SRS
    const { newInterval, newEaseFactor, nextReviewAt } = calculateSRS(
      quality,
      flashcard.intervalDays,
      flashcard.easeFactor
    );

    // Atualiza o flashcard
    const updated = await prisma.flashcard.update({
      where: { id },
      data: {
        intervalDays: newInterval,
        easeFactor: newEaseFactor,
        nextReviewAt,
      },
    });

    // Salva a sessão de estudo
    await prisma.studySession.create({
      data: {
        userId: req.userId,
        flashcardId: id,
        quality,
        intervalDays: newInterval,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao revisar flashcard' });
  }
};

module.exports = { getCardsToReview, reviewCard };