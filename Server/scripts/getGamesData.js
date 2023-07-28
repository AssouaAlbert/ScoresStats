const puppeteer = require("puppeteer");
const getH2HStats = require("./getH2HStats");
const time = 30 * 60 * 1000;

/* ---------------------------------- Store --------------------------------- */
const { setError, setPayload, setErrorFunction, setLastFunctionCall, setBusy, setProcessComplete } = require("../store/globalSlice.js");

const getGamesData = async (gamesList, store) => {
  console.log("🚀 ~ file: getGamesData.js:176 ~ getGamesData ~ getGamesData:", getGamesData.name)
  store.dispatch(setBusy());
  store.dispatch(setLastFunctionCall(getGamesData.name));
  const data = {};
  try {
    const browser = await puppeteer.launch({
      headless: false,
      dumpio: false,
      args: [
        "--no-sandbox",
        "---disable-setuid-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1200,
      height: 800,
    });
    const gamesListArray = Object.entries(gamesList);
    let ceil = Math.floor(gamesListArray.length / 50) + 1;
    for (let index = 0; index < (ceil * 50); index += 50) {
      for (let i = index; i < index + 50; i++) {
      if (!gamesListArray[i]) break;
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
        data[key] = { ...results };
      }
    }
  }
    page.close();
    browser.close();
    store.dispatch(setPayload(data));
    store.dispatch(setProcessComplete([getGamesData.name, true]));
    store.dispatch(setBusy());
  } catch (error) {
    console.log("🚀 ~ file: getGamesData.js:168 ~ getGamesData ~ error:", error.message)
    store.dispatch(setProcessComplete([getGamesData.name, false]));
    store.dispatch(setBusy(false));
    store.dispatch(
      setError({ subject: "file: getGamesData.js", message: error.message })
    );
  }
};
module.exports = getGamesData;
