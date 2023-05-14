require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/errorHandler');
const allRouters = require('./routes/index');
const { createUser, login } = require('./controllers/users');
const { signUpValidation, signInValidation } = require('./middlewares/validation');
const NotFoundError = require('./errors/NotFoundError');
const { PORT, DB_ADDRESS } = require('./config');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});
app.use(limiter);

// роуты, которым авторизация нужна
app.use(allRouters);

// роуты, не требующие авторизации (регистрация и логин)
app.post('/signup', signUpValidation, createUser);
app.post('/signin', signInValidation, login);

// обработка ошибки неправильного пути
app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не существует'));
});

app.use(errorLogger);

// обработчики ошибок
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
