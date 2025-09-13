'use strict';

const { logger } = require('../utils/logger.js');

/**
 * Request logging middleware for detailed API monitoring
 */
module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const startTime = Date.now();
    
    // Log request details
    const requestInfo = {
      method: ctx.method,
      path: ctx.path,
      userAgent: ctx.headers['user-agent'],
      ip: ctx.ip,
      userId: ctx.state?.user?.id || null,
      timestamp: new Date().toISOString()
    };

    // Log query parameters for GET requests
    if (ctx.method === 'GET' && Object.keys(ctx.query).length > 0) {
      requestInfo.query = ctx.query;
    }

    // Log body for POST/PUT/PATCH requests (excluding sensitive data)
    if (['POST', 'PUT', 'PATCH'].includes(ctx.method) && ctx.request.body) {
      const body = { ...ctx.request.body };
      // Remove sensitive fields
      delete body.password;
      delete body.token;
      delete body.secret;
      requestInfo.body = body;
    }

    logger.info(`Incoming request: ${ctx.method} ${ctx.path}`, requestInfo);

    await next();

    // Log response details
    const duration = Date.now() - startTime;
    const responseInfo = {
      status: ctx.status,
      duration: `${duration}ms`,
      contentLength: ctx.length || 0
    };

    if (ctx.status >= 400) {
      logger.warn(`Request completed with error: ${ctx.method} ${ctx.path}`, {
        ...requestInfo,
        ...responseInfo
      });
    } else {
      logger.info(`Request completed: ${ctx.method} ${ctx.path}`, {
        ...requestInfo,
        ...responseInfo
      });
    }
  };
};
