const { celebrate, Joi } = require('celebrate');
const { RegExp } = require('../utils/constants');

// signUp(регистрация)
const signUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(30),
    avatar: Joi.string().pattern(RegExp),
  }),
});

// signIn(логин)
const signIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(30),
  }),
});

// userIdValidation
const userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
});

// updateUserValidation
const updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

// updateAvatarValidation
const updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(RegExp),
  }),
});

// createCardValidation
const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(RegExp),
  }),
});

// cardIdValidation
const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
});

module.exports = {
  signUp,
  signIn,
  userIdValidation,
  updateUserValidation,
  updateAvatarValidation,
  createCardValidation,
  cardIdValidation,
};
