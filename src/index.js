const express =  require('express');
 // requiring mongoose file ensures the mongoose runs and our project connects to db
require('./db/mongoose'); 
const userRouter = require('./router/user');
const taskRouter = require('./router/task');

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

// JWT local testing
const jwt = require('jsonwebtoken');

const myTokenTest = async() => {

  // sign method accept 3 arguments
  // 1. some data info can be mongo document id
  // 2. unquie serier of string or secret message
  // 3. expriy info in string
  const token = jwt.sign({ _id: '123dffdj'}, 'ilovepotatoeschipswithcoke', { expiresIn: '1 hour'});
  console.log(token);
  // terminal output
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMjNkZmZkaiIsImlhdCI6MTYxMzg2OTE2MywiZXhwIjoxNjEzODcyNzYzfQ.sI3cM6YmPNue8mLOuheadNr3UikcFvCFcTCkbKWRVeM

  // verify method accepts 2 params, generated token with the secret message
  const data = jwt.verify(token, 'ilovepotatoeschipswithcoke');
  console.log(data);
  // terminal output - success
  // { _id: '123dffdj', iat: 1613869291, exp: 1613872891 }

  // terminal output - failed
  // return done(new JsonWebTokenError('invalid signature'));
}

myTokenTest()

// ******************************************************************************//
// ******************************************************************************//