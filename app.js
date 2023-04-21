const express = require('express');
const mongoose = require('mongoose');
const { createUser } = require('./controllers/users');
const { userRouter, cardRouter } = require('./routes');

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
app.use(userRouter);
app.use(cardRouter);
app.post(createUser);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
