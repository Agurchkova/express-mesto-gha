require('dotenv').config();
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const errorHandler = require('./middlewares/errorHandler');
const { signUp, signIn } = require('./middlewares/validation');
const NotFoundError = require('./errors/index');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(helmet());
app.use(cookieParser());
app.use(limiter);

// роуты, не требующие авторизации (регистрация и логин)
app.post('/signup', signUp, createUser);
app.post('/signin', signIn, login);

app.use(auth);

// роуты, которым авторизация нужна
app.use('/', require('./routes/cards'));
app.use('/', require('./routes/users'));

// запрос к несуществующему роуту
app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

// обработчики ошибок
app.use(errors());
app.use(errorHandler);

// здесь обрабатываем все ошибки
app.use((err, req, res) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
