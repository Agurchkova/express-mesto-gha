const BadRequestError = require('./BadRequestError');
const NotFoundError = require('./NotFoundError');
const ConflictError = require('./ConflictError');
const UnauthorizedError = require('./UnauthorizedError');
const ForbiddenError = require('./ForbiddenError');

module.exports = {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
};
