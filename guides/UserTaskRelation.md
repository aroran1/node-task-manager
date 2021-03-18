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
1. User can store ids of all the tasks user has created
2. *Individual Task can store ids of the users who have created it*

We will be following the option #2 in this example as its a better approach.

### Add owner field
Add an `owners` field to the task data model, and setting its type as object id and making it a required field.
```
  ...
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
```
*PS: Drop the old data collection in the Robo 3T as the don't have any task user relation*

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
