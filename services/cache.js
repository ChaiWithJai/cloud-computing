export default class ForecastCache {
	constructor({ apiClient, dbClient }) {
		this.apiClient = apiClient;
		this.dbClient = dbClient;
	}

	async getByZipAndTS(zip, ts) {
		const cachedForecast = await this.dbClient.getByZipAndTS(zip, ts);
		if (cachedForecast) {
			return cachedForecast;
		}

		const forecast = await this.apiClient.getByZipAndTS(zip, ts);
		const transformedForecast = transformAPIRes(forecast);
		await this.dbClient.saveForecast(transformedForecast);
		return this.dbClient.getByZipAndTS(zip, ts);
	}
}

export function transformAPIRes(res) {
	return res;
}
