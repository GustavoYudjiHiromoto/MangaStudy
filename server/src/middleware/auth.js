const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Pega o token do header da requisição
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // O token vem no formato "Bearer TOKEN"
  const token = authHeader.split(' ')[1];

  try {
    // Verifica se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Coloca o userId dentro do req pra usar nas rotas
    req.userId = decoded.userId;

    next(); // libera pra próxima etapa
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = authMiddleware;