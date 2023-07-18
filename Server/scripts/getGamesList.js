const puppeteer = require("puppeteer");
const scrollPageGetLinks = require("./scrollPageGetLinks.js");
const checkIfLeague = require("./checkIfLeague.js");
const mail = require("./sendEmail");
const time = 1 * 60 * 1000;

/* ---------------------------------- Store --------------------------------- */
const store = require("../store/store.js");

require("dotenv").config();

const getGamesList = async (gamesList, start) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
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
    newPage = await browser.newPage();
    await newPage.setViewport({
      width: 1200,
      height: 800,
    });
    browser.close();
    gamesList = await checkIfLeague(gamesList, start);
    return gamesList;
  } catch (error) {
    store.dispatch(setError());
    store.dispatch(setError());
    message = { subject: "file: getGamesList.js", message: error.message };
    mail(message);
  }
};

module.exports = getGamesList;
