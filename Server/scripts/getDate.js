const date = [
    new Date().getDate(),
    new Date().getMonth(),
    new Date().getFullYear(),
  ];

  const day = `${date.join(`-`)}`;
  module.exports = day;