/**
 * learn.controller.js — Motor de Exercícios APA
 * Gerencia exercícios, submissão de respostas e progresso do aluno
 */
const db = require('../data/database');
const { success, error } = require('../utils/response.utils');

/**
 * GET /api/learn/:slug/exercises
 * Retorna exercícios de um curso (opcionalmente filtrado por phase: A, P, ou 'apply')
 */
const getExercises = (req, res) => {
  const course = db.courses.findBySlug(req.params.slug);
  if (!course) return error(res, 'Curso não encontrado.', 404);

  let exercises = db.courses.getExercises(course.id);

  // Filtrar por fase APA se solicitado
  const { phase } = req.query;
  if (phase && ['A','P'].includes(phase.toUpperCase())) {
    exercises = exercises.filter(e => e.phase === phase.toUpperCase());
  }

  // Remover resposta correta antes de enviar (segurança)
  const sanitized = exercises.map(({ correct, ...rest }) => ({
    ...rest,
    totalOptions: Array.isArray(rest.options) ? rest.options.length : null,
  }));

  return success(res, { exercises: sanitized, total: sanitized.length, courseId: course.id });
};

/**
 * POST /api/learn/:slug/exercises/:exerciseId/answer
 * Valida resposta do aluno e retorna feedback detalhado
 */
const submitAnswer = (req, res) => {
  const course = db.courses.findBySlug(req.params.slug);
  if (!course) return error(res, 'Curso não encontrado.', 404);

  const exercises = db.courses.getExercises(course.id);
  const exercise  = exercises.find(e => e.id === req.params.exerciseId);
  if (!exercise) return error(res, 'Exercício não encontrado.', 404);

  const { answer } = req.body;
  if (answer === undefined || answer === null) return error(res, 'Resposta não fornecida.', 400);

  let isCorrect = false;
  let feedback  = '';

  switch (exercise.type) {
    case 'multiple_choice':
    case 'fill_blank':
    case 'tone_match':
      isCorrect = Number(answer) === exercise.correct;
      feedback  = exercise.explanation;
      break;

    case 'reorder':
      isCorrect = String(answer).toLowerCase().trim() === exercise.correct.toLowerCase();
      feedback  = exercise.explanation || (isCorrect ? '✅ Ordem correta!' : `❌ A ordem correta é: "${exercise.correct}"`);
      break;

    case 'translation':
      const normalized = String(answer).toLowerCase().trim();
      isCorrect = exercise.acceptedAnswers.some(a =>
        normalized.includes(a.toLowerCase().substring(0, 20))
      );
      feedback = exercise.tip || (isCorrect ? '✅ Boa tradução!' : `💡 Uma boa resposta seria: "${exercise.acceptedAnswers[0]}"`);
      break;

    default:
      isCorrect = false;
      feedback  = 'Tipo de exercício não reconhecido.';
  }

  // Salvar progresso se autenticado
  if (req.user) {
    db.progress.save(req.user.id, course.id, exercise.id, {
      exerciseType: exercise.type,
      phase:        exercise.phase,
      isCorrect,
      answeredAt:   new Date().toISOString(),
    });
  }

  // Fase APA do resultado: o "Ajustar" é o feedback
  const apaPhase = isCorrect ? 'Praticar' : 'Ajustar';

  return success(res, {
    correct:    isCorrect,
    apaPhase,
    feedback,
    explanation: exercise.explanation,
    correctAnswer: isCorrect ? null : (
      exercise.type === 'reorder' ? exercise.correct :
      exercise.type === 'translation' ? exercise.acceptedAnswers[0] :
      exercise.options?.[exercise.correct]
    ),
    // Dica de próximo passo APA
    nextStep: isCorrect
      ? 'Ótimo! Siga para o próximo exercício para consolidar (Praticar).'
      : 'Reveja a explicação e tente novamente (Ajustar → Adquirir).',
  });
};

/**
 * GET /api/learn/:slug/progress
 * Retorna progresso do aluno autenticado no curso
 */
const getProgress = (req, res) => {
  const course = db.courses.findBySlug(req.params.slug);
  if (!course) return error(res, 'Curso não encontrado.', 404);

  const results   = db.progress.get(req.user.id, course.id);
  const total     = results.length;
  const correct   = results.filter(r => r.isCorrect).length;
  const byPhase   = { A: { total:0, correct:0 }, P: { total:0, correct:0 } };

  results.forEach(r => {
    if (byPhase[r.phase]) {
      byPhase[r.phase].total++;
      if (r.isCorrect) byPhase[r.phase].correct++;
    }
  });

  return success(res, {
    courseId:   course.id,
    totalAnswered: total,
    totalCorrect:  correct,
    accuracy:      total ? Math.round((correct/total)*100) : 0,
    byPhase,
    enrolledAt: db.enrollments.findByUser(req.user.id).find(e => e.courseId === course.id)?.startedAt || null,
    // Lacunas identificadas (fase Ajustar do APA)
    gaps: results
      .filter(r => !r.isCorrect)
      .slice(-5)
      .map(r => ({ exerciseId:r.lessonId, phase:r.phase, at:r.at })),
  });
};

module.exports = { getExercises, submitAnswer, getProgress };
