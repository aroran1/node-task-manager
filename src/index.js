const express =  require('express');
 // requiring mongoose file ensures the mongoose runs and our project connects to db
require('./db/mongoose');
 
// gets the models
const User = require('./models/user');
const Task = require('./models/task');
const { request } = require('express');

const app = express();
const port = process.env.PORT || 3000;

// makes the parsed json accessible as an object
app.use(express.json());

// Users
// Create a new user with HTTP POST method to '/users' path
app.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user)
  } catch(e) {
    res.status(400).send(e);
  }
});

// Read all users with HTTP GET method to '/users' path
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users)
  } catch(e) {
    res.status(500).send(e);
  }
});

// Read a users with matched :id with HTTP GET method to '/users/:id' path
app.get('/users/:id', async (req, res) => {
  // console.log(req.params);
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);
    if(!user) {
      return res.status(404).send()
    }
    res.send(user);
  } catch(e) {
    res.status(500).send(e);
  }
});

// Update user details
app.patch('/users/:id', async (req, res) => {
  // check if the patch operation property is allowed
  const updates = Object.keys(req.body); // operation property
  const allowedOperations = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every( update => allowedOperations.includes(update));

  if(!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

    if(!user) {
      return res.status(404).send()
    }
    res.send(user);

  } catch(e) {
    res.status(400).send(e);
  }
});

// delete a user
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) {
      res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});


// Tasks
// Create a new task with HTTP POST method to '/tasks' path
app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Read all tasks with HTTP GET method to '/tasks' path
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch(e) {
    res.status(500).send(e);
  }
});

// Read a task with matched :id with HTTP GET method to '/tasks/:id' path
app.get('/tasks/:id', async (req, res) => {
  // console.log(req.params);
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);
    if(!task) {
      return res.status(404).send()
    }
    res.status(200).send(task);
  } catch(e) {
    res.status(500).send(e);
  }
});

// update task details
app.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedOperations = ['description', 'completed'];
  const isValidOperation = updates.every(update => allowedOperations.includes(update));

  if(!isValidOperation) {
    return res.status(404).send({ error: 'Invalid Operation!' });
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});

    if(!task) {
      return res.status(404).send();
    }
    res.send(task);

  } catch (e) {
    res.status(400).send();
  }
});

// delete a user
app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if(!task) {
      res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});