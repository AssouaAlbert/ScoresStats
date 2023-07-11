const findRemoveSync = require("find-remove");
const age = 5 * 24 * 60 * 60 ;

const deleteOldFiles = () => {
  findRemoveSync(`./data`, {
    age: { seconds: age },
    extensions: '.json',
  });
};

module.exports = deleteOldFiles;
