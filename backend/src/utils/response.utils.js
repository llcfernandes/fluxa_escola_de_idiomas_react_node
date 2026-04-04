/**
 * Padroniza respostas da API
 */

const success = (res, data = {}, message = 'Operação realizada com sucesso', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

const error = (res, message = 'Erro interno do servidor', statusCode = 500, details = null) => {
  const body = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };
  if (details && process.env.NODE_ENV !== 'production') {
    body.details = details;
  }
  return res.status(statusCode).json(body);
};

const validationError = (res, errors) => {
  return res.status(422).json({
    success: false,
    message: 'Dados inválidos. Verifique os campos e tente novamente.',
    errors,
    timestamp: new Date().toISOString(),
  });
};

module.exports = { success, error, validationError };
