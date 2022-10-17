try {

  /**
   * @param {Date} date
   * @return {number} the ordinal number of the day of the year
   */
  const dayOfYear = date =>
    Math.floor((date - new Date(date.getUTCFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);

  /**
   * @param date
   * @return {number} the ordinal number of the minute of the day
   */
  const minuteOfDay = date => date.getUTCHours() * 60 + date.getUTCMinutes()

  const now = new Date();
  const version = `${now.getUTCFullYear() - 2000}.${dayOfYear(now)}.${minuteOfDay(now)}`

  process.stdout.write('::set-output name=version::' + version);
} catch (e) {
  console.error(e);
  process.exit(1);
}
