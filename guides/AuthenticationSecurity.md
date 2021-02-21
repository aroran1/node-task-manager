# Authentication and Security

## Password storing
- Its generally good idea to NOT save users password in the database as string. This will make their account vulnerable if the database is hacked.
- Also bearing in mind people usually keep simple and memorable passwords like dob etc and the same password are used for multiple accounts which makes it even more crucial that as software engineer we make sure their password are encrypted. 
- to achieve this we are using `bcryptjs` created for this purpose to hash crypting the passwords. [npm bcryptjs](https://www.npmjs.com/package/bcryptjs)
**Local testing example**

```
// /src/index/js
const bcrypt = require('bcryptjs');
const cryptoPassword = async () => {
  const password = 'Red123!';
  const cryptedPassword = await bcrypt.hash(password, 8);
  
  console.log('cryptedPassword', password + ' = ' + cryptedPassword);

  // Hash crypting can't be decoded by design so to compare the password on user login so 
  // its suggested to encrypt the entered password and then match as below

  const isMatch1 = await bcrypt.compare('Red123!', cryptedPassword);
  console.log('isMatch1', isMatch1); // returns as true
  
  // shows even the cap change fails teh match
  const isMatch2 = await bcrypt.compare('red123!', cryptedPassword);
  console.log('isMatch2', isMatch2); // returns as false
}

cryptoPassword();
```

### Password crypting in action
- To apply the password crypting we need to make sure this action happens just before user is save and to help us with this we can take advantage of Mongoose Middleware and it will happen at the model leve
  - examples of [Mongoose Middleware](https://mongoosejs.com/docs/4.x/docs/middleware.html)
  - examples of [Express Middleware](https://expressjs.com/en/guide/writing-middleware.html#:~:text=Middleware%20functions%20are%20functions%20that,middleware%20succeeding%20the%20current%20middleware.)
- Mongoose middleware are only accessible via schemas. SO instead of pass the data model (as second property) directly into the mongoose.model, this need to be stored as schema first and that schema need to be passed.
```
// exitsing code /src/models/user
const User =  mongoose.model('User', {
  name: {
    type: String,
    required: true,
    ...
  ...
}

// need to be changed as below
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    ...
  ...
}

// create a user collection model as schema in the db
const User =  mongoose.model('User', userSchema);
```
- This userSchema allow us to take advantage of the mongoose middleware. There are 2 methods available as `pre` (before the event) or `post` (after the event) which accepts 2 arguments, event name ie, save and an async function (not an arrow function as it doens't bind this).
```
userSchema.pre('save, async function(next) {
  const user = this;
  console.log('Just before saving!');
  next();
})
<em>Note: next need to be called at the end of the middleware method to let mongoose know that the function has run. It you don't run next it'll hang forever and the event will never take place.</em>
```
- run it locally and create a new user in postman and notice the message `Just before saving!` only works for save via create but not for update as `findByIdAndUpdate` method bypass the middleware so we need to breakdown findByIdAndUpdate into multipule steps with save. 
```
// replacing findByIdAndUpdate
const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

// with 3 step - find, update and save manually to trigger the middleware pre save event
const user = User.findById(req.params.id);
updates.forEach( update => user[update] = req.body[update]);
await (await user).save();
```

## User Login
- creating a new route to '/user/login'
  - finding the right user by creating a custom method findByCredentials in the user model file
  ```
    // /router/user.js
    router.post('/users/login', async(req, res) => {
      try {
        // creating a custom method findByCredentials
        // this can only be done if you use schema instead of passing the object
        const user = await User.findByCredentials(req.body.email, req.body.password);
        res.send(user);
      } catch(e) {
        res.status(400).send(e);
      }
    });
  ```
  - this can only be done if you use schema instead of passing the object directly in the model
  ```
    // /models/user.js
    // custom method to find user by credentials for login
    userSchema.statics.findByCredentials = async (email, password) => {
      const user = await User.findOne({ email });

      if(!user) {
        throw new Error('Unable to login');
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch) {
        throw new Error('Unable to login');
      }

      return user;
    }
  ```
  - for login error handling you must keep it simple and consistent to 1 error like `Unable to login` to avoid any hacker trying to login and giving them help unconsciously.
  - While logging in or even craeting a user account you need to make sure that its a unique credentials and not duplicated. To achieve this you can pass a mongoose model helper `unique: true,` to email as to make sure each email is unique.
    - this only works if set-up at the beginning of the craetion of the database and will NOT work if its set afterwards. So in this case we need to flush the db and start again.
    ```
      email: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(val) {
          if (!validator.isEmail(val)) {
            throw new Error('Email is invalid!');
          }
        }
      },

      // duplicate key error via postman
      {
        "driver": true,
        "name": "MongoError",
        "index": 0,
        "code": 11000,
        "keyPattern": {
            "email": 1
        },
        "keyValue": {
            "email": "reem@seed.com"
        }
      }
    ```
  - Once set drop the db and add a new user from postman and test out `/user/login` route with post.

## Evaluate the app between Public routes and Authenticated route
- At this point you need to Evaluate your application between Public routes (available to all users) and Authenticated routes (only available once user logs in)
 ____________________________________________________________________________
|                         |                                                  |
|  Public Paths           |  Authenticated Paths                             |
|_________________________|__________________________________________________|
|  Sign up / Create User  |  Create Task (Specific authenticated user only)  |
|  Login                  |  Read Task   (Specific authenticated user only)  |
|                         |  Update Task (Specific authenticated user only)  |
|                         |  Delete Task (Specific authenticated user only)  |
|                         |  Read Users  (Admin)                             |
|                         |  Update User (Specific authenticated user only)  |
|                         |  Delete User (Admin)                             |
|_________________________|__________________________________________________|


To achieve above we need to send back an authentication token. This is something an authenticator will be able use later on with other requests where they need to be authenticated. 
Here we will using **[JWT (JSON Web Tokens)](https://www.npmjs.com/package/jsonwebtoken)** which can be used for various things as well as authentications.
- JWT can have time attach to it to expire after a while which will log users out automatically
- or you can allow it to be not expired forever (based on user case)
- we will be using [npm jsonwebtoken package](https://www.npmjs.com/package/jsonwebtoken) which allows our node application to work with JWT and checking for its expiry

### JWT
- JWT tokens are created of 3 parts seperated by `.`
  - 1st part (aka header) base 64 json string - contains meta info + algo
  - 2nd part - base 64 json string - contains body data passed. You can use [https://www.base64decode.org/](https://www.base64decode.org/) to decode to test
  - 3rd part - base 64 json string - timestamp info to verify the token
- generate a token by using jwt.sign method example below with 3 params
- verify a token by using jwt.sign method example below with 3 params
**Local testing example**
```
  // /src/index/js
  // JWT local testing
  const jwt = require('jsonwebtoken');

  const myTokenTest = async() => {

    // sign method accept 3 arguments
    // 1. some data info can be mongo document id
    // 2. unquie serier of string or secret message
    // 3. expriy info in string
    const token = jwt.sign({ _id: '123dffdj'}, 'ilovepotatoeschipswithcoke', { expiresIn: '1 hour'});
    console.log(token);
    // terminal output
    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMjNkZmZkaiIsImlhdCI6MTYxMzg2OTE2MywiZXhwIjoxNjEzODcyNzYzfQ.sI3cM6YmPNue8mLOuheadNr3UikcFvCFcTCkbKWRVeM

    // verify method accepts 2 params, generated token with the secret message
    const data = jwt.verify(token, 'ilovepotatoeschipswithcokedd');
    console.log(data);
    // terminal output - success
    // { _id: '123dffdj', iat: 1613869291, exp: 1613872891 }

    // terminal output - failed
    // return done(new JsonWebTokenError('invalid signature'));
  }

  myTokenTest()
```

