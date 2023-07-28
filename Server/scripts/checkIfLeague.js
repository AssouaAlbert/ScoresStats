const puppeteer = require("puppeteer");
const getGamesData = require("./getGamesData");

/* ---------------------------------- Store --------------------------------- */
const {
  setError,
  setPayload,
  setErrorFunction,
  setLastFunctionCall,
  setBusy,
  setProcessComplete,
} = require("../store/globalSlice.js");

const checkIfLeague = async (gamesList, store) => {
  console.log("🚀 ~ file: checkIfLeague.js:15 ~ checkIfLeague ~ checkIfLeague:", checkIfLeague.name)
  store.dispatch(setBusy());
  store.dispatch(setLastFunctionCall(checkIfLeague.name));
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
    // throw new Error("None")
    let ceil = Math.floor(gamesListArray.length / 50) + 1;
    for (let index = 0; index < ceil * 50; index += 50) {
      for (let i = index; i < index + 50; i++) {
        if (!gamesListArray[i]) break;
        const [key, value] = gamesListArray[i];
        await page.goto(`${value.link}`, {
          waitUntil: "domcontentloaded",
        });
        let results = await page.evaluate(
          async ([key, gamesList]) => {
            return await new Promise((res, rej) => {
              const table = document.getElementById("table");
              const country = document.getElementById(
                "category-header__category"
              ).textContent;
              const stage = document.getElementById(
                "category-header__stage"
              ).textContent;
              if (table) {
                res(
                  (gamesList[key] = {
                    ...gamesList[key],
                    league: true,
                    country,
                    stage,
                  })
                );
              } else {
                const homeName = document.getElementById(
                  "match-detail_team-name_home-link"
                ).lastChild?.textContent;
                const awayName = document.getElementById(
                  "match-detail_team-name_away-link"
                ).lastChild?.textContent;
                res(
                  (gamesList[key] = {
                    ...gamesList[key],
                    league: false,
                    stage,
                    country,
                    home: { title: homeName },
                    away: { title: awayName },
                  })
                );
              }
            });
          },
          [key, gamesList]
        );
        data[key] = { ...results };
      }
    }
    page.close();
    browser.close();
    store.dispatch(setPayload(data));
    store.dispatch(setProcessComplete([checkIfLeague.name, true]));
    store.dispatch(setBusy());
  } catch (error) {
    console.log(
      "🚀 ~ file: checkIfLeague.js:91 ~ checkIfLeague ~ error:",
      error.message
    );
    store.dispatch(setProcessComplete([checkIfLeague.name, false]));
    store.dispatch(setBusy(false));
    store.dispatch(
      setError({ subject: "file: checkIfLeague.js", message: error.message })
    );
  }
};

module.exports = checkIfLeague;
