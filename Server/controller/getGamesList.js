const DailyStats = require("../models/dailyStats");
const mail = require("../scripts/sendEmail");
const getGamesList = async (req, res) => {
  try {
    const gamesList = await DailyStats.find({league: true});
    res.status(200).json(gamesList);
  } catch (error) {
    message = { subject: "file: getGamesList.js:12", message: error.message };
    mail(message);
    res.status(404).json({ message: error.message });
  }
};

module.exports = getGamesList;
