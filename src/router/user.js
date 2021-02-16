const express = require('express');
const router = new express.Router();
// gets user models
const User = require('../models/user');

// Users
// Create a new user with HTTP POST method to '/users' path
router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user)
  } catch(e) {
    res.status(400).send(e);
  }
});

// Read all users with HTTP GET method to '/users' path
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users)
  } catch(e) {
    res.status(500).send(e);
  }
});

// Read a users with matched :id with HTTP GET method to '/users/:id' path
router.get('/users/:id', async (req, res) => {
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
router.patch('/users/:id', async (req, res) => {
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
router.delete('/users/:id', async (req, res) => {
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

module.exports = router;