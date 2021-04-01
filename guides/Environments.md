# Environments

Environments are useful to main the security and the customization of the application. 

For example inside `src/db/mongoose.js` file we are passing a static string which connects our application to the database which works fine for the local application but for the production environment we will not be using localhost we will be accessing proper database hosted servers. So without environment variables set-up we will not be able to access separate dbs / keys (sendgridkey) based on dev, test, pre-prod or prod environments.

Also, note, once you have added a keys to the git it keeps it in the file history so its always a best practices to not publish such sensitive code. .env files are usually added to git igmore files.

- create `config` folder
- create `dev.env` file to run locally
  - set the information as `Key=Value` format without any spaces, for example setting port as `PORT=3000`
  - to use these variables in teh code just pass `process.env.<key>`, so for port it would read as `process.env.PORT`
  - its common industry practices to use all caps and separate the words with underscore for the key naming conventions
- create `prod.env` file for the production environment

Setting up environments can be painful as they need to work on different OS so its easier to use an npm package for the job. Here are 2 popular one, we will be using the first one in this project. Install them as --save-dev
- [env-cmd](https://www.npmjs.com/package/env-cmd)
- [dotenv](https://www.npmjs.com/package/dotenv)

Once the package is installed add the below to the `dev` command in your package.json and restart with differet port passed from the env file. 
```
"dev": "env-cmd -f ./config/dev.env nodemon src/index.js",
```

Please note, env file only runs once at the beginning of the project run so any changes to teh variables in this file will require you to re-run the application. Alse, make sure to move, MongoDb url, Jwt secret and email api key to the env file.

Sample env file
```
PORT=3000
MONGODB_URL=mongodb://localhost:XXXX/task-manager-api
JWT_SECRET=XXXXX
SENDGRID_API_KEY=XXX
```
