# Production MongoDB Setup
For productaion environments first thing we would need is to make sure we have a cloud based database.

We will be exploring [MongoDb Atlas](https://www.mongodb.com/cloud/atlas) for that.

- Create a **free** tier account
- Create a Project
- Create a cluster
  - a cluster is nothing but just a mongo DB database with multiple servers which can allow you to have nice low latency around the globe
  - choose cloud provider
  - choose closest region
- choose free tier storage

Once cluster is created:
- click connect
  - Add a connection IP address
    - Add different IP address > `0.0.0.0/0` - white list all IP address to allow connection
    - authentication will be handled vis username and password
  - Create a Database User
    - add username: TaskManangerApp & Password: password
    - gives a connect string `mongodb+srv://TaskManagerApp:<password>@cluster0.ndsrj.mongodb.net/test`
- Choose a connection Method
  - Connect using MongoDB Compass setup (same as robo3T GUI tool)
    - Download and install
    - Add local connect
      - Add new Connection make sure its picking up 27017 host
    - Add Mongo DB cloud access
      - pass `cluster0.ndsrj.mongodb.net` as host name (part of the connection string)
      - svr on
      - Auth - username / Password
      - user the username / Password set above. If forgotter password can be reset > security > App Name > Edit > Password > show