import {
	mockTimeNowTopOfHour,
	mockTimeNow,
	mockZip,
} from "../../test-helpers/fixtures";
const staleInterval = 3 * 3600; // three hours
const staleCutoff = (mockTimeNowTopOfHour - staleInterval) * 1000;
const mockTimeNowMS = mockTimeNow * 1000;

export const current = {
	zip: mockZip,
	timestamp: 1648270800,
	windSpeed: 19.2,
	windDirection: "WNW",
	windDegree: 298,
	temperature: 34.9,
	skies: "API Response Hour 1",
	createdAt: new Date(mockTimeNowMS),
	updatedAt: new Date(mockTimeNowMS),
};

export const lessCurrent = {
	zip: mockZip,
	timestamp: 1648274400,
	windSpeed: 19.0,
	windDirection: "WNW",
	windDegree: 303,
	temperature: 34.7,
	skies: "API Response Hour 2",
	createdAt: new Date(mockTimeNowMS - 1000),
	updatedAt: new Date(mockTimeNowMS - 1000),
};

export const stale = {
	zip: mockZip,
	timestamp: mockTimeNowTopOfHour,
	windSpeed: 10,
	windDirection: "N",
	windDegree: 277,
	temperature: 65,
	skies: "DB RESPONSE - Stale",
	createdAt: new Date(staleCutoff),
	updatedAt: new Date(staleCutoff),
};
