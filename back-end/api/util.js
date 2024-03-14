function formatDate(date) {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Adding leading zero if needed
  const day = ("0" + date.getDate()).slice(-2); // Adding leading zero if needed

  return year + "-" + month + "-" + day;
}
function formatTime(time) {
  const hours = ("0" + time.getHours()).slice(-2); // Adding leading zero if needed
  const minutes = ("0" + time.getMinutes()).slice(-2); // Adding leading zero if needed
  const seconds = ("0" + time.getSeconds()).slice(-2); // Adding leading zero if needed

  return hours + ":" + minutes + ":" + seconds;
}

module.exports = {formatDate, formatTime};