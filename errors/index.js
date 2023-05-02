const BadRequestError = require('./BadRequestError');
const NotFoundError = require('./NotFoundError');
const InternalServerError = require('./InternalServerError');
const ConflictError = require('./InternalServerError');
const UnauthorizedError = require('./UnauthorizedError');
const ForbiddenError = require('./ForbiddenError');

module.exports = {
  BadRequestError,
  NotFoundError,
  InternalServerError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
};
