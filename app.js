require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middlewares/errorHandler');
const allRouters = require('./routes/index');
const { createUser, login } = require('./controllers/users');
const { signUp, signIn } = require('./middlewares/validation');
const NotFoundError = require('./errors/NotFoundError');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cookieParser());
app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});
app.use(limiter);

// роуты, которым авторизация нужна
app.use(allRouters);

// роуты, не требующие авторизации (регистрация и логин)
app.post('/signup', signUp, createUser);
app.post('/signin', signIn, login);

// обработка ошибки неправильного пути
app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не существует'));
});
// обработчики ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
