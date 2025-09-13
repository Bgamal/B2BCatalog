'use strict';

/**
 * product controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { logger } = require('../../../utils/logger.js');
const DatabaseService = require('../../../services/database-service.js');

module.exports = createCoreController('api::product.product', ({ strapi }) => {
  const dbService = new DatabaseService(strapi);
  
  return {
    async find(ctx) {
      try {
        logger.info('Finding products', { 
          query: ctx.query,
          userId: ctx.state?.user?.id 
        });

        // Use database service with error handling
        const products = await dbService.findMany('api::product.product', {
          ...ctx.query,
          populate: {
            images: true,
            category: {
              populate: '*',
            },
            supplier: {
              populate: '*',
            },
          },
        });

        // Sanitize the response
        const sanitizedEntities = await this.sanitizeOutput(products, ctx);
        return this.transformResponse(sanitizedEntities);

      } catch (error) {
        logger.error('Error finding products', {
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
        
        logger.info('Finding product by ID', { 
          id,
          userId: ctx.state?.user?.id 
        });
        
        // Use database service with error handling
        const product = await dbService.findOne('api::product.product', id, {
          populate: {
            images: true,
            category: {
              populate: '*',
            },
            supplier: {
              populate: '*',
            },
          },
        });

        // Sanitize the response
        const sanitizedEntity = await this.sanitizeOutput(product, ctx);
        return this.transformResponse(sanitizedEntity);

      } catch (error) {
        logger.error('Error finding product', {
          id: ctx.params.id,
          error: error.message,
          userId: ctx.state?.user?.id
        });
        throw error;
      }
    },

    async create(ctx) {
      try {
        logger.info('Creating product', { 
          hasData: !!ctx.request.body.data,
          userId: ctx.state?.user?.id 
        });

        // Use database service with error handling
        const product = await dbService.create('api::product.product', {
          data: ctx.request.body.data,
          populate: {
            images: true,
            category: {
              populate: '*',
            },
            supplier: {
              populate: '*',
            },
          },
        });

        // Sanitize the response
        const sanitizedEntity = await this.sanitizeOutput(product, ctx);
        return this.transformResponse(sanitizedEntity);

      } catch (error) {
        logger.error('Error creating product', {
          error: error.message,
          data: ctx.request.body.data,
          userId: ctx.state?.user?.id
        });
        throw error;
      }
    },

    async update(ctx) {
      try {
        const { id } = ctx.params;
        
        logger.info('Updating product', { 
          id,
          hasData: !!ctx.request.body.data,
          userId: ctx.state?.user?.id 
        });

        // Use database service with error handling
        const product = await dbService.update('api::product.product', id, {
          data: ctx.request.body.data,
          populate: {
            images: true,
            category: {
              populate: '*',
            },
            supplier: {
              populate: '*',
            },
          },
        });

        // Sanitize the response
        const sanitizedEntity = await this.sanitizeOutput(product, ctx);
        return this.transformResponse(sanitizedEntity);

      } catch (error) {
        logger.error('Error updating product', {
          id: ctx.params.id,
          error: error.message,
          data: ctx.request.body.data,
          userId: ctx.state?.user?.id
        });
        throw error;
      }
    },

    async delete(ctx) {
      try {
        const { id } = ctx.params;
        
        logger.info('Deleting product', { 
          id,
          userId: ctx.state?.user?.id 
        });

        // Use database service with error handling
        const product = await dbService.delete('api::product.product', id);

        // Sanitize the response
        const sanitizedEntity = await this.sanitizeOutput(product, ctx);
        return this.transformResponse(sanitizedEntity);

      } catch (error) {
        logger.error('Error deleting product', {
          id: ctx.params.id,
          error: error.message,
          userId: ctx.state?.user?.id
        });
        throw error;
      }
    }
  };
});
