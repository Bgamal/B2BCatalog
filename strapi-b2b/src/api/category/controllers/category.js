'use strict';

/**
 * category controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { logger } = require('../../../utils/logger.js');
const DatabaseService = require('../../../services/database-service.js');

module.exports = createCoreController('api::category.category', ({ strapi }) => {
  const dbService = new DatabaseService(strapi);
  
  return {
    async find(ctx) {
      try {
        logger.info('Finding categories', { 
          query: ctx.query,
          userId: ctx.state?.user?.id 
        });

        const categories = await dbService.findMany('api::category.category', ctx.query);
        const sanitizedEntities = await this.sanitizeOutput(categories, ctx);
        return this.transformResponse(sanitizedEntities);

      } catch (error) {
        logger.error('Error finding categories', {
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
        
        logger.info('Finding category by ID', { 
          id,
          userId: ctx.state?.user?.id 
        });
        
        const category = await dbService.findOne('api::category.category', id);
        const sanitizedEntity = await this.sanitizeOutput(category, ctx);
        return this.transformResponse(sanitizedEntity);

      } catch (error) {
        logger.error('Error finding category', {
          id: ctx.params.id,
          error: error.message,
          userId: ctx.state?.user?.id
        });
        throw error;
      }
    }
  };
});
