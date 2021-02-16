require('../src/db/mongoose');
const Task = require('../src/models/task');

// 602968a63dff49c74816377f

// promise chaining with return and then
// Task.findByIdAndDelete('6029c3091c9547da9b5e7ea9').then(task => {
//   console.log(task);
//   return Task.countDocuments({ completed: false})
// }).then(result => {
//   console.log(result);
// }).catch(e => {
//   console.log(e);
// });

// promise chaining with async/await
const deleteTaskAndCount = async (id) => {
  // if you don't need to use the value of const task the you can run the method without storing it in a const
  const task = await Task.findByIdAndDelete(id); 
  const count = await Task.countDocuments({ completed: false });
  return count;
}

deleteTaskAndCount('60255307223ac7a4f99057c2').then(count => {
  console.log(count);
}).catch(e => {
  console.log(e);
})
