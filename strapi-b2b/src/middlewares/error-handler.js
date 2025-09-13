'use strict';

const { logger } = require('../utils/logger.js');

/**
 * Global error handling middleware for Strapi B2B application
 * Catches and logs all unhandled errors with proper context
 */
module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    try {
      // Log incoming request
      logger.logApiRequest(
        ctx.method,
        ctx.path,
        ctx.state?.user?.id || null
      );

      await next();

      // Log successful response
      if (ctx.status >= 200 && ctx.status < 300) {
        logger.debug(`API Success: ${ctx.method} ${ctx.path}`, {
          status: ctx.status,
          userId: ctx.state?.user?.id || null
        });
      }
    } catch (error) {
      // Log the error with full context
      logger.logApiError(
        ctx.method,
        ctx.path,
        error,
        ctx.state?.user?.id || null
      );

      // Determine error type and set appropriate response
      let status = 500;
      let message = 'Internal Server Error';
      let details = null;

      if (error.name === 'ValidationError') {
        status = 400;
        message = 'Validation Error';
        details = error.details || error.message;
      } else if (error.name === 'NotFoundError' || error.status === 404) {
        status = 404;
        message = 'Resource Not Found';
        details = error.message;
      } else if (error.name === 'UnauthorizedError' || error.status === 401) {
        status = 401;
        message = 'Unauthorized';
        details = 'Authentication required';
      } else if (error.name === 'ForbiddenError' || error.status === 403) {
        status = 403;
        message = 'Forbidden';
        details = 'Insufficient permissions';
      } else if (error.status && error.status >= 400 && error.status < 500) {
        status = error.status;
        message = error.message || 'Bad Request';
        details = error.details;
      } else if (error.name === 'DatabaseError' || error.code?.startsWith('ER_')) {
        status = 500;
        message = 'Database Error';
        details = process.env.NODE_ENV === 'development' ? error.message : 'Database operation failed';
        
        // Log database errors with more detail
        logger.error('Database operation failed', {
          path: ctx.path,
          method: ctx.method,
          sqlState: error.sqlState,
          sqlMessage: error.sqlMessage,
          code: error.code
        });
      }

      // Set error response
      ctx.status = status;
      ctx.body = {
        error: {
          status,
          name: error.name || 'Error',
          message,
          details: details || (process.env.NODE_ENV === 'development' ? error.message : undefined)
        },
        data: null
      };

      // Log critical errors to file
      if (status >= 500) {
        logger.error(`Critical API Error: ${ctx.method} ${ctx.path}`, {
          status,
          error: error.message,
          stack: error.stack,
          userId: ctx.state?.user?.id || null,
          body: ctx.request.body,
          query: ctx.query
        });
      }
    }
  };
};
