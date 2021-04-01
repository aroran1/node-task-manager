const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		unique: true,
		required: true,
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
		required: true,
		minlength: 7,
        trim: true,
		validate(val) {
			if (val.toLowerCase().includes('password')) {
				throw new Error('Password cannot contains word "password"!');
			}
		}
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
	tokens: [{ // tokens will be an array of object
		token: {
			type: String,
			required: true
		}
	}],
	avatar: {
		type: Buffer
	}
}, {
	timestamps: true
});

userSchema.virtual('tasks', {
	ref: 'Task',
	localField: '_id', // localField is where local data is stored - so the fireign field is related to user id
	foreignField: 'owner' // name of the field in the Tasks db that relates to the User
})

// User Data Security - custom method
// custom method to alter the user object before sending back to user via /login
// userSchema.methods.getPublicProfile = function() {
// 	const user = this;
// 	const userObject = user.toObject();

// 	delete userObject.password;
// 	delete userObject.tokens;

// 	return userObject;
// }
// toJSON method
userSchema.methods.toJSON = function() {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;
	delete userObject.avatar;

	return userObject;
}

// methods are available on the instances of that collection (aka instance methods)
// need this binding so don't use arrow function
userSchema.methods.generateAuthToken = async function() {
	const user = this;
	const token = jwt.sign({ _id: user._id.toString() }, 'thisismynodecourse' );

	user.tokens = user.tokens.concat({ token });
	await user.save();

	return token;
}

// statics are available on the models / collections (aka model methods)
// custom method to find user by credentials for login
userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });

	if (!user) {
		throw new Error('Unable to login');
	}

	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		throw new Error('Unable to login');
	}

	return user;
}

// hash plain text pasword before saving
userSchema.pre('save', async function (next) {
	const user = this;
	
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}

	next();
})

// Delete Tasks when User is deleted with remove
userSchema.pre('remove', async function (next) {
	const user = this;
	await Task.deleteMany({ owner: user._id});

	next();
})

// create a user collection model as schema in the db
const User =  mongoose.model('User', userSchema);

module.exports = User;