const getGamesData = require("./getGamesData");

const checkIfLeague = async (page, gamesList) => {
  const gamesListArray = Object.entries(gamesList);
  for (let i = 0; i < gamesListArray.length; i++) {
    const [key, value] = gamesListArray[i];
    await page.goto(`${value.link}`, {
      waitUntil: "domcontentloaded",
    });
    let results = await page.evaluate(
      async ([key, gamesList]) => {
        return await new Promise((res, rej) => {
          const table = document.getElementById("table");
          const country = document.getElementById("category-header__category").textContent;
          const stage = document.getElementById("category-header__stage").textContent;
          if (table) {
            res((gamesList[key] = { ...gamesList[key], league: true, country, stage }));
          } else {
            const homeName = document.getElementById(
              "match-detail_team-name_home-link"
            ).lastChild?.textContent;
            const awayName = document.getElementById(
              "match-detail_team-name_away-link"
            ).lastChild?.textContent;
            res((gamesList[key] = { ...gamesList[key], league: false, stage, country, home: {title: homeName,}, away:{title: awayName,} }));
          }
        });
      },
      [key, gamesList]
    );
    gamesList[key] = results;
  }
  return gamesList = await getGamesData(page, gamesList);
};

module.exports = checkIfLeague;
