// const calculateTip = (total, tipPercent) => {
//   const tip = total * tipPercent;
//   // return total + tip + tip; // failing test intentionally
//   return total + tip;
// }

// refactored above code making sure tests still pass
const calculateTip = (total, tipPercent = .25) => total + (total * tipPercent);

const fahrenheitToCelsius = (temp) => {
  return (temp - 32) / 1.8
}

const celsiusToFahrenheit = (temp) => {
  return (temp * 1.8) + 32
}

module.exports = {
  calculateTip,
  fahrenheitToCelsius,
  celsiusToFahrenheit
}

