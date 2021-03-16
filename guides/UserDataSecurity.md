# User data security
We need to make sure what user data we are sending back from the server is safe to do so and is also useful to the user. In our existing case so far when user hits /login or /user/me paths we are sending data as below:
```
{
    "user": {
        "age": 20,
        "_id": "603a9867abe913e2e553ee89",
        "name": "Reema Seed",
        "email": "reema@seed.com",
        "password": "$2a$08$w3rzvIpwayyv6H1.A9HUqe8FvKuZie3k0LXuwEqsI0QKoNjMXNCwy",
        "tokens": [
            {
                "_id": "603bc848b971ddf86cceeb1e",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDNhOTg2N2FiZTkxM2UyZTU1M2VlODkiLCJpYXQiOjE2MTQ1MzA2MzJ9.UenvdCKRm41zlNXIfX-wCcVV38zQOZv7ZZudPVLNq20"
            }
        ],
        "__v": 9
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDNhOTg2N2FiZTkxM2UyZTU1M2VlODkiLCJpYXQiOjE2MTQ1MzA2MzJ9.UenvdCKRm41zlNXIfX-wCcVV38zQOZv7ZZudPVLNq20"
}
```
Here you cna see the send the decrypted password and a list of all the active tokens is actually irrelevant to the user and not safe either. 

To avoid any data breaches we will not be sending the details anymore.

There are tow ways to achieve this:
- Custom methods
- .toJSON method

## Custom methods
- on the /login route instead of sending the user object as it is, we will call a custom method called `user.getPublicProfile` (which we will create in the User Model file). This method will alter the user object as per our requirements and will return the user object.
/routers/user.js
```
// No middleware authentication required for this path
router.post('/users/login', async(req, res) => {
	try {
		// creating a custom method findByCredentials
		// this can only be done if you use schema instead of passing the object
		const user = await User.findByCredentials(req.body.email, req.body.password);

		// generate token
		// make sure you are running the generateAuthToken method on the user instance created above with user cont
		// and not on the whole collection as it need to be unique for each user
		const token = await user.generateAuthToken();
		res.send({ user: user.getPublicProfile, token });
	} catch (e) {
		res.status(400).send(e);
	}
});
```
- Now lets create the `getPublicProfile` method of the user schema on the User Model file.
/models/user.js
```
// User Data Security - custom method
// custom method to alter the user object before sending back to user via /login
userSchema.methods.getPublicProfile = function() {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;

	return userObject;
}
```
- Now run the /login route via Postman and you'll get below results. Login data doesn't contain password or tokens array anymore.
```
{
    "user": {
        "age": 20,
        "_id": "603a9867abe913e2e553ee89",
        "name": "Reema Seed",
        "email": "reema@seed.com",
        "__v": 10
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDNhOTg2N2FiZTkxM2UyZTU1M2VlODkiLCJpYXQiOjE2MTQ1NTQ5Nzl9.rwN16o9G9GY7sPY5yQyFENnhPpyfpu12B0tLF-Nncu8"
}
```


## toJSON methods
To use this method change the login method in the router file back to how it was

/routers/user.js
```
router.post('/users/login', async(req, res) => {
	try {
		...
		res.send({ user: user, token });
	} catch (e) {
		...
	}
});
```
Now rename the `getPublicProfile` method created above in the user model file to `.toJSON`
/models/user.js
```
userSchema.methods.toJSON = function() {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;

	return userObject;
}
```
Now run the postman and things should work as previous example.
This toJSON change get applied to all the user data by default and change is reflected everywhere.

**But the question is how toJSON runs without us explicitly calling it?**
// When we call res.send it calls JSON.stringify behind the scene, so when we use `res.send({ user: user, token });` the object is getting stringified. Then we set toJSON method on the user to manipulate the object and re-organise the object to send back only the properties we want to expose.

toJSON test example set on the index file.

