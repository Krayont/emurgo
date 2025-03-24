//
export default () => ({
	app: {
		env: process.env.ENV,
		port: process.env.APP_PORT
	},
	news: {
		gnews: {
			host: process.env.GNEW_HOST_URL,
			api_key: process.env.GNEWS_API_KEY,
		}
	}
});