const express =  require('express');
 // requiring mongoose file ensures the mongoose runs and our project connects to db
require('./db/mongoose');
 
// gets the models
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

// makes the parsed json accessible as an object
app.use(express.json());

// Create a new user with HTTP POST method to '/users' path
app.post('/users', (req, res) => {
  const user = new User(req.body);

  user.save().then(() => {
    res.send(user);
  }).catch((err) => {
    console.log(`Error ${error}!`);
  });
}); 

app.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});