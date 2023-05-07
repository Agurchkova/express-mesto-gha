const errorHandler = (err, req, res, next) => {
  console.log(err.stack || err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Ошибка на сервере';

  res.status(statusCode).send({ err, message });
  next();
};

module.exports = errorHandler;
