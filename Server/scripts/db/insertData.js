const fs = require("fs");
const path = require("path");
const date = require("../../scripts/getDate");
const fileName = `_${date}`;
const filePath = path.resolve(__dirname, `../../data/${fileName}.json`);
const DailyStats = require("../../models/dailyStats");
const {
  setBusy,
  setProcessComplete,
  setReset,
} = require("../../store/globalSlice");

const insertToDB = async (gamesList, store) => {
  store.dispatch(setProcessComplete([insertToDB.name, true]));
  store.dispatch(setBusy());
  console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀 ");
  const data = Object.values(gamesList);
  Promise.resolve(await DailyStats.insertMany(data))
    .then(async (res) => {
      await fs.writeFile(filePath, `${JSON.stringify(gamesList)}`, (err) => {
        if (err) {
          console.error(err);
        }
      });

      //   store.dispatch(setProcessComplete(["getGamesList", false]));
      //   store.dispatch(setProcessComplete(["checkIfLeague", false]));
      //   store.dispatch(setProcessComplete(["getGamesData", false]));
      //   store.dispatch(setProcessComplete(["getH2HStats", false]));
      //   store.dispatch(setProcessComplete(["insertToDB", false]));
      store.dispatch(setProcessComplete([insertToDB.name, true]));
      store.dispatch(setReset());
      fs.writeFile(
        "info.json",
        `${JSON.stringify(store.getState().globalState)}`,
        (err) => {
          if (err) console.log(err);
          else {
            console.log("File written successfully\n");
            console.log("The written has the following contents:");
            console.log(fs.readFileSync("books.txt", "utf8"));
          }
        }
      );
    })
    .catch((error) => {
      console.log(
        "🚀 ~ file: insertData.js:18 ~ Promise.resolve ~ error:",
        error.message
      );
    });
  store.dispatch(setBusy());
};

module.exports = insertToDB;
