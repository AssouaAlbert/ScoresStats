const scrollPageGetLinks = async (page) => {
  return await page.evaluate(async () => {
    return await new Promise((res, reg) => {
      const gamesLinks = {};
      const gamesList = document.querySelectorAll(
        "#content-center > div > div"
      );
      gamesList.forEach((element) => {
        if (element?.classList?.length > 1) {
          const url = /livescores.com/i;
          const query = /\/\?tz=-4/i;
          let link = element.querySelector("a").href;
          link = link.replace(url, "livescore.com/en");
          link = link.replace(query, "");
          const matches = link.match(/\/([^/]+)\/[^/]+$/);
          if (matches) {
            const key = matches[1];
            gamesLinks[`_${key}`] = { link };
          } else {
            const key =
              Math.floor(Math.random() * (237283 - 10000 + 1)) - 10000;
            gamesLinks[`_${key}`] = { link };
          }
        }
      });
      res(gamesLinks);
    });
  });
};

module.exports = scrollPageGetLinks;
