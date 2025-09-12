'use strict';

/**
 * product controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::product.product', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    
    // Find the product with all relations populated
    const product = await strapi.entityService.findOne('api::product.product', id, {
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

    if (!product) {
      return ctx.notFound('Product not found');
    }

    // Sanitize the response
    const sanitizedEntity = await this.sanitizeOutput(product, ctx);
    return this.transformResponse(sanitizedEntity);
  }
}));
