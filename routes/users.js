const userRouter = require('express').Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRouter.post('/users', createUser);
userRouter.get('/users/:userId', getUserById);
userRouter.get('/users', getUsers);
userRouter.patch('/users/me', updateUser);
userRouter.patch('/users/me/avatar', updateAvatar);

module.exports = { userRouter };
