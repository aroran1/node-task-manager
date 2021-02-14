const mongoose = require('mongoose');

// create a new db named task-manager-api
// mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
//   useNewUrlParser: true,
//   useCreateIndex: true
//   // useUnifiedTopology: true
// });


mongoose.connect('mongodb://localhost:27017/task-manager-api', {useNewUrlParser: true, useUnifiedTopology: true});

// create a collection model in the db
const User = mongoose.model('User', {
  name: {
    type: String
  },
  age: {
    type: Number
  }
});

// create a new user using the model to pass teh correct type and pass the data 
const user1 = new User({
  name: 'Andrew',
  age: 23
});

// To save to database using CRUD operations
// user1.save().then(() => {
//   console.log(user1);
// }).catch((error) => {
//   console.log(`Error ${error}!`);
// })

// Model for Tasks
const Task = mongoose.model('Tasks', {
  description: {
    type: String
  },
  completed: {
    type: Boolean
  }
});

// create a new instance
const task1 = new Task({
  description: 'Meet with boss',
  completed: false
});

// save
task1.save().then(() => {
  console.log(task1);
}).catch((error) => {
  console.log(`Error ${error}!`);
})