
export const selectDayDisplay = (selectedDay, selectedMonth, selectedYear, day, month, year) => {
  if (selectedDay === day && selectedMonth === month && selectedYear === year) {
    return "selected"
  } else {
    return ""
  }
}
