const puppeteer = require("puppeteer");
const getGamesData = require("./getGamesData");
const mail = require("./sendEmail");
const time = 1 * 60 * 1000;

const checkIfLeague = async (gamesList, start = 0) => {
  console.log("🚀 ~ file: checkIfLeague.js:7 ~ checkIfLeague ~ start:", start)
  console.log(
    "🚀 ~ file: checkIfLeague.js:87 ~ checkIfLeague ~ checkIfLeague:"
  );
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
    const gamesListArray = Object.entries(gamesList);
    let ceil = Math.floor(gamesListArray.length / 50) + 1;
    for (let index = start; index < ceil * 50; index += 50) {
      for (let i = index; i < index + 50; i++) {
        if (!gamesListArray[i]) break;
        start = i;
        console.log("🚀 ~ file: checkIfLeague.js:36 ~ checkIfLeague ~ i:", i)
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
        gamesList[key] = results;
      }
    }
    browser.close();
    return (gamesList = await getGamesData(gamesList));
  } catch (error) {
    message = { subject: "file: checkIfLeague.js", message: error.message };
    mail(message);
    // setTimeout(() => checkIfLeague(gamesList, start), time);
  }
};

module.exports = checkIfLeague;
