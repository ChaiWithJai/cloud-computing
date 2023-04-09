import ForecastCache from "./cache";
import { mockTimeNow, mockZip } from "../test-helpers/fixtures";
import { mockConvertedHour1 } from "./fixtures/forecast-api.fixtures";

const fakeAPIClient = {
	getByZipAndTS() {},
};

const fakeDbClient = {
	getByZipAndTS() {},
	saveForecast() {},
};

describe("Forecast Cache Service", () => {
	describe("#getByZipAndTS", () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		test("should return a forecast object using cached data if present", async () => {
			// Arrange
			const cache = new ForecastCache({
				dbClient: fakeDbClient,
				apiClient: fakeAPIClient,
			});
			jest
				.spyOn(fakeDbClient, "getByZipAndTS")
				.mockImplementation(() => mockConvertedHour1);
			jest.spyOn(fakeAPIClient, "getByZipAndTS");

			// Act
			const result = await cache.getByZipAndTS(mockZip, mockTimeNow);

			// Assert
			expect(result).toEqual(mockConvertedHour1);
			expect(fakeDbClient.getByZipAndTS).toHaveBeenCalledWith(
				mockZip,
				mockTimeNow
			);
			expect(fakeDbClient.getByZipAndTS).toHaveBeenCalledTimes(1);
			expect(fakeAPIClient.getByZipAndTS).not.toHaveBeenCalled();
		});

		test("should return a forecast object using API data if not present", async () => {
			// Arrange
			const cache = new ForecastCache({
				dbClient: fakeDbClient,
				apiClient: fakeAPIClient,
			});

			jest.spyOn(fakeDbClient, "saveForecast");

			jest
				.spyOn(fakeAPIClient, "getByZipAndTS")
				.mockImplementation(() => mockConvertedHour1);

			const dbCall = jest.spyOn(fakeDbClient, "getByZipAndTS");
			dbCall.mockReturnValueOnce(undefined); // First call returns undefined
			dbCall.mockReturnValueOnce(mockConvertedHour1); // Second call returns an object

			// Act
			const result = await cache.getByZipAndTS(mockZip, mockTimeNow);

			// Assert
			expect(fakeDbClient.getByZipAndTS).toHaveBeenCalledTimes(2);
			expect(result).toEqual(mockConvertedHour1);
			expect(fakeAPIClient.getByZipAndTS).toHaveBeenCalledWith(
				mockZip,
				mockTimeNow
			);
		});
	});
});
