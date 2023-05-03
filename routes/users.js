const router = require('express').Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/:userId', getUserById);
router.get('/', getUsers);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
