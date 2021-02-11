# node-task-manager

## Mongoose

Mongoose uses the MongoDB's low level apis behind the scene but on the framework leve it makes thing easier for the users to implement, type checks or authencation etc.

### Connecting to mongoDB via Mongoose
```
// task-manager-api creates the specified database
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true,
  useCreateIndex: true
})
```

### Create collection model to check the data type
```
const User = mongoose.model('User', {
  name: {
    type: String
  },
  age: {
    type: Number
  }
});
```

### Create data locally with new User model instance
```
const user1 = new User({
  name: 'Andrew',
  age: 23
});
```

### Save the data to databe using crud operation as .save
```
// To save to database using CRUD operations
user1.delete().then(() => {
  console.log(user1);
}).catch((error) => {
  console.log(`Error ${error}!`);
})
```

### Terminal Output:
```
{ _id: 60253b9742f971a07f44bb8e, name: 'Andrew', age: 23, __v: 0 }
```
### Terminal Validation error
```
Error ValidationError: age: Cast to Number failed for value "dfsd" at path "age"!
```