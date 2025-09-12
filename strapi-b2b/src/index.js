export default {
    async bootstrap({ strapi }) {
        // Set up public permissions for API access
        const role = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
        if (role) {
            await strapi.service('plugin::users-permissions.role').updateRole(role.id, {
                permissions: {
                    'api::product.product': { controllers: { product: { find: { enabled: true }, findOne: { enabled: true } } } },
                    'api::category.category': { controllers: { category: { find: { enabled: true }, findOne: { enabled: true } } } },
                    'api::supplier.supplier': { controllers: { supplier: { find: { enabled: true }, findOne: { enabled: true } } } }
                }
            });
        }
        // Bootstrap complete - no mock data created
        console.log('Strapi bootstrap completed. Ready to create content via admin panel.');
    }
};
