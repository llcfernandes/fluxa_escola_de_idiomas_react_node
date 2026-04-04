const db = require('../data/database');
const { success, error } = require('../utils/response.utils');

const getProfile = (req, res) => {
  const user = db.users.findById(req.user.id);
  if (!user) return error(res, 'Não encontrado.', 404);
  const { password, ...safe } = user;
  return success(res, { user: safe });
};

const updateProfile = (req, res) => {
  const { name, language } = req.body;
  const updated = db.users.update(req.user.id, { name, language });
  const { password, ...safe } = updated;
  return success(res, { user: safe }, 'Perfil atualizado.');
};

const getEnrollments = (req, res) => {
  const enrollments = db.enrollments.findByUser(req.user.id);
  return success(res, { enrollments });
};

module.exports = { getProfile, updateProfile, getEnrollments };
