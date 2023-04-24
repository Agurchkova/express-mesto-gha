const mongoose = require('mongoose');
const User = require('../models/user');
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require('../errors/index');
const { OK } = require('../utils/constants');

// createUser
module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(OK).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(new InternalServerError('Произошла ошибка на сервере.'));
    });
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
