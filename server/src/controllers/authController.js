const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verifica se email já existe
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Criptografa a senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Cria o usuário
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    });

    // Gera o token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca o usuário
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    // Verifica a senha
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    // Gera o token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

module.exports = { register, login };