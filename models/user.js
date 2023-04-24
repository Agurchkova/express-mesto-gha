const mongoose = require('mongoose');
const { REGEXP_URL } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        return REGEXP_URL.test(v);
      },
      message: 'данные в поле аватар не являются ссылкой',
    },
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
