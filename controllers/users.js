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
        throw new BadRequestError();
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

// getUsers
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      if (User) {
        res.send({ data: User });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

// getUserById
module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      res.status(404).send({ message: 'Данные не найдены' });
      throw new NotFoundError();
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({ message: 'Данные не найдены' });
        throw new NotFoundError();
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
        throw new BadRequestError();
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
        throw new BadRequestError();
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};
