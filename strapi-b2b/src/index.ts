export default {
	async bootstrap({ strapi }: any) {
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

		const catCount = await strapi.entityService.count('api::category.category');
		if (catCount === 0) {
			const electronics = await strapi.entityService.create('api::category.category', { data: { name: 'Electronics' } });
			const office = await strapi.entityService.create('api::category.category', { data: { name: 'Office Supplies' } });
			const industrial = await strapi.entityService.create('api::category.category', { data: { name: 'Industrial' } });

			const acme = await strapi.entityService.create('api::supplier.supplier', { data: { name: 'Acme Corp', contactEmail: 'sales@acme.example' } });
			const globex = await strapi.entityService.create('api::supplier.supplier', { data: { name: 'Globex', contactEmail: 'partners@globex.example' } });

			await strapi.entityService.create('api::product.product', { data: { name: 'Industrial Drill', sku: 'DRL-1000', description: 'Heavy-duty drill.', price: 249.99, stock: 42, category: industrial.id, supplier: acme.id } });
			await strapi.entityService.create('api::product.product', { data: { name: 'Laser Printer', sku: 'PRN-LZR-200', description: 'Fast office printer.', price: 399.0, stock: 15, category: office.id, supplier: globex.id } });
			await strapi.entityService.create('api::product.product', { data: { name: 'USB-C Hub', sku: 'HUB-USBC-7', description: '7-in-1 USB-C hub.', price: 59.5, stock: 120, category: electronics.id, supplier: acme.id } });
		}
	}
}; 