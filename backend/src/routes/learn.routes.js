// learn.routes.js
const r = require('express').Router();
const c = require('../controllers/learn.controller');
const { authenticate } = require('../middleware/auth.middleware');
// Public: qualquer um pode ver exercícios
r.get('/:slug/exercises', c.getExercises);
// Auth: submissão e progresso requerem conta
r.post('/:slug/exercises/:exerciseId/answer', authenticate, c.submitAnswer);
r.get('/:slug/progress', authenticate, c.getProgress);
module.exports = r;
