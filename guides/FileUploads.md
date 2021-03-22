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