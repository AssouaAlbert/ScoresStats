const puppeteer = require("puppeteer");
const scrollPageGetLinks = require("./scrollPageGetLinks.js");

/* ---------------------------------- Store --------------------------------- */
const { store } = require("../store/store");
const { setError, setPayload, setErrorFunction, setLastFunctionCall, setProcessComplete, setBusy } = require("../store/globalSlice.js");

require("dotenv").config();
const getGamesList = async (gamesList) => {
  console.log("🚀 ~ file: getGamesList.js:10 ~ getGamesList ~ getGamesList:", getGamesList.name)
  store.dispatch(setBusy());
  store.dispatch(setLastFunctionCall(getGamesList.name));
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
    await page.goto("https://www.livescores.com/?tz=-4");
    gamesList = await page.waitForSelector("#content-center").then(async () => {
      const gamesLinks = await scrollPageGetLinks(page);
      return gamesLinks;
    });
    page.close();
    browser.close();
    store.dispatch(setPayload(gamesList));
    store.dispatch(setProcessComplete([getGamesList.name, true]));
    store.dispatch(setBusy());
  } catch (error) {
    store.dispatch(setProcessComplete([getGamesList.name, false]));
    store.dispatch(setBusy(false));
    store.dispatch(setError({ subject: "Error - file: getGamesList.js", message: error.message }));
  }
};

module.exports = getGamesList;
