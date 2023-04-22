const express = require('express');
const mongoose = require('mongoose');
// const { createUser } = require('./controllers/users');
const { userRouter, cardRouter } = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '644111c121971bd6bdec4dc1',
  };

  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(userRouter);
app.use(cardRouter);
app.use(errorHandler);

// запрос к несуществующему роуту
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
  throw new Error('Not found');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
