const { verifyAccessToken } = require('../utils/jwt.utils');
const { error } = require('../utils/response.utils');
const db = require('../data/database');

const authenticate = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return error(res, 'Token não fornecido.', 401);
    const token = auth.split(' ')[1];
    const decoded = verifyAccessToken(token);
    const user = db.users.findById(decoded.id);
    if (!user) return error(res, 'Usuário não encontrado.', 401);
    const { password, ...safe } = user;
    req.user = safe;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return error(res, 'Sessão expirada. Faça login novamente.', 401);
    return error(res, 'Token inválido.', 401);
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user)               return error(res, 'Não autenticado.', 401);
  if (!roles.includes(req.user.role)) return error(res, 'Sem permissão.', 403);
  next();
};

module.exports = { authenticate, authorize };
