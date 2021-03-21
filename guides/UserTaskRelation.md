# User Path Restrictions
User should only be able to access their own user paths rather then accessing someone else's accounbt by ID.

Hence all the paths in the user routers currently set wuth `/users/:id` need to change to `/users/me` and will only be accessible if user is authenticated with auth middleware method.

Since `auth` middleware method hooks user object (ie logged in user's account details), in the rout method we don't need to find user details individially useing `findBy` methods anymore we can just access it with req.user, make changes and send it back as response which simplifies the logic massivly. this functionality is already extracted out in the auth middleware to keep code clean.

## User Task Relations
User should only be able to perform CURD operations on their own tasks rather then all the tasks. To create this functionality we need to craete user-task relationship. To handle this we will be workin with below 4 files:
- src/index.js
- src/models/user.js
- src/models/task.js
- src/routers/task.js

To create the relation there are 2 ways:
1. User can store ids of all the tasks user has created ( 1 to multiple relation)
2. *Individual Task can store ids of the users who have created it* ( 1 to 1 relation)

We will be following the option #2 in this example as its a better approach.

### Add owner field
Add an `owners` field to the task data model, and setting its type as object id and making it a required field.
```
  ...
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // mongoose provide us easy way to access another model by using ref and passing the model name
  }
```
**PS: Drop the old data collection in the Robo 3T as the don't have any task user relation**

### Task router to authentocate and attach user Id
In the Create task route, take the task from the reqbody as previously, convert it to an object and tag owners id user auth and ES6 spread operator.

```
// Tasks
// Create a new task with HTTP POST method to '/tasks' path
router.post('/tasks', auth, async (req, res) => {
  // const task = new Task(req.body);

  const task = new Task({
    ...req.body,
    owner: req.user._id
  })
  ...

```
Now try creating a new user (which automatically logs you in) and craete a new task. Output will look liek below:
```
{
    "completed": false,
    "_id": "60539ec7555c430a5fb863e6",
    "description": "Finish Node.js course",
    "owner": "60539d6880502509d677f872",
    "__v": 0
}
```
Having access to this owner's id will allow us to authenticate the owner and update / delete the task as per user action.

### Running some relation test

#### One way binding
`./index.js`
Mongoose provide us easy way to access one model from another by using ref key with the model name for example in the Task model within `owner` property we passed `ref: 'User'`. That will allow accessing the realted User document attached to the particular task when we use `Task.populate('owner').execPopulate()`.
```
const Task = require("./models/task");

const main = async () => {
	const task = await Task.findById('60539ec7555c430a5fb863e6');
	console.log(task);
	console.log(task.owner); // returns owner id

	await task.populate('owner').execPopulate();
	console.log(task.owner); // returns owner document with ref in place in the task > owner model
}

main()

// TERMINAL OUTPUT
{
  age: 20,
  _id: 60539d6880502509d677f872,
  name: 'Reema Seed',
  email: 'reem@seed.com',
  password: '$2a$08$1uq4BrpqWN/Waqhfi4rwAeq/Etgn4pwXtb97.HcnGhUmpoqZsLkb2',
  tokens: [
    {
      _id: 60539d6880502509d677f873,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDUzOWQ2ODgwNTAyNTA5ZDY3N2Y4NzIiLCJpYXQiOjE2MTYwOTI1MjB9.IzOPth_5WzOiMQcuaBe96ru2Sme55su713oJsSlw13I'
    }
  ],
  __v: 1
}
```

#### Two way binding
With above in place it has created a 1 way binding which means, from the task document, we can also access the User document but at the moment we can't access a Task document from Users document.

To do this, we are going to set-up a virtual property. A virtual property is not a data stored in the data base but its a relationship between 2 entities, ie, User and Task. Please note, in the tasks model `owner` is a real field stored in the tasks db but virtual is not stired in the db, its just a way for mongoose to figure out who owns what and how they are related.
`/src/models/user.js`
```
userSchema.virtual('tasks', {
	ref: 'Task',
	localField: '_id', // localField is where local data is stored - so the fireign field is related to user id
	foreignField: 'owner' // name of the field in the Tasks db that relates to the User
})
```

once this in place go back to `./index.js` test and add below:
```
const Task = require("./models/task");
const User = require("./models/user");

const main = async () => {
	const task = await Task.findById('60539ec7555c430a5fb863e6');
	// console.log(task);
	// console.log(task.owner); // returns owner id
	// await task.populate('owner').execPopulate();
	// console.log(task.owner); // returns owner document with ref in place in the task > owner model

	const user = await User.findById('60539d6880502509d677f872');
	await user.populate('tasks').execPopulate();
	console.log(user.tasks); // returns an array of
}

main()
```

## Tasks
Now add auth to all the tasks routes and find item but `{_id: req.params.id, ownder: req.user._id}`.

### Delete tasks on User delete
Also need to make sure when user delete their account, user tasks also get deleted.
- You can do this by either using the route delete user method, or
- by setting a method in User model as a middleware which is generally a good practice to follow do it can be a reusable method

We will follow the User model as a middleware, and we will make this change on the `pre` event of when user's route calls `remove` method. We are also using `deleteMany` query and matching the task with where owner id matches the user id.

`src/models/user.js`
```
const Task = require('./task');

// Delete Tasks when User is deleted with remove
userSchema.pre('remove', async function (next) {
	const user = this;
	await Task.deleteMany({ owner: user._id});

	next();
})
```
Once in place and you'll remove a User will automatically remove the tasks.


