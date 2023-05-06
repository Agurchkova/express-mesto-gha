const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { RegExp } = require('../utils/constants');

const {
  getCurrentUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  createUser,
} = require('../controllers/users');

const {
  userIdValidation,
  updateUserValidation,
  updateAvatarValidation,
} = require('../middlewares/validation');

router.get('/me', getCurrentUser);
router.get('/:userId', userIdValidation, getUserById);
router.get('/', getUsers);
router.patch('/me', updateUserValidation, updateUser);
router.patch('/me/avatar', updateAvatarValidation, updateAvatar);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi
      .string()
      .pattern(RegExp),
  }),
}), createUser);

module.exports = router;
