const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

// createUser
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      console.log('err =>', err.errors);
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
          .map((error) => error.message)
          .join('; ');
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

// getUsers
module.exports.getUsers = (req, res, next) => {
  User.find()
    .then((users) => res.status(200).send({ data: users }))
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
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

// updateUser
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      console.log('err =>', err.errors);
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
          .map((error) => error.message)
          .join('; ');
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

// updateAvatar
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.log('err =>', err.errors);
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
          .map((error) => error.message)
          .join('; ');
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};
