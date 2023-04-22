const errorHandler = (err, req, res, next) => {
  console.log(err.stack || err);
  const status = err.statusCode || 500;
  const message = err.message || 'Ошибка на сервере';

  res.status(status).send({ err, message });
  next();
};

module.exports = errorHandler;
