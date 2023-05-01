const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/:userId', getUserById);
router.get('/', getUsers);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);
router.get('/me', getCurrentUser);

module.exports = router;
