import Forecast, { db } from "./forecast";
import { current } from "../db/fixtures/forecast";

describe("Forecast Model", () => {
	beforeAll(async () => {
		await db.sync({ force: true });
	});

	beforeEach(async () => {
		await Forecast.destroy({ where: {}, truncate: true });
	});

	describe("#getByZipAndTSandMaxAge", () => {
		it("should return a fresh record from the database if its exists and within age range", async () => {
			// Arrange
			await Forecast.bulkCreate([current]);

			// Act
			const result = await Forecast.getByZipAndTSandMaxAge(
				current.zip,
				current.timestamp
			);

			// Assert
			expect(result).toEqual(expect.objectContaining(current));
		});

		it("should not return a stale record", async () => {
			// Arrange
			await Forecast.bulkCreate([current]);

			// Act
			const result = await Forecast.getByZipAndTSandMaxAge(
				current.zip,
				current.timestamp,
				3
			);

			// Assert
			expect(result).toEqual(null);
		});

		it("should return the newest record if multiple are found", async () => {
			// Arrange
			await Forecast.bulkCreate([
				current,
				{ ...current, timestamp: current.timestamp + 3600 },
			]);

			// Act
			const result = await Forecast.getByZipAndTSandMaxAge(
				current.zip,
				current.timestamp
			);

			// Assert
			expect(result).toEqual(expect.objectContaining(current));
		});
	});
});
