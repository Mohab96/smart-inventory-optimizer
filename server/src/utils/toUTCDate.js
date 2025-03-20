function toUTCDate(date) {
  // date format: MM/DD/YYYY
  date = date.split("/");
  return new Date(Date.UTC(date[2], date[0] - 1, date[1]));
}
module.exports = toUTCDate;
