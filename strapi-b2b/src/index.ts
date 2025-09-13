export default {
	async bootstrap({ strapi }: any) {
	  const role = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
  
	  if (role) {
		const permissionsToSet = {
		  'api::product.product': ['find', 'findOne', 'product'],
		  'api::category.category': ['find', 'findOne', 'category'],
		  'api::supplier.supplier': ['find', 'findOne', 'supplier'],
		};
  
		for (const [apiKey, actions] of Object.entries(permissionsToSet)) {
		  for (const action of actions) {
			const existing = await strapi.query('plugin::users-permissions.permission').findMany({
			  where: {
				role: role.id,
				action: `${apiKey}.${action}`,
			  },
			});
  
			if (existing.length === 0) {
			  await strapi.query('plugin::users-permissions.permission').create({
				data: {
				  action: `${apiKey}.${action}`,
				  role: role.id,
				  enabled: true,
				},
			  });
			}
		  }
		}
	  }
  
	  console.log('Strapi bootstrap completed. Public permissions checked and updated if missing.');
	},
  };
  