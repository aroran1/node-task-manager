const express =  require('express');
 // requiring mongoose file ensures the mongoose runs and our project connects to db
require('./db/mongoose'); 
const userRouter = require('./router/user');
const taskRouter = require('./router/task');

const app = express();
const port = process.env.PORT || 3000;

// makes the parsed json accessible as an object
app.use(express.json());

// Routers
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});

const bcrypt = require('bcryptjs');

const cryptoPassword = async () => {
  const password = 'Red123!';
  const cryptedPassword = await bcrypt.hash(password, 8);
  
  console.log('cryptedPassword', password + ' = ' + cryptedPassword);

  // Hash crypting can't be decoded by design so to compare the password on user login so 
  // its suggested to encrypt the entered password and then match as below

  const isMatch1 = await bcrypt.compare('Red123!', cryptedPassword);
  console.log('isMatch1', isMatch1);
  
  const isMatch2 = await bcrypt.compare('2ed123!', cryptedPassword);
  console.log('isMatch2', isMatch2);
}

cryptoPassword();