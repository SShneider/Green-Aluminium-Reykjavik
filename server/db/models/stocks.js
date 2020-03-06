const Sequelize = require("sequelize");
const db = require("../db");

const Stocks = db.define(
    "stocks",
    {
        ticker: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        priceHistory: {
            type: Sequelize.ARRAY(Sequelize.JSON),
            defaultValue: [{}]
        }
    }
)

module.exports = Stocks;