const router = require('express').Router();
const User = require('../models/user');

router.post('/', (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.Status(500).send({ message: `Произошла ошибка ${err}` }));
});

// getUserById
router.get('/:id', (req, res) => {
  console.log(req.params.userId);
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.Status(500).send({ message: `Произошла ошибка ${err}` }));
});

// getUsers
router.get('/', (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.Status(500).send({ message: `Произошла ошибка ${err}` }));
});

// const {
//   getUsers,
//   getUserById,
//   updateUser,
//   updateAvatar,
//   getCurrentUser,
// } = require('../controllers/users');

// router.get('/users', getUsers);
// router.get('/users/:userId', getUserById);
// router.post('/users', createUser);

module.exports = router;
