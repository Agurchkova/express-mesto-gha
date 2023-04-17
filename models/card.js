const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    // link: url'ссылка на картинку,',
    type: String,
    required: true,
  },
  owner: {
    // link: url'ссылка на модель автора карточки',
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
  }],
  createdAt: {
    // дата создания
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
