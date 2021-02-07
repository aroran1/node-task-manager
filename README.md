# node-task-manager

## MongoDB
MongoDB is a free no-sql (not only structure query language) database.

### Mongo Structure
```
[
  {
    "id": "01",
    "name": "Andy", // Field (same as sql Column)
  } // Document (same as sql Row)
] // Collection (same as sql Table)
```

### Mongo set-up

Download MongoDB server from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) and select
  - Latest version
  - macOS
  - tgz

Once downloaded and unzipped, change the folder name to `monogodb` and move it to a permanent location, ie, under user. Also make sure in bin folder it has `mongod` executable. Now create another folder as the same level as `mongodb` folder as `mongodb-data` to store data. (By default mongo expects you to create a folder at your hard drive and a db folder inside it which may not be suitable for permissions issues).

To get to your user run `cd ~` in your terminal and run `pwd`. once in the folder set your db path with mongod exceutables with `/Users/nidhiarora/mongodb/bin/mongod --dbpath=/Users/nidhiarora/mongodb-data`.
```
nidhiarora@Nidhis-MacBook-Pro node-task-manager % cd ~
nidhiarora@Nidhis-MacBook-Pro ~ % pwd
/Users/nidhiarora
nidhiarora@Nidhis-MacBook-Pro ~ % /Users/nidhiarora/mongodb/bin/mongod --dbpath=/Users/nidhiarora/mongodb-data
```
You will see some logs running and some port number where mondo is running. Keep this running in a terminal to make sure you are connected with db.

### Install Robo 3T - mongodb GUI
download it from here [https://robomongo.org/download](https://robomongo.org/download) and install it in your applications.

- select create to create a new connection with local mongodb
  - Type: Direct
  - Name: Local MongoDB Database
  - Address: localhost
  - Port: 27017 (default mongo port)
- Hit `test button` if all good then
- Hit `Save`
- Hit connect to this database (if no errors listed then all good!)
- Right click pon the database and select `open new shell`
- type `db.version` and press green play button

### MongoDB Drivers
These are the ways to interact with MongoDB. [https://docs.mongodb.com/drivers/](https://docs.mongodb.com/drivers/). Select Node.

- [API reference](http://mongodb.github.io/node-mongodb-native/3.6/api/)
  - Connect methods - http://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html
  - Collection methods - http://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html
- Install [npm mongodb](https://www.npmjs.com/package/mongodb) official driver package


### Connecting to MongoDB with node
- run MongoDB in one terminal or start with `/Users/nidhiarora/mongodb/bin/mongod --dbpath=/Users/nidhiarora/mongodb-data`
- create `mongodb.js`
- install `mongodb` npm package
- the add below to mongodb.js
```
const mongodb = require('mongodb');
// MongoClient will give access to the function necessary to connect to the database so we can perform
 CRUD operations
const MongoClient = mongodb.MongoClient;
const connectionUrl = 'mongodb://127.0.0.1:27017'; // use IP instead of localhost as it slows down the application


// useNewUrlParser required to connect correctly useNewUrlParser
// api methods for collection - http://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html
mongodb.connect(connectionUrl, { useNewUrlParser: true }, (error, client) => {
  if(error) {
    return console.log('Unable to connect to databse!');
  }
  const db = client.db(DATABASE_NAME);
  ...
}
```
- run `node mongodb.js`

#### Mongo Commands
- Create a new DB with `const db = client.db(DATABASE_NAME)`
- Create a collection with `db.collection('users')`
- Insert a document `insertOne` or `insterMany`
- Return an callback with insertion action by passing a second argument as `((error, result) => {})`
```
// api methods for collection - http://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html
db.collection('users').insertOne({
    name: 'Nidhi',
    age: 37
  }, (error, result) => {
  if (error) {
    return console.log('Unable to insert user');
  }
  console.log(result.ops); //
});
```
