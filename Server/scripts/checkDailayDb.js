const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const getGamesList = require("./getGamesList");
const insertToDB = require("./db/insertData");
const mail = require("./sendEmail");
const deleteOldFiles = require("./deleteOldFiles")

const date = require("./getDate");
const fileName = `_${date}`;
const filePath = path.resolve(__dirname, `../data/${fileName}.json`);
const time = 30 * 60 * 1000;

const checkDailayDb = async () => {
  deleteOldFiles();
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
        await insertToDB(data);
        message = {
          subject: "File Upload",
          message: "Data is available online.",
        };
        mail(message, fileName);
      } catch (error) {
        const gamesList = await getGamesList();
        const data = Object.values(gamesList);
        await insertToDB(data);
        await fs.writeFile(filePath, `${JSON.stringify(gamesList)}`, (err) => {
          if (err) {
            console.error(err);
          }
        });
        message = {
          subject: "File Created & Upload",
          message: "Data is available online.",
        };
        mail(message, fileName);
      }
    }
  } catch (error) {
    message = { subject: "file: checkDailayDb.js", message: error.message };
    mail(message);
    setTimeout(checkDailayDb, time);
  }
};

module.exports = checkDailayDb;
