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
    const data = jwt.verify(token, 'ilovepotatoeschipswithcoke');
    console.log(data);
    // terminal output - success
    // { _id: '123dffdj', iat: 1613869291, exp: 1613872891 }

    // terminal output - failed
    // return done(new JsonWebTokenError('invalid signature'));
  }

  myTokenTest()
```

- Creating an account or login both should generate the JWT and send it back to users.
  - not to duplicate the method twice it'll sit outside these routes in the model file and will be used in the relative paths in router
  - create generateAuthToken method in user model file which generates and returns the token
  ```
    // methods are available on the instances of that collection (aka instance methods)
    // need this binding so don't use arrow function
    userSchema.methods.generateAuthToken = async function() {
      const user = this;
      const token = jwt.sign({ _id: user._id.toString() }, 'thisismynodecourse' );
      return token;
    }
  ```
  - return the generated token to client from user router `/user/login` path
  ```
    router.post('/users/login', async(req, res) => {
      try {
        // creating a custom method findByCredentials
        // this can only be done if you use schema instead of passing the object
        const user = await User.findByCredentials(req.body.email, req.body.password);

        // generate token
        // make sure you are running the generateAuthToken method on the user instance created above with user cont
        // and not on the whole collection as it need to be unique for each user
        const token = await user.generateAuthToken();
        res.send({ user, token });
      } catch(e) {
        res.status(400).send(e);
      }
    });
  ```
  - Postman `localhost:3000/user/login` test output
  ```
    {
      "user": {
          "age": 20,
          "_id": "60319c1b7c3fce82ae1a4e4f",
          "name": "Reema Seed",
          "email": "reem@seed.com",
          "password": "$2a$08$jv0NKxuJAUt/gXKGz9GfA./js5N7f6WQZr7k2gHSaESJ.ozdSbJDG",
          "__v": 0
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDMxOWMxYjdjM2ZjZTgyYWUxYTRlNGYiLCJpYXQiOjE2MTM4NzExMjB9.azLAXPFPtJ-o8b5DnokAimBTxvY5w7wpfiYKNsBXrbA"
    }
  ```
  - this generated token need to be tracked in the server code so user can invalidate in and logout without any implications. You can do this by below:
    - update the model with additional tokens array property
    ```
      tokens: [{ // tokens will be an array of object
        token: {
          type: String,
          require: true
        }
      }]
    ```
    - save the generated token to the user model
    ```
      // methods are available on the instances of that collection (aka instance methods)
      // need this binding so don't use arrow function
      userSchema.methods.generateAuthToken = async function() {
        const user = this;
        const token = jwt.sign({ _id: user._id.toString() }, 'thisismynodecourse' );
        user.tokens = user.tokens.concat({ token });
        user.save();
        return token;
      }
    ```
    - Postman output
    ```
      {
        "user": {
            "age": 20,
            "_id": "60319c1b7c3fce82ae1a4e4f",
            "name": "Reema Seed",
            "email": "reem@seed.com",
            "password": "$2a$08$jv0NKxuJAUt/gXKGz9GfA./js5N7f6WQZr7k2gHSaESJ.ozdSbJDG",
            "__v": 0,
            "tokens": [
                {
                    "_id": "6031ba2665ba0e89b0161286",
                    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDMxOWMxYjdjM2ZjZTgyYWUxYTRlNGYiLCJpYXQiOjE2MTM4NzE2NTR9.zx75ZtrPzVrboMcZpAWIwyF2qpXUChRjbX2ZlG-STWE"
                }
            ]
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDMxOWMxYjdjM2ZjZTgyYWUxYTRlNGYiLCJpYXQiOjE2MTM4NzE2NTR9.zx75ZtrPzVrboMcZpAWIwyF2qpXUChRjbX2ZlG-STWE"
      }
    ```
  - add same functionality for craete user path as well

### Middleware to rescue
All the reuests coming to the apis need to handle the authentication / token. Middlewares are useful to handle the authentication or any other steps that need to be taken care of before the router sends response.

There are different types of middlewares. Read More about [Express Middleware](https://expressjs.com/en/guide/using-middleware.html).

```
// simple GET disabling middleware
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.send('GET methods are disabled!');
  } else {
    next();
  }
})

