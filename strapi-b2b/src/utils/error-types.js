'use strict';

/**
 * Custom error types for Strapi B2B application
 * Provides standardized error handling across the application
 */

class ApplicationError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = 'ApplicationError';
    this.status = status;
    this.details = details;
  }
}

class ValidationError extends ApplicationError {
  constructor(message, details = null) {
    super(message, 400, details);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends ApplicationError {
  constructor(message = 'Resource not found', details = null) {
    super(message, 404, details);
    this.name = 'NotFoundError';
  }
}

class UnauthorizedError extends ApplicationError {
  constructor(message = 'Unauthorized access', details = null) {
    super(message, 401, details);
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends ApplicationError {
  constructor(message = 'Access forbidden', details = null) {
    super(message, 403, details);
    this.name = 'ForbiddenError';
  }
}

class DatabaseError extends ApplicationError {
  constructor(message, details = null) {
    super(message, 500, details);
    this.name = 'DatabaseError';
  }
}

class ExternalServiceError extends ApplicationError {
  constructor(message, status = 502, details = null) {
    super(message, status, details);
    this.name = 'ExternalServiceError';
  }
}

module.exports = {
  ApplicationError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  DatabaseError,
  ExternalServiceError
};
