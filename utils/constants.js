/* eslint no-useless-escape: "error" */
const REGEXP_URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;
const OK = 200;
const STATUS_BAD_REQUEST = 400;
const STATUS_NOT_FOUND = 404;
const STATUS_ETERNAL_SERVER_ERROR = 404;

module.exports = {
  OK,
  REGEXP_URL,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_ETERNAL_SERVER_ERROR,
};
