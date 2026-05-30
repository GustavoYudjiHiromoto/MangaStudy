import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function DeckDetail() {
  const [flashcards, setFlashcards] = useState([]);
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [reading, setReading] = useState('');
  const [creating, setCreating] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeck();
    fetchFlashcards();
  }, []);

  const fetchDeck = async () => {
    try {
      const response = await api.get('/decks');
      const found = response.data.find((d) => d.id === id);
      setDeck(found);
    } catch (err) {
      console.error('Erro ao buscar deck');
    }
  };

  const fetchFlashcards = async () => {
    try {
      const response = await api.get(`/decks/${id}/flashcards`);
      setFlashcards(response.data);
    } catch (err) {
      console.error('Erro ao buscar flashcards');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFlashcard = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await api.post(`/decks/${id}/flashcards`, { front, back, reading });
      setFlashcards([...flashcards, response.data]);
      setFront('');
      setBack('');
      setReading('');
      setShowForm(false);
    } catch (err) {
      console.error('Erro ao criar flashcard');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteFlashcard = async (flashcardId) => {
    try {
      await api.delete(`/flashcards/${flashcardId}`);
      setFlashcards(flashcards.filter((f) => f.id !== flashcardId));
    } catch (err) {
      console.error('Erro ao deletar flashcard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">MangaStudy 🎌</h1>
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white transition"
        >
          ← Voltar
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">{deck?.title}</h2>
            {deck?.description && (
              <p className="text-gray-400 mt-1">{deck.description}</p>
            )}
            <p className="text-purple-400 text-sm mt-2">{flashcards.length} flashcard(s)</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold transition"
          >
            + Add card
          </button>
        </div>

        {/* Formulário de criar flashcard */}
        {showForm && (
          <form onSubmit={handleCreateFlashcard} className="bg-gray-800 p-6 rounded-2xl mb-6">
            <h3 className="text-lg font-semibold mb-4">Novo flashcard</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Frente (palavra em japonês)"
                required
              />
              <input
                type="text"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Verso (tradução)"
                required
              />
              <input
                type="text"
                value={reading}
                onChange={(e) => setReading(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Leitura em hiragana (opcional)"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {creating ? 'Criando...' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-semibold transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Lista de flashcards */}
        {flashcards.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Nenhum flashcard ainda.</p>
            <p className="text-gray-500 mt-2">Clique em "+ Add card" pra criar o primeiro!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {flashcards.map((card) => (
              <div key={card.id} className="bg-gray-800 p-5 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">{card.front}</p>
                  {card.reading && (
                    <p className="text-gray-400 text-sm">{card.reading}</p>
                  )}
                  <p className="text-purple-400 mt-1">{card.back}</p>
                </div>
                <button
                  onClick={() => handleDeleteFlashcard(card.id)}
                  className="text-red-400 hover:text-red-300 text-sm transition ml-4"
                >
                  Deletar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeckDetail;