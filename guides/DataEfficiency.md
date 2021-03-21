# Sorting, Pagination and Filtering

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