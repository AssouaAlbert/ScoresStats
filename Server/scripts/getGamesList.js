const puppeteer = require("puppeteer");
const scrollPageGetLinks = require("./scrollPageGetLinks.js");
const checkIfLeague = require("./checkIfLeague.js");
const mail = require("./sendEmail");
const time = 30 * 60 * 1000;

require("dotenv").config();

const getGamesList = async () => {
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
    let gamesList = await page
      .waitForSelector("#content-center")
      .then(async () => {
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
    gamesList = await checkIfLeague(gamesList);
    message = { subject: "Progress", message: "file: getGamesList.js" };
    mail(message);
    return gamesList;
  } catch (error) {
    message = { subject: "file: getGamesList.js", message: error.message };
    mail(message);
    setTimeout(getGamesList, time);
  }
};

module.exports = getGamesList;
