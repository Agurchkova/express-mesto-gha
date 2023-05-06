require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { jwtKey } = require('../utils/jwtKey');
const User = require('../models/user');
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
  ConflictError,
} = require('../errors/index');
const {
  OK,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

// User authentication
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      // создание токена
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : jwtKey,
        {
          expiresIn: '7d',
        },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      }).send({ token });
    })
    .catch(next);
};

// createUser
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    next(new BadRequestError('Неверные логин или пароль'));
  }

  return User.findOne({ email }).then((user) => {
    if (user) {
      next(new ConflictError(`Пользователь с ${email} уже существует`));
    }

    return bcrypt.hash(password, 10);
  })
    // bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      res.status(OK).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неверные данные о пользователе или неверная ссылка на аватар.'));
      }
      return next(err);
    });
  // .catch((err) => {
  //   if (err instanceof mongoose.Error.ValidationError) {
  //     next(new BadRequestError('Переданы некорректные данные'));
  //   }
  //   return next(new InternalServerError('Произошла ошибка на сервере.'));
  // });
  //     .catch((err) => {
  //       if (err.code === 11000) {
  //         return next(new ConflictError('Пользователь с указанным email уже зарегистрирован'));
  //       }
  //       if (err instanceof mongoose.Error.ValidationError) {
  //         return next(new BadRequestError('Переданы некорректные данные пользователя'));
  //       }
  //       return next(new InternalServerError('Произошла ошибка на сервере.'));
  //     });
};

// getCurrentUser
module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id).then((user) => {
    console.log(req.user._id);
    // проверка пользователя по id
    if (!user) {
      return next(new NotFoundError('Пользователь с таким id не найден'));
    }
    // возвращаем пользователя
    return res.status(OK).send(user);
  }).catch(next);
};

// getUsers
module.exports.getUsers = (req, res, next) => {
  User.find()
    .then((users) => res.status(OK).send({ data: users }))
    .catch(next);
};

// getUserById
module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError('Данные не найдены');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(new InternalServerError('Произошла ошибка на сервере.'));
    });
};

// функция обновления информации о пользователе с общей логикой
function updateInfo(res, next, id, props) {
  User.findByIdAndUpdate(
    id,
    props,
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(OK).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(new InternalServerError('Произошла ошибка на сервере.'));
    });
}

// функция-контроллер вносит изменения в данные пользователя
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  return updateInfo(res, next, userId, { name, about });
};

// функция-контроллер меняет аватар
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  return updateInfo(res, next, userId, { avatar });
};
