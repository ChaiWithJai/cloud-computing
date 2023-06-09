import { DataTypes, Op, Sequelize } from "sequelize";

export const db = new Sequelize("sqlite::memory:");

export const Forecast = db.define("forecast", {
	zip: {
		type: DataTypes.TEXT,
		allowNull: false,
		validate: {
			is: {
				args: /^\d{5}$/,
				msg: "invalid ZIP",
			},
			notEmpty: true,
		},
	},
	timestamp: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			notEmpty: true,
			isInt: {
				args: true,
				msg: "invalid timestamp",
			},
		},
	},
	windSpeed: {
		type: DataTypes.FLOAT,
		allowNull: false,
		validate: {
			notEmpty: true,
			isFloat: {
				args: true,
				msg: "invalid windSpeed",
			},
		},
	},
	windDirection: {
		type: DataTypes.TEXT,
		allowNull: false,
		validate: {
			notNull: true,
			is: {
				args: /^[NSEW]+$/,
				msg: "invalid windDirection",
			},
		},
	},
	windDegree: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			notNull: true,
			isInt: {
				min: 0,
				max: 359,
			},
		},
	},
	temperature: {
		type: DataTypes.FLOAT,
		allowNull: false,
		validate: {
			isFloat: {
				args: true,
				msg: "invalid temperature",
			},
		},
	},
	skies: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
});

Forecast.getByZipAndTSandMaxAge = async function (
	zip,
	timestamp,
	maxAgeInHours
) {
	const topOfHour = timestamp - (timestamp % 3600);
	const where = {
		zip,
		timestamp: topOfHour,
	};

	if (maxAgeInHours) {
		const cutoff = new Date();
		cutoff.setSeconds(cutoff.getSeconds() - maxAgeInHours);
		where.updatedAt = {
			[Op.gte]: cutoff,
		};
	}

	return Forecast.findOne({
		where,
		order: [["updatedAt", "DESC"]],
	});
};

export default Forecast;
