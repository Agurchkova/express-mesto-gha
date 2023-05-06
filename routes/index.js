const express = require('express');
const { errors } = require('celebrate');
const errorHandler = require('../middlewares/errorHandler');
const NotFoundError = require('../errors/NotFoundError');
const { createUser, login } = require('../controllers/users');
const { signUp, signIn } = require('../middlewares/validation');

const router = express.Router();
const auth = require('../middlewares/auth');

const userRouter = require('./users');
const cardRouter = require('./cards');

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

// роуты, не требующие авторизации (регистрация и логин)
router.post('/signup', signUp, createUser);
router.post('/signin', signIn, login);

router.use(errorHandler);
// обработка ошибки неправильного пути
router.use('*', auth, () => {
  throw new NotFoundError('Запрашиваемая страница не найдена');
});

router.use(errors());

module.exports = router;
