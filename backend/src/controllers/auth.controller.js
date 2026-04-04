const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const db = require('../data/database');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, sanitizeUser } = require('../utils/jwt.utils');
const { success, error, validationError } = require('../utils/response.utils');

const registerValidation = [
  body('name').trim().isLength({ min:2, max:100 }).withMessage('Nome: 2–100 caracteres.'),
  body('email').isEmail().normalizeEmail().withMessage('E-mail inválido.'),
  body('password').isLength({ min:8 }).withMessage('Senha: mínimo 8 caracteres.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Senha precisa de maiúscula, minúscula e número.'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('E-mail inválido.'),
  body('password').notEmpty().withMessage('Senha obrigatória.'),
];

const register = async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return validationError(res, errs.array());
  try {
    const { name, email, password, language = 'pt' } = req.body;
    if (db.users.findByEmail(email)) return error(res, 'E-mail já cadastrado.', 409);
    const hashed = await bcrypt.hash(password, 10);
    const user   = db.users.create({ name:name.trim(), email, password:hashed, language });
    const accessToken  = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return success(res, { user:sanitizeUser(user), accessToken, refreshToken }, 'Conta criada! Bem-vindo à Fluxa! 🎉', 201);
  } catch (e) { return error(res, 'Erro ao criar conta.', 500); }
};

const login = async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return validationError(res, errs.array());
  try {
    const { email, password } = req.body;
    const user = db.users.findByEmail(email);
    if (!user) return error(res, 'E-mail ou senha incorretos.', 401);
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return error(res, 'E-mail ou senha incorretos.', 401);
    const accessToken  = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return success(res, { user:sanitizeUser(user), accessToken, refreshToken }, `Olá, ${user.name.split(' ')[0]}! 👋`);
  } catch (e) { return error(res, 'Erro ao fazer login.', 500); }
};

const refresh = (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return error(res, 'Refresh token não fornecido.', 400);
    const decoded = verifyRefreshToken(refreshToken);
    const user    = db.users.findById(decoded.id);
    if (!user) return error(res, 'Usuário não encontrado.', 401);
    return success(res, { accessToken:generateAccessToken(user), refreshToken:generateRefreshToken(user) });
  } catch (e) {
    if (e.name === 'TokenExpiredError') return error(res, 'Sessão expirada.', 401);
    return error(res, 'Token inválido.', 401);
  }
};

const me = (req, res) => success(res, { user:req.user });

module.exports = { register, login, refresh, me, registerValidation, loginValidation };
