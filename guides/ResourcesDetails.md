# Resources Details

## Creating Resources
The folder structure in the src folder is tidy-up as per production build, statring from `/src/index.js` as express file.

- **EXPRESS**
  - /src/index.js - express setting up port for local and heroku
  - setting up start command in package.json as 
  ```
    "start": "node src/index.js", // for heroku to start the application
    "dev": "nodemon src/index.js", // for local environment only to start the application
  ```
  - Create http methods to create a user as below
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
