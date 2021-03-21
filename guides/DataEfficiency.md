# Sorting, Pagination and Filtering

## Timestamps
One of the useful field is to have a timestamp in the document to know when it was craeted or updated last and based on that we can send user its data in a particular order and can also be shown on the UI of the application.

To enable these fields we need to update the user / task model with additional object.
```
const userSchema = new mongoose.Schema({
	name: {
    ...
  }
  ...
}, {
  timestamps: true
});
```
Once this is set, drop the database again and create a new user from the Postman. You'll see two new fields are returned with the response as `createdAt` and `updatedAt`.

```
POSTMAN RESPONSE
{
    "user": {
        "age": 23,
        "_id": "605719a39e5fd825e186020f",
        "name": "Micheal Koen",
        "email": "misskoen@maersk.com",
        "createdAt": "2021-03-21T10:02:11.465Z",
        "updatedAt": "2021-03-21T10:02:11.650Z",
        "__v": 1
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDU3MTlhMzllNWZkODI1ZTE4NjAyMGYiLCJpYXQiOjE2MTYzMjA5MzF9.qTBwEtmTDil79-Efo01mx2B-hs6CYBgHdedlhvTPrtU"
}
```
Do the same for tasks as well. Change the Tasks object to Schema first and enable timestamp.
```
const taskSchema = new mongoose.Schema({
  description: {
    ...
  }
  ...
), { timestamps: true });
const Task = mongoose.model('Task', taskSchema );
module.exports = Task;
```
Test oit out with postman for additional `createdAt` and `updatedAt` fields.

## Filtering
Filtering only need to be appiled to the route that returns an array of data (in our app that is `/tasks` route). Overtime the array data can become massive and can be 100s or thousands of items in the array (for example using an app each day and adding couple of items everyday) which can slow down the response but by applying filtering we can make the response efficent and more relevant to the user (ie, user may only be interested in the uncomplete items or the recent items then something 2 years old).

By setting helpful options we can allow the consumer of the api to better target the data they want to get. We can do filtering by passing the query param sto the url like `GET /tasks?completed=true`. You can do this by mongoose find method and passing the properties in the object.

We can also achieve the same by `populate`.instead of pasing the string 'task' we can pass the object.
```
  // before:
  await req.user.populate('tasks').execPopulate();

  // after
  await req.user.populate({
    path: 'tasks', // still need to pass the path
    match: {
      completed: true // matches what is passed
    }

  }).execPopulate();

```
Test this in the postman returns only the matched option array, but bearing in mind so far we have only passed these values statically instead of gettig it from the URL query param.
- Start by creating an empty matched object and assign that to the match object within the populate.
- Check if a particular query has been passed or not
- convert the string "true" or "false" to boolean value and assign it to matched.<filterName>
```
// GET /tasks?completed=true
router.get('/tasks', auth, async (req, res) => {
  try {
    const match = {}; // sets as empty object

    if (req.query.completed) { // checks if that filter is provided
      match.completed = req.query.completed === 'true' // converts the string true false to boolean
    }

    // method 3 with filtering
    await req.user.populate({
      path: 'tasks',
      match // ES6 property shorthand same key value name
    }).execPopulate();

    res.send(req.user.tasks);
  } catch(e) {
    res.status(500).send(e);
  }
});
```
