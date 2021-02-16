require('../src/db/mongoose');
const User = require('../src/models/user');

// 602963e5757693c526633db3

// promise chaining with return and then
// User.findByIdAndUpdate('6029b9518d32a2d89b1fab94', { age: 1 }).then(user => {
//   console.log(user);

//   return User.countDocuments({ age: 1})
// }).then(result => {
//   console.log(result);
// }).catch(e => {
//   console.log(e);
// });

// TERMINAL OUTPUT:
// console.log(user); from line 7
// {
//   age: 0,
//   _id: 602963e5757693c526633db3,
//   name: 'CheekyMonkey',
//   email: 'cheeky@monkey.com',
//   __v: 0
// }
// console.log(result); from line 11
// 1

// Run it again with different id OUTPUT
// {
//   age: 0,
//   _id: 6029b9518d32a2d89b1fab94,
//   name: 'Tina Mead',
//   email: 'tintin@mead.com',
//   __v: 0
// }
// 2

// promise chaining with async/await
const updateAgeAndCount = async (id, age) => {
  // if you don't need to use the value of const user the you can run the method without storing it in a const
  const user = await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age });
  return count;
};

updateAgeAndCount('602968230edef6c707fc9701', 2).then(count => {
  console.log(count);
}).catch(e => {
  console.log(e);
})