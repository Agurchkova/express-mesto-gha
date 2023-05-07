const router = require('express').Router();

const {
  getCurrentUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
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

module.exports = router;
