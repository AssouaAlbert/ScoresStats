const DailyStats = require("../../models/dailyStats");

const insertToDB = (data) => {
    return DailyStats.insertMany(data); //Add users just once.
}

module.exports = insertToDB;