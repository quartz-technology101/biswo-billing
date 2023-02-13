import React from "react";
import { todayNepaliDate } from "./todayNepaliDate";

const NepaliDatePicker = ({
  className,
  disabled,
  setData,
  name,
  value,
  data,
  date = new Date(),
  disabledBeforeDate = false,
  disabledAfterDate = false,
  id,
}) => {
  React.useEffect(() => {
    const pickerInput = document.getElementById(id);
    // @ts-ignore
    pickerInput.nepaliDatePicker({
      ndpYear: true,
      ndpMonth: true,
      ndpYearCount: 10,
      dateFormat: "YYYY-MM-DD",
      disableBefore: disabledBeforeDate ? null : todayNepaliDate(date),
      disableAfter: disabledAfterDate ? todayNepaliDate(date) : null,
      onChange: (selectedDateObj) => {
        setData({
          ...data,
          [name]: selectedDateObj.bs || null,
        });
      },
    });
  }, [setData, name, value, data, id]);
  return (
    <input
      className={
        className +
        " nepali-datepicker popup-model placeholder:text-gray-300 placeholder:uppercase placeholder:text-xs"
      }
      type={"select"}
      style={{
        caretColor: "transparent",
      }}
      name={name}
      id={id}
      placeholder="yyyy-mm-dd"
      value={value}
      onChange={() => {}}
      disabled={disabled}
    />
  );
};

export default NepaliDatePicker;
