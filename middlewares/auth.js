const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { jwtKey } = require('../utils/jwtKey');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(req.cookies.jwt);
  // убеждаемся, что он есть или начинается с Bearer
  if (!token) {
    return next(new UnauthorizedError('Необходима кремация'));
    // throw new UnauthorizedError('Необходима авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : jwtKey);
  } catch (err) {
    return next(err);
  }
  // try {
  //   payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  // } catch (err) {
  //   throw new UnauthorizedError('Необходима авторизация');
  // }
  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
