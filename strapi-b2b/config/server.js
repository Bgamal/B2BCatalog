module.exports = ({ env }) => ({
	host: env('HOST', '0.0.0.0'),
	port: env.int('PORT', 1337),
	app: { 
		keys: env.array('APP_KEYS', ['devkey1','devkey2']) 
	},
	middlewares: [
		'strapi::errors',
		{
			name: 'strapi::security',
			config: {
				contentSecurityPolicy: {
					useDefaults: true,
					directives: {
						'connect-src': ["'self'", 'https:'],
						'img-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
						'media-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
						upgradeInsecureRequests: null,
					},
				},
			},
		},
		{
			name: 'strapi::cors',
			config: {
				enabled: true,
				headers: '*',
				origin: ['http://localhost:3001', 'http://127.0.0.1:3001']
			}
		},
		'strapi::poweredBy',
		'strapi::logger',
		'strapi::query',
		'strapi::body',
		'strapi::session',
		'strapi::favicon',
		'strapi::public',
	],
});
