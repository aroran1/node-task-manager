const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const router = new express.Router();
// gets user models
const User = require('../models/user');
const auth = require('../middleware/auth');

const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account');

/**************************************************************************/
/* Create a new user                                                      */
/**************************************************************************/
// Create a new user with HTTP POST method to '/users' path
// No middleware authentication required for creating a new account
router.post('/users', async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		sendWelcomeEmail(user.email, user.name);
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token })
	} catch (e) {
		res.status(400).send(e);
	}
});


/**************************************************************************/
/* Login User                                                             */
/**************************************************************************/
// No middleware authentication required for logging into an account
router.post('/users/login', async(req, res) => {
	try {
		// creating a custom method findByCredentials
		// this can only be done if you use schema instead of passing the object
		const user = await User.findByCredentials(req.body.email, req.body.password);

		// generate token
		// make sure you are running the generateAuthToken method on the user instance created above with user cont
		// and not on the whole collection as it need to be unique for each user
		const token = await user.generateAuthToken();

		// custom method to remove certain properties before sending the user data back
		// res.send({ user: user.getPublicProfile(), token });
		// same as getPublicProfile but without custom method instea used toJSON
		res.send({ user, token });

	} catch (e) {
		res.status(400).send(e);
	}
});


/**************************************************************************/
/* Logout User from 1 or from all sessions                                */
/**************************************************************************/
// logout - signle session expiring 1 token only
router.post('/users/logout', auth, async(req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter( token => {
			return token.token !== req.token
		})

		await req.user.save();
		res.send();
	} catch (e) {
		res.status(500).send(e);
	}
});

// logoutAll - to logout from all sessions emptying all token array
router.post('/users/logoutAll', auth, async(req, res) => {
	try {
		req.user.tokens = []; // removing all active tokens
		await req.user.save();
		res.send();
	} catch (e) {
		res.status(500).send(e);
	}
})


/**************************************************************************/
/* Get all users                                                          */
/**************************************************************************/
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


/**************************************************************************/
/* Get User by /id or /me                                                 */
/**************************************************************************/
// User shouldn't have access to other users data by id so this
// path is not required anymore - REFACTORED BELOW
// // Read a users with matched :id with HTTP GET method to '/users/:id' path
// router.get('/users/:id', async (req, res) => {
// 	// console.log(req.params);
// 	const _id = req.params.id;
// 	try {
// 		const user = await User.findById(_id);
// 		if (!user) {
// 			return res.status(404).send()
// 		}
// 		res.send(user);
// 	} catch (e) {
// 		res.status(500).send(e);
// 	}
// });

// the above /users will never be used by users so instaed can use /user/me path below
// the finding user functionality is already been taken care of by the auth middleware and 
// returned as req.user so not required in this route anymore instead res returns user from re.user
router.get('/users/me', auth, async (req, res) => {
	res.send(req.user)
})


/**************************************************************************/
/* Update User by /id or /me                                              */
/**************************************************************************/
// User should only be allowed to updated their own details so
// accessing user details via ID is not required - REFACTORED BELOW
// router.patch('/users/:id', async (req, res) => {
//   // check if the patch operation property is allowed
// 	const updates = Object.keys(req.body); // operation property
// 	const allowedOperations = ['name', 'email', 'password', 'age'];
// 	const isValidOperation = updates.every( update => allowedOperations.includes(update));

// 	if (!isValidOperation) {
// 		return res.status(400).send({ error: 'Invalid updates!' });
// 	}

// 	try {
// 		// const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
// 		const user = await User.findById(req.params.id);

// 		updates.forEach( update => user[update] = req.body[update]);
// 		await user.save();

// 		if (!user) {
// 			return res.status(404).send()
// 		}
// 		res.send(user);

// 	} catch (e) {
// 		res.status(400).send(e);
// 	}
// });

router.patch('/users/me', auth, async (req, res) => {
  // check if the patch operation property is allowed
	const updates = Object.keys(req.body); // operation property
	const allowedOperations = ['name', 'email', 'password', 'age'];
	const isValidOperation = updates.every( update => allowedOperations.includes(update));

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid updates!' });
	}

	try {
		// // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
		// const user = await User.findById(req.params.id);

		updates.forEach( update => req.user[update] = req.body[update]);
		await req.user.save();
		res.send(req.user); 

	} catch (e) {
		res.status(400).send(e);
	}
});


/**************************************************************************/
/* Delete User by /id or /me                                              */
/**************************************************************************/
// User is only allowed to delete their own accounts rather deleting
// someone else's account by id - REFACTORED BELOW
// // delete a user
// router.delete('/users/:id', async (req, res) => {
// 	try {
// 		const user = await User.findByIdAndDelete(req.params.id);
// 		if (!user) {
// 	  		res.status(404).send();
// 		}
// 		res.send(user);
//   	} catch (e) {
// 		res.status(500).send();
//   	}
// });

// add auth middleware
// - auth middleware is attaching a user to the request which can be used in the method below
// instead of fining the user by ID 
// user can only delete their own account
// path changed to '/users/me'
// - apply auth middleware
// - so no need to find the ID can be accessed via req.user._id
// change delete to async req.user.remove();
router.delete('/users/me', auth, async (req, res) => {
	try {
		// no need to
		// const user = await User.findByIdAndDelete(req.user._id);
		// if (!user) {
	  // 		res.status(404).send();
		// }
			await req.user.remove();
			sendCancellationEmail(req.user.email, req.user.name);
			res.send(req.user);
  	} catch (e) {
			res.status(500).send();
  	}
});

/**************************************************************************/
// File upload
const upload = multer({
	// dest: 'avatars', // only require for storing files locally, not needed for buffer
	limits: {
		fieldSize: 1000000
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error('Pldease upload JPG, JPEG or PNG image only!'));
		}
		cb(undefined, true);
	}
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
	// req.user.avatar = req.file.buffer;

	// image resizing
	const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
	req.user.avatar = buffer;

	await req.user.save();
	res.send();
}, (error, req, res, next) => { // this patter is requited for express to understand the error
	res.status(400).send({ error: error.message })
});

// Delete uploaded file
router.delete('/users/me/avatar', auth, async(req, res) => {
	req.user.avatar = undefined;
	await req.user.save();
	res.send();
});

// GET image
router.get('/users/:id/avatar', async (req, res) => { // you can pass auth to authenticate
	try {
		const user = await User.findById(req.params.id);

		if (!user || !user.avatar) {
			throw new Error();
		}

		// usually when you send the json response back Express automatically sets it for you
		// but in this case we are sending back an image hence we need to set it manually
		res.set('Content-Type', 'image/png')
		res.send(user.avatar);
	} catch (e) {
		res.status(404).send();
	}
});


/**************************************************************************/

module.exports = router;