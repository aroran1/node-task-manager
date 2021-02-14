# Mongoose

Mongoose uses the MongoDB's low level apis behind the scene but on the framework leve it makes thing easier for the users to implement, type checks or authencation etc.

[Mongoose Schema](https://mongoosejs.com/docs/guide.html)

## Connecting to mongoDB via Mongoose
```
// task-manager-api creates the specified database
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true,
  useCreateIndex: true
})
```

## Create collection model to check the data type and validation
Note: Mongoose will tak ethe model name `User` in this case, converts it to a lower case and polarise it and use it as a collection name in the db. So in the db you'll see the collection named as `user` instead of capital `User`.
[Mongoose default validation](https://mongoosejs.com/docs/validation.html)
You can use npm package for validation as well [npm validator](https://www.npmjs.com/package/validator).
You can also pass default value and sanatise the data as well with the mongoose properties.
```
const User = mongoose.model('User', {
  name: {
    type: String, // checks the type
    trim: true, // trims any white space and string specific
    required: true // marks this property as required when saving data
  },
  // **Terminal Error Output: Error ValidationError: description: Path `description` is required.!**
  age: {
    type: Number,
    default: 0, // passes the default value
    // adds custom validation to mongoose
    validate(value) {
      if(value < 0) {
        throw new Error('Age must be a positive number!');
      }
    } 
  },
  // **Terminal Error Output: Error ValidationError: age: Age must be a positive number!!**

  // npm validator validation example
  email: {
    type: String,
    required: true,
    trim: true, // trims any white space and string specific
    lowercase: true, // converts all values to lowercase before storing in db for data sanitization
    validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error('Email is invalid!');
      }
    }
  },
  // **Terminal Error Output: Error ValidationError: emai: Path `emai` is required.!**

  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 7, // length validation
    validate(value){
      if(value.toLowerCase().includes('password')) {
        throw new Error('Password cannot conatins word "password"!');
      }
    }
  }
});

```

## Create data locally with new User model instance
```
const user1 = new User({
  name: 'Andrew',
  age: 23
});
```

## Save the data to databe using crud operation as .save
```
// To save to database using CRUD operations
user1.delete().then(() => {
  console.log(user1);
}).catch((error) => {
  console.log(`Error ${error}!`);
})
```

## Terminal Output:
```
{ _id: 60253b9742f971a07f44bb8e, name: 'Andrew', age: 23, __v: 0 }
```
## Terminal Validation error
```
Error ValidationError: age: Cast to Number failed for value "dfsd" at path "age"!
```