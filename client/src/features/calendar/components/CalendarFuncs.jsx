// export const calHeightSetter = (blanks, days) => {
//   let rowAns = blanks.length + days.length
//     let calHeight = ''
//     if (rowAns <= 28) {
//       calHeight = 'small'
//     } else if (rowAns > 28 && rowAns <= 35) {
//       calHeight = 'medium'
//     } else if (rowAns > 35 && rowAns <= 42) {
//       calHeight = 'large'
//     }
//     console.log(`calHeightSetter is run. The calHeight given is: ${calHeight}`)
//   return calHeight
// }

export const selectDayDisplay = (selectedDay, day) => {
  return selectedDay === day ? "selected" : ""
}
// export const lengthFinder = () => {
//     let rowAns = blanks.length + days.length
//     let calHeight = 'nothing'
//     if (rowAns <= 28) {
//       calHeight = 'small'
//     } else if (rowAns > 28 && rowAns <= 35) {
//       calHeight = 'medium'
//     } else if (rowAns > 35 && rowAns <= 42) {
//       calHeight = 'large'
//     }
//     console.log(calHeight)
//   }

// // export const CalFuncs = () => {
//     calHeight === "small" ? "small" : "";
// // }