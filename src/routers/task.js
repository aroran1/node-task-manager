const express = require('express');
const auth = require("../middleware/auth");
const router = new express.Router();

// get task model
const Task = require('../models/task');

/******************************************************************************/
/* Create a task                                                              */
/******************************************************************************/
// Create a new task with HTTP POST method to '/tasks' path
router.post('/tasks', auth, async (req, res) => {
  // const task = new Task(req.body);

  const task = new Task({
    ...req.body,
    owner: req.user._id
  })

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});


/******************************************************************************/
/* Get all tasks                                                                 */
/******************************************************************************/
// Read all tasks with HTTP GET method to '/tasks' path
// REFACTORED to return tasks related to authenticated user only
// router.get('/tasks', async (req, res) => {
//   try {
//     const tasks = await Task.find({});
//     res.status(200).send(tasks);
//   } catch(e) {
//     res.status(500).send(e);
//   }
// });

// GET /tasks?completed=true
router.get('/tasks', auth, async (req, res) => {
  try {
    //method 1
    // const tasks = await Task.find({ owner: req.user._id});

    //method 2
    // await req.user.populate('tasks').execPopulate();

    const match = {}; // sets as empty object

    if (req.query.completed) {  // checks if that filter is provided
      match.completed = req.query.completed === 'true' // converts the string true false to boolean
    }

    // method 3 with filtering
    await req.user.populate({
      path: 'tasks',
      match
    }).execPopulate();

    res.send(req.user.tasks);
  } catch(e) {
    res.status(500).send(e);
  }
});

/******************************************************************************/
/* Get a task                                                                 */
/******************************************************************************/
// Read a task with matched :id with HTTP GET method to '/tasks/:id' path
//  - authenticate and find by user as well REFACTORED
// router.get('/tasks/:id', async (req, res) => {
//   // console.log(req.params);
//   const _id = req.params.id;

//   try {
//     const task = await Task.findById(_id);
//     if(!task) {
//       return res.status(404).send()
//     }
//     res.status(200).send(task);
//   } catch(e) {
//     res.status(500).send(e);
//   }
// });

// authenticate and find a task by id and created by a particular user
router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if(!task) {
      return res.status(404).send()
    }
    res.status(200).send(task);
  } catch(e) {
    res.status(500).send(e);
  }
});


/******************************************************************************/
/* Update a task                                                              */
/******************************************************************************/
// router.patch('/tasks/:id', async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedOperations = ['description', 'completed'];
//   const isValidOperation = updates.every(update => allowedOperations.includes(update));

//   if(!isValidOperation) {
//     return res.status(404).send({ error: 'Invalid Operation!' });
//   }

//   try {
//     // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});

//     const task = await Task.findById(req.params.id);
//     updates.forEach( update => task[update] = req.body[update]);
//     await task.save();

//     if(!task) {
//       return res.status(404).send();
//     }
//     res.send(task);

//   } catch (e) {
//     res.status(400).send();
//   }
// });

// authenticate and find by id and owner
router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedOperations = ['description', 'completed'];
  const isValidOperation = updates.every(update => allowedOperations.includes(update));

  if(!isValidOperation) {
    return res.status(404).send({ error: 'Invalid Operation!' });
  }

  try {
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});

    // const task = await Task.findById(req.params.id);
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    updates.forEach( update => task[update] = req.body[update]);
    await task.save();
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);

  } catch (e) {
    res.status(400).send();
  }
});

/******************************************************************************/
/* Delete a task                                                              */
/******************************************************************************/
// router.delete('/tasks/:id', async (req, res) => {
//   try {
//     const task = await Task.findByIdAndDelete(req.params.id);
//     if(!task) {
//       res.status(404).send();
//     }
//     res.send(task);
//   } catch (e) {
//     res.status(500).send();
//   }
// });


// authenticate and find by id and owner
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    // const task = await Task.findByIdAndDelete(req.params.id);
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if(!task) {
      res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

/******************************************************************************/

module.exports = router;
