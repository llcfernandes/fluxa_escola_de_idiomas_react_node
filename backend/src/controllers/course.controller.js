// ─── course.controller.js ─────────────────────────────────────────
const db = require('../data/database');
const { success, error } = require('../utils/response.utils');

const getAll     = (_req, res) => success(res, { courses: db.courses.findAll(), total: db.courses.findAll().length });
const getFeatured= (_req, res) => success(res, { courses: db.courses.findFeatured() });
const getBySlug  = (req, res)  => {
  const c = db.courses.findBySlug(req.params.slug);
  if (!c) return error(res, 'Curso não encontrado.', 404);
  return success(res, { course:c, testimonials: db.testimonials.findByCourse(c.id) });
};
const getFeaturedTestimonials = (_req, res) => success(res, { testimonials: db.testimonials.findFeatured() });
const enroll = (req, res) => {
  const c = db.courses.findBySlug(req.params.slug);
  if (!c) return error(res, 'Curso não encontrado.', 404);
  if (req.user.enrolledCourses?.includes(c.id)) return error(res, 'Já matriculado.', 409);
  db.users.update(req.user.id, { enrolledCourses: [...(req.user.enrolledCourses||[]), c.id] });
  const enrollment = db.enrollments.create({ userId:req.user.id, courseId:c.id });
  return success(res, { enrollment }, `Matrícula em ${c.language} registrada! 🎉`, 201);
};

module.exports = { getAll, getFeatured, getBySlug, getFeaturedTestimonials, enroll };
