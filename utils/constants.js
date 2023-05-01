/* eslint no-useless-escape: "error" */
const RegExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;
const OK = 200;
const STATUS_BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const STATUS_NOT_FOUND = 404;
const STATUS_ETERNAL_SERVER_ERROR = 404;
const CONFLICT = 409;

module.exports = {
  OK,
  RegExp,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_ETERNAL_SERVER_ERROR,
  CONFLICT,
  UNAUTHORIZED,
};
