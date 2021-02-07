 // CRUD - Create, Read, Update and Delete

 const mongodb = require('mongodb');
 // MongoClient will give access to the function necessary to connect
 // to the database so we can perform CRUD operations
 const MongoClient = mongodb.MongoClient;

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
  db.collection('users').insertOne({
    name: 'Nidhi',
    age: 37
  }, (error, result) => {
    if (error) {
      return console.log('Unable to insert user');
    }
    console.log(result.ops);
  });
}); 