const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

// getCard
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

// createCard
module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
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

// deleteCard
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findById(cardId)
    .orFail(() => {
      res.status(404).send({ message: 'Карточка не найдена' });
      throw new NotFoundError();
    })
    .then((card) => {
      if (card.owner.valueOf() !== _id) {
        throw new Error('Нет прав для удаления чужой карточки');
      }
      Card.findByIdAndRemove(cardId)
        .then((deletedCard) => res.status(200)
          .send({ deletedCard, message: 'Карточка успешно удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        throw new BadRequestError();
      } else {
        res.status(200).send(Card);
      }
    });
};

// likeCard
module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true, runValidators: true },
)
  .orFail(() => {
    res.status(404).send({ message: 'Карточка не найдена' });
    throw new NotFoundError();
  })
  .then((card) => res.send({ data: card, message: 'Лайк успешно поставлен' }))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
      throw new BadRequestError();
    } else {
      res.status(200).send(Card);
    }
  });

// dislikeCard
module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true, runValidators: true },
)
  .orFail(() => {
    res.status(404).send({ message: 'Карточка не найдена' });
    throw new NotFoundError();
  })
  .then((card) => res.send({ data: card, message: 'Лайк успешно удален' }))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
      throw new BadRequestError();
    } else {
      res.status(200).send(Card);
    }
  });
