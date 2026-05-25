require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require('./routes/auth');
const deckRoutes = require('./routes/decks');
const flashcardRoutes = require('./routes/flashcards');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.VITE_API_URL || "http://localhost:5173" }));
app.use(express.json());

// Rotas (serão adicionadas conforme o projeto cresce)
// app.use("/auth", require("./routes/auth"));
// app.use("/flashcards", require("./routes/flashcards"));
// app.use("/decks", require("./routes/decks"));

app.use('/auth', authRoutes);
app.use('/decks', deckRoutes);
app.use('/decks/:id/flashcards', flashcardRoutes);

app.get("/", (req, res) => {
  res.json({ message: "MangaStudy API rodando 🎌" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
