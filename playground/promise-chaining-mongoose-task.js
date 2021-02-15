require('../src/db/mongoose');
const Task = require('../src/models/task');

// 602968a63dff49c74816377f

Task.findByIdAndDelete('6029c3091c9547da9b5e7ea9').then(task => {
  console.log(task);
  return Task.countDocuments({ completed: false})
}).then(result => {
  console.log(result);
}).catch(e => {
  console.log(e);
});
