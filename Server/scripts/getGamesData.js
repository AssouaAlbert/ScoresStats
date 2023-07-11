const getH2HStats = require("./getH2HStats");
const getGamesData = async (page, gamesList) => {
  const gamesListArray = Object.entries(gamesList);
  for (let i = 0; i < gamesListArray.length; i++) {
    const [key, value] = gamesListArray[i];
    if (value.league) {
      await page.goto(`${value.link}/table`, {
        waitUntil: "domcontentloaded",
      });
      let results = await page.evaluate(
        async ([key, gamesList]) => {
          return await new Promise((res, rej) => {
            const homeName = document.getElementById(
              "match-detail_team-name_home-link"
            ).lastChild?.textContent;
            const position = document.getElementById(
              `${homeName}__league-column__position`
            );
            const homePosition = (() => {
              if (position?.firstChild) {
                position.removeChild(position.lastChild);
                return position?.textContent;
              } else {
                position?.textContent;
              }
            })();
            const homePlayed = document.getElementById(
              `${homeName}__league-column__played`
            )?.textContent;
            const homeWins = document.getElementById(
              `${homeName}__league-column__wins`
            )?.textContent;
            const homeDraws = document.getElementById(
              `${homeName}__league-column__draws`
            )?.textContent;
            const homeLosses = document.getElementById(
              `${homeName}__league-column__losses`
            )?.textContent;
            const homeGoalsFor = document.getElementById(
              `${homeName}__league-column__goalsFor`
            )?.textContent;
            const homeGoalsAgainst = document.getElementById(
              `${homeName}__league-column__goalsAgainst`
            )?.textContent;
            const homeGoalsDiff = document.getElementById(
              `${homeName}__league-column__goalsDiff`
            )?.textContent;
            const homePoints = document.getElementById(
              `${homeName}__league-column__points`
            )?.textContent;

            const awayName = document.getElementById(
              "match-detail_team-name_away-link"
            ).lastChild?.textContent;
            const position2 = document.getElementById(
              `${awayName}__league-column__position`
            );
            const awayPosition = (() => {
              if (position2?.firstChild) {
                position2.removeChild(position2.lastChild);
                return position2?.textContent;
              } else {
                position2?.textContent;
              }
            })();
            const awayPlayed = document.getElementById(
              `${awayName}__league-column__played`
            )?.textContent;
            const awayWins = document.getElementById(
              `${awayName}__league-column__wins`
            )?.textContent;
            const awayDraws = document.getElementById(
              `${awayName}__league-column__draws`
            )?.textContent;
            const awayLosses = document.getElementById(
              `${awayName}__league-column__losses`
            )?.textContent;
            const awayGoalsFor = document.getElementById(
              `${awayName}__league-column__goalsFor`
            )?.textContent;
            const awayGoalsAgainst = document.getElementById(
              `${awayName}__league-column__goalsAgainst`
            )?.textContent;
            const awayGoalsDiff = document.getElementById(
              `${awayName}__league-column__goalsDiff`
            )?.textContent;
            const awayPoints = document.getElementById(
              `${awayName}__league-column__points`
            )?.textContent;

            res(
              (gamesList[key] = {
                ...gamesList[key],
                home: {
                  title: homeName,
                  position: Number(homePosition),
                  played: Number(homePlayed),
                  wins: Number(homeWins),
                  draws: Number(homeDraws),
                  losses: Number(homeLosses),
                  goalsFor: Number(homeGoalsFor),
                  goalsAgainst: Number(homeGoalsAgainst),
                  goalsDiff: Number(homeGoalsDiff),
                  points: Number(homePoints),
                },
                away: {
                  title: awayName,
                  position: Number(awayPosition),
                  played: Number(awayPlayed),
                  wins: Number(awayWins),
                  draws: Number(awayDraws),
                  losses: Number(awayLosses),
                  goalsFor: Number(awayGoalsFor),
                  goalsAgainst: Number(awayGoalsAgainst),
                  goalsDiff: Number(awayGoalsDiff),
                  points: Number(awayPoints),
                },
              })
            );
          });
        },
        [key, gamesList]
      );
      gamesList[key] = results;
    }
  }
  // Calculate Differences in games
  return gamesList = await getH2HStats(page, gamesList);
};
module.exports = getGamesData;
