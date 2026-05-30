import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Flashcard() {
  const [flashcards, setFlashcards] = useState([]);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [reading, setReading] = useState('');
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      const response = await api.get('/decks');
      setDecks(response.data);
    } catch (err) {
      console.error('Erro ao buscar decks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeck = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await api.post('/decks', { title, description });
      setDecks([...decks, { ...response.data, _count: { flashcards: 0 } }]);
      setTitle('');
      setDescription('');
      setShowForm(false);
    } catch (err) {
      console.error('Erro ao criar deck');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteDeck = async (id) => {
    try {
      await api.delete(`/decks/${id}`);
      setDecks(decks.filter((deck) => deck.id !== id));
    } catch (err) {
      console.error('Erro ao deletar deck');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Olá, {user.name}!</span>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white transition"
          >
            Sair
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Seus Decks</h2>
            <p className="text-gray-400 mt-1">{decks.length} deck(s) criado(s)</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/study')}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition"
            >
              Estudar agora
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold transition"
            >
              + Novo deck
            </button>
          </div>
        </div>

        {/* Formulário de criar deck */}
        {showForm && (
          <form onSubmit={handleCreateDeck} className="bg-gray-800 p-6 rounded-2xl mb-6">
            <h3 className="text-lg font-semibold mb-4">Novo deck</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Nome do deck"
                required
              />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Descrição (opcional)"
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

        {/* Lista de decks */}
        {decks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Nenhum deck ainda.</p>
            <p className="text-gray-500 mt-2">Crie seu primeiro deck pra começar a estudar!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {decks.map((deck) => (
              <div key={deck.id} className="bg-gray-800 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold">{deck.title}</h3>
                {deck.description && (
                  <p className="text-gray-400 text-sm mt-1">{deck.description}</p>
                )}
                <p className="text-purple-400 text-sm mt-3">
                  {deck._count.flashcards} flashcard(s)
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleDeleteDeck(deck.id)}
                    className="text-red-400 hover:text-red-300 text-sm transition"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Flashcard;