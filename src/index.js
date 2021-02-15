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

// Users
// Create a new user with HTTP POST method to '/users' path
app.post('/users', (req, res) => {
  const user = new User(req.body);

  user.save().then(() => {
    res.status(201).send(user)
  }).catch(e => {
    // res.status(400);
    // res.send(e);
    res.status(400).send(e);
  });
});

// Read all users with HTTP GET method to '/users' path
app.get('/users', (req, res) => {
  User.find({}).then(users => {
    res.status(200).send(users)
  }).catch(e => {
    res.status(500).send(e);
  });
});

// Read a users with matched :id with HTTP GET method to '/users/:id' path
app.get('/users/:id', (req, res) => {
  // console.log(req.params);
  const _id = req.params.id;

  User.findById(_id).then(user => {
    if(!user) {
      return res.status(404).send()
    }

    res.status(200).send(user)
  }).catch(e => {

    res.status(500).send(e);
  });
});


// Tasks
// Create a new task with HTTP POST method to '/tasks' path
app.post('/tasks', (req, res) => {
  const task = new Task(req.body);

  task.save().then(() => {
    res.status(201).send(task)
  }).catch(e => {
    res.status(400).send(e);
  })
});

// Read all tasks with HTTP GET method to '/tasks' path
app.get('/tasks', (req, res) => {
  Task.find({}).then(tasks => {
    res.status(200).send(tasks)
  }).catch(e => {
    res.status(500).send(e);
  });
});

// Read a task with matched :id with HTTP GET method to '/tasks/:id' path
app.get('/tasks/:id', (req, res) => {
  // console.log(req.params);
  const _id = req.params.id;

  Task.findById(_id).then(task => {
    if(!task) {
      return res.status(404).send()
    }

    res.status(200).send(task)
  }).catch(e => {
    
    res.status(500).send(e);
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});