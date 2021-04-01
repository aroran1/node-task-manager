const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
	// console.log('Auth Middleware running!');
	// next();

	try {
		const token = req.header('Authorization').replace('Bearer ', '');
		// console.log(token);
		const deccoded = jwt.verify(token, process.env.JWT_SECRET);

		// using findOne instead of findById is because we want to finds the user with Id but also
		// want to make the token exist in the tokens array so when user logs out
		// we can delete this token from the array we achieve this by searching for
		// 'tokens.token' with the parsed token value
		const user = await User.findOne({ _id: deccoded._id, 'tokens.token': token });

		if (!user) {
			throw new Error('User Not found!');
		}

		req.token = token;
		req.user = user;

		next();
	} catch (e) {
		res.status(401).send({ error: 'Please authenticate!' });
	}
};

module.exports = auth;