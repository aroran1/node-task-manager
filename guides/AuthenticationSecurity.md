# Authentication and Security

## Password storing
- Its generally good idea to NOT save users password in the database as string. This will make their account vulnerable if the database is hacked.
- Also bearing in mind people usually keep simple and memorable passwords like dob etc and the same password are used for multiple accounts which makes it even more crucial that as software engineer we make sure their password are encrypted. 
- to achieve this we are using `bcryptjs` created for this purpose to hash crypting the passwords. [npm bcryptjs](https://www.npmjs.com/package/bcryptjs)

```
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

