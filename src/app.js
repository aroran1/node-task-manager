const express =  require('express');
 // requiring mongoose file ensures the mongoose runs and our project connects to db
require('./db/mongoose'); 
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

// makes the parsed json accessible as an object
app.use(express.json());

// Routers
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
