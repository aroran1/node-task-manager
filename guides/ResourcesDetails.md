# Resources Details

## Creating Resources
The folder structure in the src folder is tidy-up as per production build, statring from `/src/index.js` as express file.

### EXPRESS - accessing data from postman
  - `/src/index.js` - express setting up port for local and heroku
  - setting up start command in package.json as 
  ```
    "start": "node src/index.js", // for heroku to start the application
    "dev": "nodemon src/index.js", // for local environment only to start the application
  ```
  - **Create http methods** to create a user as below
    ```
      app.post('/users', (req, res) => {
        res.send('testing response!');
      }); 
      set up postman POST request to 'localhost:3000/users' and test out to see 'testing response!' response
    ```
    - Now change the postman request with data as body and change text to JSON
    ```
    {
      "name": "Tina Mead",
      "email": "tintin@mead.com",
      "passowrd": "tinmean123!"
    }
    it still returns the response as per apps response 'testing response!'
    ``` 
    - Accepting that postman data to create a new data is a 2 step process.
      - First step is to configure express to automatically parse the incoming json for us so we can have it accessible as an object ready to be use. We can do this by `app.use(express.json())` and testing the postman call in terminal as below:
      ```
      app.use(express.json());

      app.post('/users', (req, res) => {
        console(req.body);
        res.send('testing response!');
      });
      ```
      the data is now accessible via express api path request body and we now need to connect that with mongoose method to post this to the database.


### Models set-up
  - Create a new folder `/src/models`
  - Create user and task model files and plug their relevant data model in the files . these models should sit in their own folders.
  ```
    const mongoose = require('mongoose');
    const validator = require('validator');

    // create a task collection model in the db
    const Task = mongoose.model('Task', {
      description: {
        type: String,
        require: true,
        trim: true
      },
      completed: {
        type: Boolean,
        default: false
      }
    });

    module.exports = Task;
  ```
  - add `module.exports = User` and import the models in the `/src/index.js` and same for tasks


### Mongoose clean-up
  - clean up `/src/db/mongoose.js` file from any model, local data or save methods as this file should only be responsible for connecting with db.
  - Also remove any unnecessary requires from theis file.
  ```
    const mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost:27017/task-manager-api', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  ```

### Express - posting request to db
  - Create a new user with the parsed Json object with `const user = new User(req.body);`
  - Then use `.save()` method to save the data in the db
  - Attach `.then()` method to return data object and `.catch()` method to log error, handling the http promise requests appropriately.
  ```
  // Create a new user with HTTP POST method to '/users' path
  app.post('/users', (req, res) => {
    const user = new User(req.body);

    user.save().then(() => {
      res.send(user);
    }).catch((err) => {
      console.log(`Error ${error}!`);
    });
  }); 
  ```
  - Run the above postman call with validated body data as json to `localhost:3000/users` and you will get below response whih verifies its working
  ```
    {
      "age": 0,
      "_id": "6029b9518d32a2d89b1fab94",
      "name": "Tina Mead",
      "email": "tintin@mead.com",
      "__v": 0
    }
  ```
  - Also verify your work with 3T Robo db GUI

### Express - error handling
  - to log if there is an error if the parse data is invalid for example invalid password length
  - the mongoose validating will kick in and we need to return the error back as our response with correct stats. See full list of [http response statuses](https://httpstatuses.com/).
  ```
  app.post('/users', (req, res) => {
    const user = new User(req.body);

    user.save().then(() => {
      res.send(user);
    }).catch((e) => {
      <!-- res.status(400); -->
      res.send(e);
    });
  }); 
  ```
  - test it in postman to see the status code updating


### Express - status update
  - based on mongoose CURD operations response we need to update the response status with the response amd error handling. 
  - If you don't manually set the status Express assumes everything went well and returns 200.
    - Even when thing go well its best practices to set the most appropriate status code for example created should be set as 201 instaed of just 200
    - See full list of [http response statuses](https://httpstatuses.com/).
  - create the `res.status(201)` before `res.send(user)` or chain both methods as `res.status(201).send(user)`
  - set the `res.status(400)` before `res.send(err)` or chain both methods as `res.status(400).send(e)`
  ```
  app.post('/users', (req, res) => {
    const user = new User(req.body);

    user.save().then(() => {
      res.status(201).send(user)
    }).catch((e) => {
      res.status(400).send(e)
    });
  }); 
  ```
  - test it in postman to see the status code updating


### Express - setup tasks post methods to '/tasks' and test it via postman
```
// Create a new task with HTTP POST method to '/tasks' path
app.post('/tasks', (req, res) => {
  const task = new Task(req.body);

  task.save().then(() => {
    res.send(task);
  }).catch(e => {
    res.status(400).send(e);
  })
});

POSTMAN OUTPUT: {"completed":false,"_id":"6029c524347259db4895aee7","description":"Finish Node course","__v":0}
```