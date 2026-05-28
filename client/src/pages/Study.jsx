import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Study() {
  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await api.get('/study/review');
      setCards(response.data);
    } catch (err) {
      console.error('Erro ao buscar cards');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (quality) => {
    const card = cards[current];

    try {
      await api.post(`/study/review/${card.id}`, { quality });

      if (current + 1 >= cards.length) {
        setFinished(true);
      } else {
        setCurrent(current + 1);
        setFlipped(false);
      }
    } catch (err) {
      console.error('Erro ao revisar card');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Carregando...</p>
      </div>
    );
  }

  if (finished || cards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🎉</p>
          <h2 className="text-2xl font-bold text-white mb-2">
            {cards.length === 0 ? 'Nenhum card pra revisar!' : 'Sessão concluída!'}
          </h2>
          <p className="text-gray-400 mb-8">
            {cards.length === 0
              ? 'Volte mais tarde ou crie novos flashcards.'
              : `Você revisou ${cards.length} card(s) hoje.`}
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  const card = cards[current];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-6">
      {/* Progresso */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between text-gray-400 text-sm mb-2">
          <span>Card {current + 1} de {cards.length}</span>
          <button onClick={() => navigate('/')} className="hover:text-white transition">
            Sair
          </button>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all"
            style={{ width: `${((current + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="w-full max-w-lg bg-gray-800 rounded-2xl p-10 text-center cursor-pointer hover:bg-gray-750 transition min-h-48 flex flex-col items-center justify-center"
      >
        {!flipped ? (
          <>
            <p className="text-4xl font-bold mb-4">{card.front}</p>
            {card.reading && (
              <p className="text-gray-400 text-lg">{card.reading}</p>
            )}
            <p className="text-gray-500 text-sm mt-6">Clique pra ver a resposta</p>
          </>
        ) : (
          <>
            <p className="text-3xl font-bold text-purple-400">{card.back}</p>
            <p className="text-gray-500 text-sm mt-6">Como foi?</p>
          </>
        )}
      </div>

      {/* Botões de qualidade */}
      {flipped && (
        <div className="flex gap-3 mt-8">
          <button
            onClick={() => handleReview(0)}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            Errei
          </button>
          <button
            onClick={() => handleReview(3)}
            className="bg-amber-600 hover:bg-amber-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            Difícil
          </button>
          <button
            onClick={() => handleReview(4)}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            Fácil
          </button>
          <button
            onClick={() => handleReview(5)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            Fácil demais
          </button>
        </div>
      )}
    </div>
  );
}

export default Study;