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

- `Insert`
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
- `Object ID`
  - in a sql db, the id increases incrementally starting from 0, 1, 2 but in non sql they are globally unique ids aka GUIDs. They are 12 byte data craeted as below
    - a 4-byte timestamp value, showing the ObjectId’s creation measured in seconds since the Unix epoch
    - 5-byte random value
    - 3-byte incrementing counter
  - They are useful to fetch a documents with id
  - To create a specific id `const id = new ObjectID;` and then in object set it as `_id = id`

- `Find`
- To find a single document in the database you can use `findOne` command
```
db.collection('users').findOne({name: 'Jen'}, (error, user) => {
  if(error) {
    return console.log('Unable to fetch!');
  }
  console.log(user);
});
```
- Find method finds all the matched documents and points you to the cursor which allows you to use different opetaions on the data - checkout find method in the api
```
  // returns array of documents
  db.collection('users').find({ age: 27 }).toArray((error, users) => {
    if(error) {
      return console.log('Unable to fetch!');
    }
    console.log(users);
  });

  // returns count of all the fount documents
  db.collection('users').find({ age: 27 }).count((error, count) => {
    console.log(count);
  })
```
-  `Update with promise instead of CB`
- UpdateOne allows you to update 1 documents with the matched property
- you can use `$set: { name: 'Meera' }` to update a value
- Or you can use simething like `$inc: { age: 1 }` to increase that vakue by 1
```
  // Update with promise instead of callbacks
  db.collection('users').updateOne({
    _id: new ObjectID("6019dd788a4095cd3c31926c")
  }, {
    $set: {
      age: 21
    }
  }).then((result) => {
    console.log(result);
  }).catch((error) => {
    console.log(error);
  });
```

- deleteing properties from the database by `deleteMany` or `deleteOne`
```
  db.collection('user').deleteMany({
    age: 20
  }).then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log(err);
  });


  db.collection('tasks').deleteOne({
    _id: new ObjectID('602032bd1154ba13b7d2a94d')
  }).then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log(err);
  });
```