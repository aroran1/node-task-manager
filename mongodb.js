// CRUD - Create, Read, Update and Delete

const mongodb = require('mongodb');
// MongoClient will give access to the function necessary to connect
// to the database so we can perform CRUD operations
//  const MongoClient = mongodb.MongoClient;
//  const ObjectID = mongodb.ObjectID;

// Using ES6 destructuring instead of individual value
const {  MongoClient, ObjectID } = mongodb;

// mongo data object ID aka guid (globally unique identifier) which are 12 byte data
// mixed with time stamp and other info
// const id = new ObjectID;
// console.log(id);
// console.log(id.getTimestamp());
// console.log(id.id); // return 12 byte buffer value and shows in the documents as ObjectId("60202babf9d03d128f222d9a")
// console.log(id.id.length);
// console.log(id.toHexString.length);

const connectionUrl = 'mongodb://127.0.0.1:27017'; // use IP instead of localhost as it slows down the application
const DATABASE_NAME = 'task-manager';

// useNewUrlParser required to connect correctly useNewUrlParser
mongodb.connect(connectionUrl, { useNewUrlParser: true }, (error, client) => {
  if(error) {
    return console.log('Unable to connect to databse!');
  }

  // takes 1 argument of you db name
  const db = client.db(DATABASE_NAME)

  // Run this and test it out in robo 3T to check the uopdate
  // api methods for collection - http://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html

  // insters a single document
  // db.collection('users').insertOne(
  //   { name: 'Nidhi', age: 37},
  // (error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert user');
  //   }
  //   console.log(result.ops);
  // });

  // insters many documents to users
  // db.collection('users').insertMany([
  //   { name: "Kia", age: 20 },
  //   { name: "Jen", age: 27 }
  // ], (error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert users');
  //   }
  //   console.log(result.ops);
  // });

  // creating a new tasks collection
  // db.collection('tasks').insertMany([
  //     { description: "Go shopping", completed: false},
  //     { description: "Feed kids", completed: false},
  //     { description: "Cook dinner", completed: false}
  //   ], (error, result) => {
  //     if(error) {
  //       return console.log('Unable to insert tasks!');
  //     }
  //     console.log(result.ops);
  // });

  // Find document
  db.collection('users').findOne({name: 'Jen'}, (error, user) => {
    if(error) {
      return console.log('Unable to fetch!');
    }
    console.log(user);
  });
}); 
