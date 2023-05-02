const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
  ForbiddenError,
} = require('../errors/index');
const { OK } = require('../utils/constants');

// getCards
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(OK).send(cards))
    .catch(next);
};

// createCard
module.exports.createCard = (req, res, next) => {
  console.log(req.user._id); // _id станет доступен
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(OK).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(new InternalServerError('Произошла ошибка на сервере.'));
    });
};

// deleteCard
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      if (card.owner.valueOf() !== _id) {
        return next(new ForbiddenError('Нет прав для удаления карточки'));
      }
      return card.remove()
        .then(() => res.send({ message: 'Карточка успешно удалена' }));
    })
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

// функция обработки лайка с общей логикой
function handleLikeCard(res, next, id, props) {
  Card.findByIdAndUpdate(
    id,
    props,
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(new InternalServerError('Произошла ошибка на сервере.'));
    });
}

// функция-контроллер ставит лайк
module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  handleLikeCard(res, next, cardId, { $addToSet: { likes: userId } });
};

// функция-контроллер удаляет лайк
module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  handleLikeCard(res, next, cardId, { $pull: { likes: userId } });
};
