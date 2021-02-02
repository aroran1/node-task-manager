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
You will see some logs running and some port number where mondo is running.

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

