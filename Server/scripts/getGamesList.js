const puppeteer = require("puppeteer");

const scrollPageGetLinks = require("./scrollPageGetLinks.js");
const checkIfLeague = require("./checkIfLeague.js");

const getGamesList = async () => {
  const browser = await puppeteer.launch({ headless: false, dumpio: false });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 800,
  });
  await page.goto("https://www.livescores.com/?tz=-4");
  let gamesList = await page
    .waitForSelector('#content-center')
    .then(async () => {
      const gamesLinks = await scrollPageGetLinks(page);
      return gamesLinks
    });
  page.close();
  newPage = await browser.newPage();
  await newPage.setViewport({
    width: 1200,
    height: 800,
  });
  gamesList = await checkIfLeague(newPage, gamesList);
  browser.close();
  return gamesList;
};

module.exports = getGamesList;
