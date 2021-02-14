const mongoose = require('mongoose');
const validator = require('validator');

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
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    default: 0,
    // adds custom validation to mongoose
    validate(value) {
      if(value < 0) {
        throw new Error('Age must be a positive number!');
      }
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error('Email is invalid!');
      }
    }
  }
});

// create a new user using the model to pass teh correct type and pass the data 
const user1 = new User({
  name: '  CheekyMonkey  ',
  email: '   cheeky@monkey.com'
});

// To save to database using CRUD operations
user1.save().then(() => {
  console.log(user1);
}).catch((error) => {
  console.log(`Error ${error}!`);
})

// Model for Tasks
// const Task = mongoose.model('Tasks', {
//   description: {
//     type: String
//   },
//   completed: {
//     type: Boolean
//   }
// });

// create a new instance
// const task1 = new Task({
//   description: 'Meet with boss',
//   completed: false
// });

// save
// task1.save().then(() => {
//   console.log(task1);
// }).catch((error) => {
//   console.log(`Error ${error}!`);
// })