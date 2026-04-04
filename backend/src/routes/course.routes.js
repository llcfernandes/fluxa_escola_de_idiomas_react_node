// course.routes.js
const r = require('express').Router();
const c = require('../controllers/course.controller');
const { authenticate } = require('../middleware/auth.middleware');
r.get('/',                      c.getAll);
r.get('/featured',              c.getFeatured);
r.get('/testimonials/featured', c.getFeaturedTestimonials);
r.get('/:slug',                 c.getBySlug);
r.post('/:slug/enroll',         authenticate, c.enroll);
module.exports = r;
