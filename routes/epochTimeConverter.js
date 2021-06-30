
function epochTimeConverter(seconds) {
  var date = new Date(0);
  date.setUTCSeconds(seconds);
  return date;
}