'use strict';

const { logger, logDatabaseOperation, logDatabaseError } = require('../utils/logger.js');

/**
 * Database service wrapper with comprehensive error handling and logging
 * Wraps Strapi's entityService with proper error handling and logging
 */
class DatabaseService {
  constructor(strapi) {
    this.strapi = strapi;
  }

  /**
   * Find multiple entities with error handling
   */
  async findMany(uid, params = {}) {
    try {
      logDatabaseOperation('FIND_MANY', uid, { params });
      
      const result = await this.strapi.entityService.findMany(uid, params);
      
      logger.debug(`Found ${result?.length || 0} entities`, {
        entity: uid,
        count: result?.length || 0
      });
      
      return result;
    } catch (error) {
      logDatabaseError('FIND_MANY', uid, error);
      throw this.handleDatabaseError(error, 'FIND_MANY', uid);
    }
  }

  /**
   * Find single entity with error handling
   */
  async findOne(uid, id, params = {}) {
    try {
      logDatabaseOperation('FIND_ONE', uid, { id, params });
      
      const result = await this.strapi.entityService.findOne(uid, id, params);
      
      if (!result) {
        logger.warn(`Entity not found`, { entity: uid, id });
        const error = new Error(`${uid} with id ${id} not found`);
        error.name = 'NotFoundError';
        error.status = 404;
        throw error;
      }
      
      logger.debug(`Found entity`, { entity: uid, id });
      return result;
    } catch (error) {
      if (error.name === 'NotFoundError') {
        throw error;
      }
      logDatabaseError('FIND_ONE', uid, error);
      throw this.handleDatabaseError(error, 'FIND_ONE', uid);
    }
  }

  /**
   * Create entity with error handling
   */
  async create(uid, params = {}) {
    try {
      logDatabaseOperation('CREATE', uid, { 
        hasData: !!params.data,
        dataKeys: params.data ? Object.keys(params.data) : []
      });
      
      const result = await this.strapi.entityService.create(uid, params);
      
      logger.info(`Created entity`, { 
        entity: uid, 
        id: result?.id,
        documentId: result?.documentId 
      });
      
      return result;
    } catch (error) {
      logDatabaseError('CREATE', uid, error);
      throw this.handleDatabaseError(error, 'CREATE', uid);
    }
  }

  /**
   * Update entity with error handling
   */
  async update(uid, id, params = {}) {
    try {
      logDatabaseOperation('UPDATE', uid, { 
        id,
        hasData: !!params.data,
        dataKeys: params.data ? Object.keys(params.data) : []
      });
      
      const result = await this.strapi.entityService.update(uid, id, params);
      
      if (!result) {
        logger.warn(`Entity not found for update`, { entity: uid, id });
        const error = new Error(`${uid} with id ${id} not found`);
        error.name = 'NotFoundError';
        error.status = 404;
        throw error;
      }
      
      logger.info(`Updated entity`, { entity: uid, id });
      return result;
    } catch (error) {
      if (error.name === 'NotFoundError') {
        throw error;
      }
      logDatabaseError('UPDATE', uid, error);
      throw this.handleDatabaseError(error, 'UPDATE', uid);
    }
  }

  /**
   * Delete entity with error handling
   */
  async delete(uid, id, params = {}) {
    try {
      logDatabaseOperation('DELETE', uid, { id, params });
      
      const result = await this.strapi.entityService.delete(uid, id, params);
      
      if (!result) {
        logger.warn(`Entity not found for deletion`, { entity: uid, id });
        const error = new Error(`${uid} with id ${id} not found`);
        error.name = 'NotFoundError';
        error.status = 404;
        throw error;
      }
      
      logger.info(`Deleted entity`, { entity: uid, id });
      return result;
    } catch (error) {
      if (error.name === 'NotFoundError') {
        throw error;
      }
      logDatabaseError('DELETE', uid, error);
      throw this.handleDatabaseError(error, 'DELETE', uid);
    }
  }

  /**
   * Count entities with error handling
   */
  async count(uid, params = {}) {
    try {
      logDatabaseOperation('COUNT', uid, { params });
      
      const result = await this.strapi.entityService.count(uid, params);
      
      logger.debug(`Counted entities`, { entity: uid, count: result });
      return result;
    } catch (error) {
      logDatabaseError('COUNT', uid, error);
      throw this.handleDatabaseError(error, 'COUNT', uid);
    }
  }

  /**
   * Handle and transform database errors
   */
  handleDatabaseError(error, operation, uid) {
    // Handle specific database errors
    if (error.code === 'ER_DUP_ENTRY' || error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      const newError = new Error(`Duplicate entry for ${uid}`);
      newError.name = 'ValidationError';
      newError.status = 400;
      newError.details = 'A record with this data already exists';
      return newError;
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
      const newError = new Error(`Invalid reference in ${uid}`);
      newError.name = 'ValidationError';
      newError.status = 400;
      newError.details = 'Referenced record does not exist';
      return newError;
    }

    if (error.code === 'ER_BAD_FIELD_ERROR') {
      const newError = new Error(`Invalid field in ${uid}`);
      newError.name = 'ValidationError';
      newError.status = 400;
      newError.details = error.message;
      return newError;
    }

    if (error.code === 'ER_DATA_TOO_LONG') {
      const newError = new Error(`Data too long for ${uid}`);
      newError.name = 'ValidationError';
      newError.status = 400;
      newError.details = 'One or more fields exceed maximum length';
      return newError;
    }

    // Handle connection errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      const newError = new Error('Database connection failed');
      newError.name = 'DatabaseError';
      newError.status = 503;
      newError.details = 'Unable to connect to database';
      return newError;
    }

    // Handle timeout errors
    if (error.code === 'ETIMEDOUT') {
      const newError = new Error('Database operation timed out');
      newError.name = 'DatabaseError';
      newError.status = 504;
      newError.details = 'Database query took too long to complete';
      return newError;
    }

    // Default error handling
    error.name = error.name || 'DatabaseError';
    error.status = error.status || 500;
    return error;
  }

  /**
   * Execute raw query with error handling (use with caution)
   */
  async executeRawQuery(query, params = []) {
    try {
      logger.debug('Executing raw query', { 
        query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
        paramCount: params.length
      });
      
      const result = await this.strapi.db.connection.raw(query, params);
      
      logger.debug('Raw query executed successfully');
      return result;
    } catch (error) {
      logger.error('Raw query execution failed', {
        query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
        error: error.message,
        stack: error.stack
      });
      throw this.handleDatabaseError(error, 'RAW_QUERY', 'custom');
    }
  }
}

module.exports = DatabaseService;
