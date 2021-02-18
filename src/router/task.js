const express = require('express');
const router = new express.Router();

// get task model
const Task = require('../models/task');


// Tasks
// Create a new task with HTTP POST method to '/tasks' path
router.post('/tasks', async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Read all tasks with HTTP GET method to '/tasks' path
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch(e) {
    res.status(500).send(e);
  }
});

// Read a task with matched :id with HTTP GET method to '/tasks/:id' path
router.get('/tasks/:id', async (req, res) => {
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
router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedOperations = ['description', 'completed'];
  const isValidOperation = updates.every(update => allowedOperations.includes(update));

  if(!isValidOperation) {
    return res.status(404).send({ error: 'Invalid Operation!' });
  }

  try {
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});

    const task = await Task.findById(req.params.id);
    updates.forEach( update => task[update] = req.body[update]);
    await task.save();

    if(!task) {
      return res.status(404).send();
    }
    res.send(task);

  } catch (e) {
    res.status(400).send();
  }
});

// delete a user
router.delete('/tasks/:id', async (req, res) => {
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

module.exports = router;
