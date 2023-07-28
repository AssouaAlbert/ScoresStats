const puppeteer = require("puppeteer");
const getTeamDiff = require("./getTeamDiff");
const mail = require("./sendEmail");
const time = 30 * 60 * 1000;

/* ---------------------------------- Store --------------------------------- */
const {
  setError,
  setPayload,
  setBusy,
  setErrorFunction,
  setLastFunctionCall,
  setProcessComplete,
} = require("../store/globalSlice.js");

const getH2HStats = async (gamesList, store) => {
  console.log(
    "🚀 ~ file: getH2HStats.js:17 ~ getH2HStats ~ getH2HStats:",
    getH2HStats.name
  );
  store.dispatch(setBusy());
  store.dispatch(setLastFunctionCall(getH2HStats.name));
  let data = {};
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
    for (let index = 0; index < ceil * 50; index += 50) {
      for (let i = index; i < index + 50; i++) {
        if (!gamesListArray[i]) break;
        const [key, value] = gamesListArray[i];
        await page.goto(`${value.link}/h2h`, {
          waitUntil: "domcontentloaded",
        });
        if (await page.$("#tab-item-h2h")) {
          let results = await page.evaluate(
            async ([key, gamesList]) => {
              return await new Promise((res, rej) => {
                let h2h = [];
                const h2hGames = document?.querySelectorAll("[id^=h2h__match_]");
                for (i = 0; i < h2hGames.length; i++) {
                  let homeTeam = h2hGames[i]?.querySelector(
                    "div:nth-child(1) > span:nth-child(2)"
                  )?.textContent;
                  let awayTeam = h2hGames[i]?.querySelector(
                    "div:nth-child(2) > span:nth-child(2)"
                  )?.textContent;
                  let awayScore = h2hGames[i]
                    ?.querySelector("div:nth-child(3) ")
                    ?.querySelector("div")
                    ?.querySelector("div:nth-child(2)")?.textContent;
                  let homeScore = h2hGames[i]
                    ?.querySelector("div:nth-child(3) ")
                    ?.querySelector("div")
                    ?.querySelector("div:nth-child(1)")?.textContent;
                  h2h = [
                    ...h2h,
                    {
                      home: { homeTeam, homeScore: Number(homeScore) },
                      away: { awayTeam, awayScore: Number(awayScore) },
                    },
                  ];
                }
                res({
                  ...gamesList[key],
                  h2h,
                });
              });
            },
            [key, gamesList]
          );
          data[key] = { ...data[key], ...results };
        }

        if (await page.$("#home__tab")) {
          await page.click("#home__tab");
          homeLastGames = await page.evaluate(
            async ([key, gamesList]) => {
              return await new Promise((res, rej) => {
                const matches =
                  document?.querySelectorAll("#h2h__match-result");
                lastGames = [];
                for (let i = 0; i < matches.length; i++) {
                  const result = matches[i].textContent;
                  lastGames = [...lastGames, result];
                }
                res({
                  lastGames,
                });
              });
            },
            [key, gamesList]
          );
          data[key] = {
            ...data[key],
            home: { ...data[key].home, ...homeLastGames },
          };
        }
        if (await page.$("#away__tab")) {
          await page.click("#away__tab");
          awayLastGames = await page.evaluate(
            async ([key, gamesList]) => {
              return await new Promise((res, rej) => {
                const matches =
                  document?.querySelectorAll("#h2h__match-result");
                lastGames = [];
                for (let i = 0; i < matches.length; i++) {
                  const result = matches[i].textContent;
                  lastGames = [...lastGames, result];
                }
                res({
                  lastGames,
                });
              });
            },
            [key, gamesList]
          );
          data[key] = {
            ...data[key],
            away: { ...data[key].away, ...awayLastGames },
          };
        }
      }
    }
    page.close();
    browser.close();
    data = await getTeamDiff(data);
    store.dispatch(setPayload(data));
    store.dispatch(setProcessComplete([getH2HStats.name, true]));
    store.dispatch(setBusy());
  } catch (error) {
    console.log("🚀 ~ file: getH2HStats.js:146 ~ getH2HStats ~ error:", error);
    store.dispatch(setProcessComplete([getH2HStats.name, false]));
    store.dispatch(setBusy(false));
    store.dispatch(
      setError({ subject: "file: getH2HStats.js", message: error.message })
    );
  }
};
module.exports = getH2HStats;
