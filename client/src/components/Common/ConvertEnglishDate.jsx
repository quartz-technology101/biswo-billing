function convertDate(date, noRequire = false) {
  let dateObj = new Date(date);
  let year = dateObj.getFullYear();
  let month = NepaliFunctions.GetBsMonth(dateObj.getMonth());
  let day = dateObj.getDate();
  let time = dateObj.toLocaleTimeString();
  time = time.slice(0, 4) + time.slice(7, 11);
  return `${year} ${month}-${day}${!noRequire ? `, ${time}` : ""}`;
}

export default convertDate;
