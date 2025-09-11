export default ({ env }) => ({
	apiToken: {
		salt: env('API_TOKEN_SALT', 'rUV0BBd14fN9fd4Ephtyrw==')
	},
	auth: {
		secret: env('ADMIN_JWT_SECRET', 'defaultAdminSecret123')
	},
	transfer: {
		token: {
			salt: env('TRANSFER_TOKEN_SALT', 'rUV0BBd14fN9fd4Ephtyrw==')
		}
	}
});
