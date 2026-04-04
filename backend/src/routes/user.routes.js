const r = require('express').Router();
const c = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
r.get('/profile',    authenticate, c.getProfile);
r.put('/profile',    authenticate, c.updateProfile);
r.get('/enrollments',authenticate, c.getEnrollments);
module.exports = r;
