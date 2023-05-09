require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const {
  BadRequestError,
  NotFoundError,
  ConflictError,
} = require('../errors/index');
const {
  OK,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET, jwtKey } = require('../config');

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
      }).send({ _id: user._id });
    })
    .catch(next);
};

// createUser
module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      ...req.body, password: hash,
    }))
    .then(({
      email,
      name,
      about,
      avatar,
      _id,
    }) => {
      res.status(OK).send(
        {
          data: {
            email, name, about, avatar, _id,
          },
        },
      );
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

// getCurrentUser
module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id).then((user) => {
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
      return next(err);
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
      return next(err);
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
