const mongoose = require("mongoose");

const path = require("path");
const date = require("./getDate");
const fileName = `_${date}`;
const filePath = path.resolve(__dirname, `../data/${fileName}.json`);

const getGamesList = require("./getGamesList");
const insertToDB = require("./db/insertData");
const mail = require("./sendEmail");
const deleteOldFiles = require("./deleteOldFiles");
let gamesList = {};

/* ---------------------------------- Store --------------------------------- */
const { store } = require("../store/store");
const {
  setBusy,
  setError,
  setLastFunctionCall,
} = require("../store/globalSlice.js");

const checkDailayDb = async (gamesList, store) => {
  deleteOldFiles();
  store.dispatch(setLastFunctionCall(checkDailayDb.name));
  try {
    const db = await mongoose.connection.db;
    const collectExist = await db
      .listCollections({ name: fileName })
      .next((err, collectionInfo) => {
        if (err) {
          throw new Error(err);
        } else if (collectionInfo) {
          return collectionInfo;
        } else {
          throw new Error("There Collection does not exist");
        }
      });

    const collectionEmpty = await db
      .collection(`${fileName}`)
      .countDocuments({}, (err, count) => {
        if (err) {
          console.error(err);
        } else if (count === 0) {
          return true;
        } else {
          console.log(`Collection contains ${count} documents`);
          return false;
        }
      });
    if (!collectExist || !collectionEmpty) {
      try {
        const data = Object.values(require(filePath));
        insertToDB(data, store);
        message = {
          subject: "File Upload",
          message: "Data is available online.",
        };
        mail(message, fileName);
      } catch (error) {
        await getGamesList(gamesList);
      }
    }
  } catch (error) {
    console.log("🚀 ~ file: checkDailayDb.js:62 ~ checkDailayDb ~ error:", error.message)
    store.dispatch(setBusy(false));
    store.dispatch(
      setError({ subject: "file: checkDailayDb.js", message: error.message })
    );
  }
};

module.exports = checkDailayDb;
