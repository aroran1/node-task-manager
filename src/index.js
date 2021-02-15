const express =  require('express');
 // requiring mongoose file ensures the mongoose runs and our project connects to db
require('./db/mongoose');
 
// gets the models
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

// makes the parsed json accessible as an object
app.use(express.json());

// Create a new user with HTTP POST method to '/users' path
app.post('/users', (req, res) => {
  const user = new User(req.body);

  user.save().then(() => {
    res.status(201).send(user)
  }).catch((err) => {
    // res.status(400);
    // res.send(err);
    res.status(400).send(err);
  });
});

// Create a new task with HTTP POST method to '/tasks' path
app.post('/tasks', (req, res) => {
  const task = new Task(req.body);

  task.save().then(() => {
    res.status(201).send(task)
  }).catch(e => {
    res.status(400).send(e);
  })
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});