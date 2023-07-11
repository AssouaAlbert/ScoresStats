const mongoose = require("mongoose");
const date = require("../scripts/getDate")

const DateStatsSchema = new mongoose.Schema(
  {
    link: String,
    country: String,
    stage: String,
    league: Boolean,
    home: {
      title: String,
      position: Number,
      played: Number,
      wins: Number,
      draws: Number,
      losses: Number,
      goalsFor: Number,
      goalsAgainst: Number,
      goalsDiff: Number,
      points: Number,
      lastGames: [String],
    },
    away: {
      title: String,
      position: Number,
      played: Number,
      wins: Number,
      draws: Number,
      losses: Number,
      goalsFor: Number,
      goalsAgainst: Number,
      goalsDiff: Number,
      points: Number,
      lastGames: [String],
    },
    h2h: [
      {
        home: { homeTeam: String, homeScore: Number },
        away: { awayTeam: String, awayScore: Number },
      },
    ],
    comparison: {
      title: String,
      positionDiff: Number,
      playedDiff: Number,
      winsDiff: Number,
      drawsDiff: Number,
      lossesDiff: Number,
      goalsForDiff: Number,
      goalsAgainstDiff: Number,
      goalsDiffDiff: Number,
      pointsDiff: Number,
    },
  },
  { timestamps: true }
);

const DailyStats = mongoose.model(`_${date}`, DateStatsSchema);

module.exports = DailyStats;
