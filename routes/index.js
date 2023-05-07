const express = require('express');

const router = express.Router();
const auth = require('../middlewares/auth');

const userRouter = require('./users');
const cardRouter = require('./cards');

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

module.exports = router;
