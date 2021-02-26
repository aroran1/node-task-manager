const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
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
    unique: true,
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
  },
  tokens: [{ // tokens will be an array of object
    token: {
      type: String,
      require: true
    }
  }]
});

// methods are available on the instances of that collection (aka instance methods)
// need this binding so don't use arrow function
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'thisismynodecourse', { expiresIn: "1 second" } );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
}

// statics are available on the models / collections (aka model methods)
// custom method to find user by credentials for login
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  console.log('user', user, email, password);

  if(!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if(!isMatch) {
    throw new Error('Unable to login');
  }

  return user;
}

// hash plain text pasword before saving
userSchema.pre('save', async function(next) {
  const user = this;
  
  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
})

// create a user collection model as schema in the db
const User =  mongoose.model('User', userSchema);

module.exports = User;