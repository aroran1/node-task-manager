const express =  require('express');
 // requiring mongoose file ensures the mongoose runs and our project connects to db
require('./db/mongoose'); 
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

// // simple GET disabling middleware
// app.use((req, res, next) => {
//   if (req.method === 'GET') {
//     res.send('GET methods are disabled!');
//   } else {
//     next();
//   }
// })

// // Maintainance middleware sending 503 for cases like DB update
// app.use((req, res, next) => {
//   res.status(503).send('Site is under maintainence. Please try again in few hours.');
// })


// ******************************************************************************//
// File Upload - Multer
const multer = require('multer'); // require multer
const upload = multer({  // create a new instance of multer
	// make sure the dest folder is created before making the request
	dest: 'images',
	limits: {
		fileSize: 1000000
	},
	fileFilter(req, file, cb) {
		// if (!file.originalname.endsWith('.pdf')) { // useful for signle file type
			if (!file.originalname.match(/\.(doc|docx)$/)) { // use regex for multiple file type matches 
			return cb(new Error('Please upload a PDF!'))
		}

		cb(undefined, true);
	}
});

// const errorMiddleware = (req, res, next) => {
// 	throw new Error('Error my middleware');
// }
// create new route and pass upload.single as a middleware
// multer need to know param name as 'upload' that the file will be attached with
// app.post('/upload', errorMiddleware, (req, res) => { 

app.post('/upload', upload.single('upload'), (req, res) => { 
	res.send();
}, (error, req, res, next) => { // this patter is requited for express to understand the error
	res.status(400).send({ error: error.message })
});

// ******************************************************************************//


// makes the parsed json accessible as an object
app.use(express.json());

// Routers
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
	console.log(`Server is up on port ${port}!`);
});


// ******************************************************************************//
// ******************************************************************************//
// bcrypt local testing
// const bcrypt = require('bcryptjs');

// const cryptoPassword = async () => {
//   const password = 'Red123!';
//   const cryptedPassword = await bcrypt.hash(password, 8);
  
//   console.log('cryptedPassword', password + ' = ' + cryptedPassword);

//   // Hash crypting can't be decoded by design so to compare the password on user login so 
//   // its suggested to encrypt the entered password and then match as below

//   const isMatch1 = await bcrypt.compare('Red123!', cryptedPassword);
//   console.log('isMatch1', isMatch1);
  
//   const isMatch2 = await bcrypt.compare('2ed123!', cryptedPassword);
//   console.log('isMatch2', isMatch2);
// }

// cryptoPassword();

// ******************************************************************************//
// ******************************************************************************//

// // JWT local testing
// const jwt = require('jsonwebtoken');

// const myTokenTest = async() => {
// 	// sign method accept 3 arguments
// 	// 1. some data info can be mongo document id
// 	// 2. unquie serier of string or secret message
// 	// 3. expriy info in string
// 	const token = jwt.sign({ _id: '123dffdj'}, 'ilovepotatoeschipswithcoke', { expiresIn: '1 hour'});
// 	console.log(token);

// 	// terminal output
// 	// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMjNkZmZkaiIsImlhdCI6MTYxMzg2OTE2MywiZXhwIjoxNjEzODcyNzYzfQ.sI3cM6YmPNue8mLOuheadNr3UikcFvCFcTCkbKWRVeM

// 	// verify method accepts 2 params, generated token with the secret message
// 	const data = jwt.verify(token, 'ilovepotatoeschipswithcoke');
// 	console.log(data);
// 	// terminal output - success
// 	// { _id: '123dffdj', iat: 1613869291, exp: 1613872891 }

// 	// terminal output - failed
// 	// return done(new JsonWebTokenError('invalid signature'));
// }

// myTokenTest()

// ******************************************************************************//
// ******************************************************************************//

// // toJSON
// const pet = {
// 	name: "Hal"
// };

// pet.toJSON = function() {
// 	// console.log('1', this);
// 	// return this;

// 	// or could also return just the empty object
// 	return {}
// }

// console.log('2', JSON.stringify(pet)); // OUTPUT: {"name":"Hal"}
// // When we call res.send it calls JSON.stringify behind the scene 

// ******************************************************************************//
// ******************************************************************************//
// Testing Task User relation

// const Task = require("./models/task");
// const User = require("./models/user");

// const main = async () => {
// 	const task = await Task.findById('60539ec7555c430a5fb863e6');
// 	// console.log(task);
// 	// console.log(task.owner); // returns owner id
// 	// await task.populate('owner').execPopulate();
// 	// console.log(task.owner); // returns owner document with ref in place in the task > owner model

// 	const user = await User.findById('60539d6880502509d677f872');
// 	await user.populate('tasks').execPopulate(); // this worked when task model was pass as object instead of schema
// 	console.log(user.tasks); // returns an array of 
// }

// main()
// ******************************************************************************//
// ******************************************************************************//