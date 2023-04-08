import request from "supertest";
import { app } from "./app";

describe("GET /", () => {
	it("should return 'Hello World' text and 200 OK", async () => {
		// Arrange
		const api = request(app);

		// Act
		const result = await api.get("/");

		// Assert
		expect(result.statusCode).toEqual(200);
		expect(result.text).toEqual("Hello World!");
	});
});
