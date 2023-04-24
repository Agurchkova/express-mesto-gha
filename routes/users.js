const userRouter = require('express').Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRouter.post('/', createUser);
userRouter.get('/:userId', getUserById);
userRouter.get('/', getUsers);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateAvatar);

module.exports = { userRouter };
