const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError('Требуется авторизация');
  }

  // верификация токена
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    throw new UnauthorizedError('shit');
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