// Maintainance middleware sending 503 for cases like DB update
app.use((req, res, next) => {
  res.status(503).send('Site is under maintainence. Please try again in few hours.');
})
```

 Its best practice to keep the middleware files in their own folders and import them as needed in the require routes files.

 Signing up and logging in shouldn't use auth middleware so it shouldn't be passed as abpve example but should be pass to a particular route as 3 arguments and middle argument being the middleware.
 router.get('/users', **middlewareImportMethod**, async(req, res, next) => {

```
// Create auth.js middleware file
const auth = async (req, res, next) => {
  console.log('Middleware running!');
  next();
};
module.exports = auth;

module.exports = auth;
// Maintainance middleware sending 503 for cases like DB update
// auth is the middleware
router.get('/users', auth, async(req, res) => {
  ...
})

run the path request in postman and notice the console.log // Auth Middleware running!
```
Once you see the middleware function working on the `/users` route, you cna use this method to actually check for the authentication as below.
**/routers/user.js**
- Instead of using /users path, use /users/me to only return single user details
- return user from req.user

**/middleware/auth.js**
- Grab token value (and remove test Bearer)
- Verify the jwt token with the passed secret that was used at the time of creation
- Find the matched user by passing { _id: deccoded._id, 'tokens.token': token } and making sure the token also exit on the array so it can be deleted when user logs out 
```
/routers/user.js
// Read all users with HTTP GET method to '/users' path
// the 2nd Parameter `auth` is the middleware which gets
// triggered after user hits /users path and before the async method
// /users path shouldn't let one user access the data of all the other users
// so its not a valid user case so instead see /users/me
router.get('/users', auth, async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users)
	} catch (e) {
		res.status(500).send(e);
	}
});

// the above /users will never be used by users so instaed can use /user/me path below
// the finding user functionality is already been taken care of by the auth middleware and 
// returned as req.user so not required in this route anymore instead res returns user from re.user
router.get('/users/me', auth, async (req, res) => {
	res.send(req.user)
})

/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
	// console.log('Auth Middleware running!');
	// next();

	try {
		const token = req.header('Authorization').replace('Bearer ', '');
		// console.log(token);
		const deccoded = jwt.verify(token, 'thisismynodecourse');

		// using findOne instead of findById is because we want to finds the user with Id but also
		// want to make the token exist in the tokens array so when user logs out
		// we can delete this token from the array we achieve this by searching for
		// 'tokens.token' with the parsed token value
		const user = await User.findOne({ _id: deccoded._id, 'tokens.token': token });

		if (!user) {
			throw new Error('User Not found!');
		}

		req.user = user;

		next();
	} catch (e) {
		res.status(401).send({ error: 'Please authenticate!' });
	}
};

module.exports = auth;
```

## User Logout

### Logout from particular sessions by removing 1 token
To create user logout we will need to find out the token user is logged in with and remove it from the tokens array.

- we will start with garbbing the token value on the auth middleware and tagging it to the req object and we are doing with the user. This will make the token accessible on the /logout path.
```
// /middleware/auth.js
const auth = async (req, res, next) => {
	try {
		...
		if (!user) {
			throw new Error('User Not found!');
		}

		req.token = token;
		req.user = user;
    ...
};
```
- then we create the /logout path in the router, access this token from the req object and filter it out
```
router.post('/users/logout', auth, async(req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter( token => {
			return token.token != req.token
		})

		await user.save();
		res.send();
	} catch (e) {
		res.status(500).send();
	}
});
```
- set `500` status if there is an error
- Run logout in postman and try running user profile after that should see below.
```
{
    "error": "Please authenticate!"
}
```

### Logout from all sessions by clearing all active tokens
When user logs in, each time we add the newly created JWT token to the user.tokens array which in essence is a login session. A user can have multiple sessions (sub-accounts for example Netflix or Disney channels to share with people).
By adding logout from all accounts (or sessions) we will be clearing all the tokens set for that particular user.tokens array which will log them out from all the accounts / sessions at once until they login again.

This can be achieved by below:
```
// /routers/user.js
// logoutAll - to logout from all sessions
router.post('/users/logoutAll', auth, async(req, res) => {
	try {
		req.user.tokens = []; // removing all active tokens
		await req.user.save();
		res.send();
	} catch (e) {
		res.status(500).send(e);
	}
})

```

- [User Data Security](UserDataSecurity.md)