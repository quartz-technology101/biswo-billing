export const todayNepaliDate = (date) => {
  var dateString =
    ("0" + date.getDate()).slice(-2) +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    date.getFullYear();
  const currentDate = NepaliFunctions.AD2BS(dateString, "DD-MM-YYYY");
  return currentDate;
};
