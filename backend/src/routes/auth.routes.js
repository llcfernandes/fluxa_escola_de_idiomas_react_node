// auth.routes.js
const r = require('express').Router();
const c = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
r.post('/register', c.registerValidation, c.register);
r.post('/login',    c.loginValidation,    c.login);
r.post('/refresh',  c.refresh);
r.get('/me',        authenticate,         c.me);
module.exports = r;
