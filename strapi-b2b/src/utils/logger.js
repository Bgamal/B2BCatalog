'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Custom logger utility for Strapi B2B application
 * Provides structured logging with different levels and file output
 */
class Logger {
  constructor() {
    this.logLevels = {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      DEBUG: 3
    };
    
    this.currentLevel = process.env.LOG_LEVEL 
      ? this.logLevels[process.env.LOG_LEVEL.toUpperCase()] 
      : this.logLevels.INFO;
    
    this.logDir = path.join(process.cwd(), 'logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    try {
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true });
      }
    } catch (error) {
      console.error('Failed to create logs directory:', error.message);
    }
  }

  formatMessage(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const contextStr = Object.keys(context).length > 0 ? JSON.stringify(context) : '';
    return `[${timestamp}] [${level}] ${message} ${contextStr}`.trim();
  }

  writeToFile(level, formattedMessage) {
    try {
      const filename = `${level.toLowerCase()}-${new Date().toISOString().split('T')[0]}.log`;
      const filepath = path.join(this.logDir, filename);
      fs.appendFileSync(filepath, formattedMessage + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }

  log(level, message, context = {}) {
    const levelValue = this.logLevels[level];
    if (levelValue > this.currentLevel) return;

    const formattedMessage = this.formatMessage(level, message, context);
    
    // Console output with colors
    switch (level) {
      case 'ERROR':
        console.error('\x1b[31m%s\x1b[0m', formattedMessage);
        break;
      case 'WARN':
        console.warn('\x1b[33m%s\x1b[0m', formattedMessage);
        break;
      case 'INFO':
        console.info('\x1b[36m%s\x1b[0m', formattedMessage);
        break;
      case 'DEBUG':
        console.debug('\x1b[90m%s\x1b[0m', formattedMessage);
        break;
      default:
        console.log(formattedMessage);
    }

    // Write to file for ERROR and WARN levels
    if (level === 'ERROR' || level === 'WARN') {
      this.writeToFile(level, formattedMessage);
    }
  }

  error(message, context = {}) {
    this.log('ERROR', message, context);
  }

  warn(message, context = {}) {
    this.log('WARN', message, context);
  }

  info(message, context = {}) {
    this.log('INFO', message, context);
  }

  debug(message, context = {}) {
    this.log('DEBUG', message, context);
  }

  // Database operation logging
  logDatabaseOperation(operation, entity, data = {}) {
    this.info(`Database ${operation}`, {
      entity,
      operation,
      ...data
    });
  }

  logDatabaseError(operation, entity, error) {
    this.error(`Database ${operation} failed`, {
      entity,
      operation,
      error: error.message,
      stack: error.stack
    });
  }

  // API operation logging
  logApiRequest(method, path, userId = null) {
    this.info(`API Request: ${method} ${path}`, {
      method,
      path,
      userId,
      timestamp: new Date().toISOString()
    });
  }

  logApiError(method, path, error, userId = null) {
    this.error(`API Error: ${method} ${path}`, {
      method,
      path,
      userId,
      error: error.message,
      stack: error.stack
    });
  }

  // Application lifecycle logging
  logStartup(message, context = {}) {
    this.info(`[STARTUP] ${message}`, context);
  }

  logStartupError(message, error) {
    this.error(`[STARTUP ERROR] ${message}`, {
      error: error.message,
      stack: error.stack
    });
  }
}

// Export singleton instance
const logger = new Logger();

module.exports = {
  logger,
  logDatabaseOperation: logger.logDatabaseOperation.bind(logger),
  logDatabaseError: logger.logDatabaseError.bind(logger),
  logApiRequest: logger.logApiRequest.bind(logger),
  logApiError: logger.logApiError.bind(logger),
  logStartup: logger.logStartup.bind(logger),
  logStartupError: logger.logStartupError.bind(logger)
};
