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