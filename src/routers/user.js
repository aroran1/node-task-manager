const express = require('express');
const router = new express.Router();
// gets user models
const User = require('../models/user');
const auth = require('../middleware/auth');

// Users
// Create a new user with HTTP POST method to '/users' path
// No middleware authentication required for this path
router.post('/users', async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token })
	} catch (e) {
		res.status(400).send(e);
	}
});

// No middleware authentication required for this path
router.post('/users/login', async(req, res) => {
	try {
		// creating a custom method findByCredentials
		// this can only be done if you use schema instead of passing the object
		const user = await User.findByCredentials(req.body.email, req.body.password);

		// generate token
		// make sure you are running the generateAuthToken method on the user instance created above with user cont
		// and not on the whole collection as it need to be unique for each user
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (e) {
		res.status(400).send(e);
	}
});

// logout
router.post('/users/logout', auth, async(req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter( token => {
			return token.token !== req.token
		})

		await req.user.save();
		res.send();
	} catch (e) {
		res.status(500).send();
	}
});

// Read all users with HTTP GET method to '/users' path
// the 2nd Parameter `auth` is the middleware which gets
// triggered after user hits /users path and before the async method
// /users path shouldn't let one user access the data of all the other users
// so its not a valid user case so instead see /users/me
router.get('/users', auth, async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users)
	} catch (e) {
		res.status(500).send(e);
	}
});

// the above /users will never be used by users so instaed can use /user/me path below
// the finding user functionality is already been taken care of by the auth middleware and 
// returned as req.user so not required in this route anymore instead res returns user from re.user
router.get('/users/me', auth, async (req, res) => {
	res.send(req.user)
})

// Read a users with matched :id with HTTP GET method to '/users/:id' path
router.get('/users/:id', async (req, res) => {
	// console.log(req.params);
	const _id = req.params.id;

	try {
		const user = await User.findById(_id);

		if (!user) {
			return res.status(404).send()
		}

		res.send(user);
	} catch (e) {
		res.status(500).send(e);
	}
});

// Update user details
router.patch('/users/:id', async (req, res) => {
  // check if the patch operation property is allowed
	const updates = Object.keys(req.body); // operation property
	const allowedOperations = ['name', 'email', 'password', 'age'];
	const isValidOperation = updates.every( update => allowedOperations.includes(update));

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid updates!' });
	}

	try {
		// const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
		const user = await User.findById(req.params.id);

		updates.forEach( update => user[update] = req.body[update]);
		await user.save();

		if (!user) {
			return res.status(404).send()
		}
		res.send(user);

	} catch (e) {
		res.status(400).send(e);
	}
});

// delete a user
router.delete('/users/:id', async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) {
	  		res.status(404).send();
		}
		res.send(user);
  	} catch (e) {
		res.status(500).send();
  	}
});

module.exports = router;