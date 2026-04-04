// contact.controller.js
const { body, validationResult } = require('express-validator');
const db = require('../data/database');
const { success, error, validationError } = require('../utils/response.utils');

const contactValidation = [
  body('name').trim().isLength({ min:2, max:100 }),
  body('email').isEmail().normalizeEmail(),
  body('subject').trim().isLength({ min:3, max:200 }),
  body('message').trim().isLength({ min:10, max:2000 }),
];

const sendMessage = async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return validationError(res, errs.array());
  try {
    const msg = db.contact.create(req.body);
    return success(res, { id:msg.id }, 'Mensagem enviada! Respondemos em até 24h. 📬', 201);
  } catch { return error(res, 'Erro ao enviar mensagem.', 500); }
};

module.exports = { sendMessage, contactValidation };
