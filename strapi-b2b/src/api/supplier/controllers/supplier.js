'use strict';

/**
 * supplier controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { logger } = require('../../../utils/logger.js');
const DatabaseService = require('../../../services/database-service.js');

module.exports = createCoreController('api::supplier.supplier', ({ strapi }) => {
  const dbService = new DatabaseService(strapi);
  
  return {
    async find(ctx) {
      try {
        logger.info('Finding suppliers', { 
          query: ctx.query,
          userId: ctx.state?.user?.id 
        });

        const suppliers = await dbService.findMany('api::supplier.supplier', ctx.query);
        const sanitizedEntities = await this.sanitizeOutput(suppliers, ctx);
        return this.transformResponse(sanitizedEntities);

      } catch (error) {
        logger.error('Error finding suppliers', {
          error: error.message,
          query: ctx.query,
          userId: ctx.state?.user?.id
        });
        throw error;
      }
    },

    async findOne(ctx) {
      try {
        const { id } = ctx.params;
        
        logger.info('Finding supplier by ID', { 
          id,
          userId: ctx.state?.user?.id 
        });
        
        const supplier = await dbService.findOne('api::supplier.supplier', id);
        const sanitizedEntity = await this.sanitizeOutput(supplier, ctx);
        return this.transformResponse(sanitizedEntity);

      } catch (error) {
        logger.error('Error finding supplier', {
          id: ctx.params.id,
          error: error.message,
          userId: ctx.state?.user?.id
        });
        throw error;
      }
    }
  };
});
