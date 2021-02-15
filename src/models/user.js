const mongoose = require('mongoose');
const validator = require('validator');

// create a user collection model in the db
const User =  mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    default: 0,
    // custom validation to mongoose
    validate(val) {
      if (val < 0) {
        throw new Error('Age must be a positive number!');
      }
    }
  },
  email: {
    type: String,
    require: true,
    trim: true,
    lowercase: true,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error('Email is invalid!');
      }
    }
  },
  password: {
    type: String,
    require: true,
    minLength: 7,
    validate(val) {
      if(val.toLowerCase().includes('password')) {
        throw new Error('Password cannot conatins word "password"!');
      }
    }
  }
});

module.exports = User;