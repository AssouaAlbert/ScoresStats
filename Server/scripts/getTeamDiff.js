/* ---------------------------------- Store --------------------------------- */
const store = require("../store/store.js");

const mail = require("./sendEmail");

const getTeamDiff = (gamesList) => {
  console.log("🚀 ~ file: getTeamDiff.js:7 ~ getTeamDiff ~ getTeamDiff:", getTeamDiff.name)
  const gamesListArray = Object.entries(gamesList);
  for (i = 0; i < gamesListArray.length; i++) {
    const [key, value] = gamesListArray[i];
    if (value.league) {
      const positionDiff = value.home.position - value.away.position;
      const playedDiff = value.home.played - value.away.played;
      const winsDiff = value.home.wins - value.away.wins;
      const drawsDiff = value.home.draws - value.away.draws;
      const lossesDiff = value.home.losses - value.away.losses;
      const goalsForDiff = value.home.goalsFor - value.away.goalsFor;
      const goalsAgainstDiff =
        value.home.goalsAgainst - value.away.goalsAgainst;
      const goalsDiffDiff = value.home.goalsDiff - value.away.goalsDiff;
      const pointsDiff = value.home.points - value.away.points;
      gamesList[key] = {
        ...gamesList[key],
        comparison: {
          title: "Difference",
          positionDiff,
          playedDiff,
          winsDiff,
          drawsDiff,
          lossesDiff,
          goalsForDiff,
          goalsAgainstDiff,
          goalsDiffDiff,
          pointsDiff,
        },
      };
    } else {
      gamesList[key] = {
        ...gamesList[key],
      };
    }
  }
  return gamesList;
};
module.exports = getTeamDiff;
