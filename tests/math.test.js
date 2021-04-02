const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit } = require('../src/math');

// dummy tests
// test('Hello World!', () => {

// });

// test('This should fail', () => {
//   throw new Error('Failure!');
// })

// test('should calculate total with tip', () => {
//   // making sure calculateTip function is giving the expected results
//   // make an assertion about the value we get back
//   // we want to assert that the value we get back is equal to the correct value
//   const total = calculateTip(10, .3);
//   // if (total != 13) {
//   //   throw new Error(`Total tip should be 13. We got ${total}!`);
//   // }
//   // instead of asserting with if we can use expect() with toBe as equality
//   expect(total).toBe(13);
// })

// improvision of assertions about without if and throw error
test('should calculate total with tip', () => {
  const total = calculateTip(10, .3);
  expect(total).toBe(13);
})

test('should calculate total with default tip', () => {
  const total = calculateTip(10);
  expect(total).toBe(12.5);
})

test('should convert 32 F to 0 C', () => {
  const total = fahrenheitToCelsius(32);
  expect(total).toBe(0);
})

test('should convert 0 C to 32 F', () => {
  const total =   celsiusToFahrenheit(0);
  expect(total).toBe(32);
})
