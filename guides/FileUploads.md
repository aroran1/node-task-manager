# File Uploads
Express by default doesn't support file uploads but we can use a npm library called [Multer](https://www.npmjs.com/package/multer) to help with file upload. Multer is made with multipart/form-data which is primariliy for file uploading.

So far for all our requests we have been passing around JSON data but that will not be the case with file upload instead we will be using form data. We are going to take the file, grab its binary data and send that off to the server.

See the test example created in the `./index.js`.
```
const multer = require('multer'); // require multer
const upload = multer({  // create a new instance of multer
	dest: 'images'
});
// create new route and pass upload.single as a middleware
// multer need to know param name as 'upload' that the file will be attached with
app.post('/upload', upload.single('upload'), (req, res) => { 
	res.send();
})
```
To test this out in postman, make request to `localhost:3000/upload` with body as form-data and passing key as `upload` (set upload dropdown as a file) and value being any file selected. Ones that request is sent, multer is going to match the "/upload" path, save the file in the folder provided with dest and if all went okay will return 200 response. Make sure the dest folder is created before making the request. You can test the uploaded image by manually adding teh file extension for testing it out.

### Options
#### Filesize
Multer allow you to set limits to the file size uploads as below so user can't go over the provided limit which will cost you more to store. The limit can be provided in the bytes so if you want to give a limit of 1 MB, you will be passing 1000000 bytes. 
```
const upload = multer({
	dest: 'avatars',
	limits: {
		fileSize: 1000000
	}
})
```

#### File type or file filter
fileFilter is a method with a req, file (with all the file information) and a cb (instead of then or promise) which can be used as either rejected or resolved.

cb examples:
  - cb(new Error('Please upload a PDF!')) - rejected
  - cb(undefined, true); - resolved
  -cb(undefined, true); - silently fails
```
	fileFilter(req, file, cb) {
		if (!file.originalname.endsWith('.pdf')) {
			return cb(new Error('Please upload a PDF!'))
		}

		cb(undefined, true);
	}
```
file type with multiple matched types. Use [regex 101](https://regex101.com/) for regex.
```
	fileFilter(req, file, cb) {
		// if (!file.originalname.endsWith('.pdf')) { // useful for signle file type
			if (!file.originalname.match(/\.(doc|docx)$/)) { // use regex for multiple file type matches 
			return cb(new Error('Please upload a PDF!'))
		}

		cb(undefined, true);
	}
``` 

### Error handling with mutler
When the call fails from mutler the erroe are not returned as jason objects (instead html like format) which isn't not understood by Express. For Express to understand error and return it in the JSON format, you need somethhing like `(error, req, res, next)`.
```
const errorMiddleware = (req, res, next) => {
	throw new Error('Error my middleware');
}
app.post('/upload', errorMiddleware, (req, res) => { 
	res.send();
}, (error, req, res, next) => { // this patter is requited for express to understand the error
	res.status(400).send({ error: error.message })
});
```
we can apply the same error handling patter to the Mutler now, like below
```
const upload = multer({
	dest: 'avatars',
	limits: {
		fieldSize: 1000000
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error('Pldease upload JPG, JPEG or PNG image only!'));
		}
		cb(undefined, true);
	}
})

router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
	res.send();
}, (error, req, res, next) => { // this patter is requited for express to understand the error
	res.status(400).send({ error: error.message })
});
```

### Authentication
User Authentication will be handled by auth middleware as per other routes as well which will happen before the upload middleware as if the user is not aiuthenticated they shouldn't be allowed to upload a file.
```
router.post('/users/me/avatar', auth, upload.single('avatar'), (req, res) => {
	res.send();
}, (error, req, res, next) => { // this patter is requited for express to understand the error
	res.status(400).send({ error: error.message })
});
```

### File Storage
For actually storing files we will not be relying on `fs` as per the above examples because all the deployment platforms like heroku or AWS require you to take your code and piush it up to the repository on their servers which means `fs` get wiped everytime you deploy and we will loose data when we deploy.

So instead of storing these images as a fs we will add a new field to the user model `avatar` (with type buffer) to store the image's binary data.
```
const userSchema = new mongoose.Schema({
	name: {
  ...
	tokens: [{ // tokens will be an array of object
		token: {
			type: String,
			required: true
		}
	}],
	avatar: {
		type: Buffer
	}
```
Not Multer package gives us option if we want to save the uploaded file as a file or a buffer. If you want to store it as a fs you need to provide `dest: 'avatars', ` option & value when multer is initiated but if you don't provide that option multer will provide you access to the file's binary data as `req.file.buffer` which then can be accessed and save against the avatar filed inside user model. With above in place the file upload route looks like this.
```
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
	req.user.avatar = req.file.buffer;
	await req.user.save();
	res.send();
}, (error, req, res, next) => { // this patter is requited for express to understand the error
	res.status(400).send({ error: error.message })
});

```
P.s. Don't forget to convert this moethod to a async method.

### Rendering binary image on page
Within `avatar` field, we have 2 properties,
`"avatar" : { "$binary": "",  "$type" : "00" }`
To render this on the webpage via html we need to grab the `$binary` and pass it with the `<img src="data:image/jpg;base64, <$binary>`.

```
  <img src="data:image/jpg;base64, /9j/4AAQSkZJRgABAQAASABIAAD/4QCMRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAB4CgAwAEAAAAAQAABDgAAAAA/+0AOFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/AABEIBDgHgAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8">
    
```
### Delete upload file route
```
// Delete uploaded file
router.delete('/users/me/avatar', auth, async(req, res) => {
	req.user.avatar = undefined;
	await req.user.save();
	res.send();
});
``` 

### Get image
```

router.get('/users/:id/avatar', async (req, res) => { // you can pass auth to authenticate
	try {
		const user = await User.findById(req.params.id);

		if (!user || !user.avatar) {
			throw new Error();
		}

		// usually when you send the json response back Express automatically sets it for you
		// but in this case we are sending back an image hence we need to set it manually
		res.set('Content-Type', 'image/jpg')
		res.send(user.avatar);
	} catch (e) {
		res.status(404).send();
	}
});
```
You can access it by this url locally in the browser by `http://localhost:3000/users/605719a39e5fd825e186020f/avatar` (its not using auth middleware) and can uso be used as an image like below:
```
 <img src="http://localhost:3000/users/605719a39e5fd825e186020f/avatar" />
```

**Look into running an anti virus scan on the uploaded file.**