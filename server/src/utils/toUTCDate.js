function toUTCDate(date) {
  // date format: MM/DD/YYYY
  const parts = date.split("/");
  if (parts.length !== 3) return null;

  const [month, day, year] = parts;
  const utcDate = new Date(Date.UTC(year, month - 1, day));

  return isNaN(utcDate) ? null : utcDate;
}

module.exports = toUTCDate;
