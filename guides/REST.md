# REST APIs (RESTful APIs)
REST APIs aka Representational State Transfer - Application Programming Interface

## APIs
API is a set of tools that allows you build a software application (very generic / broad defination).
- Node provides us with APIs (tools like FS) enable us to build the application.
- NPM modules provides us with APIs like Express which provides us with set of tools to build the software applications

## REST applications
This REST applications webare creating will allow others teh set of tools  to build out their software.

REST applications allow clients such as a web application to access and manipulate resources using the set of predefined operations.

### What's a resource?
In our applications its a user or a task.

### Whats a predefined operation?
Predefined operation would be an ability to add a new task or mark the existing task as completed or incomplete. For users it could be allowing you to update your user account with pic or other details.

These Predefined operations is going to allow a client like a web app to go through the process of creating a frontend for a task manager.

Representational - Represenattion of the data by using the CRUD (Create, Read, Update or Delete) operations with GET, POST, PUT, DELETE.

State Transfer - When it comes to state transfer a Rest API the server its stateless. The satte has been transferred from server to the client. So each request from the client such as a request for a web application contains everything needed for the server to actually process  that request. this includes the operation they are trying to perform. All of the data that operation actually need in order to work, and it also includes things like authentication, amking sure the user taht are trying to perform the operation and able to do so.

In practice, the request are actually made via http requests so this is how the client like web application can perform those operations. 

#### GET REQUEST / RESPONSE EXAMPLE
```
 ________________                                                            ___________________
|                | ------- GET request /tasks/a7eee (/tasks/:task-id) ----> |                   |
|    need task   |                                                          |    I found it     |
|  data to show  | <------------------ 200 JSON response ------------------ |  in the database  |
|________________|                                                          |___________________|
```


#### POST REQUEST / RESPONSE EXAMPLE
```
 ________________                                                            ___________________
|  I'm Andy and  | ----------- POST JSON request to /tasks JSON  ---------> |      Identity     |
|    I need to   |                                                          |  confirmed and    |
| craete a todo  | <------------------ 201 JSON response ------------------ |   task created    |
|________________|                                                          |___________________|
```

**REST operations are defined by two pieces of data "HTTP Method" and "Request Path".**
```
 _____________________
|                     |
| The Task Resource   |
|_____________________|__________________________
|             |                 |                |
| Actions     | HTTP Methods    |  PATHS         |
|_____________|_________________|________________|
|             |                 |                |
| CREATE      | POST            |   /tasks       | (for ecommerce site it could be /products or /orders etc) 
|_____________|_________________|________________|
|             |                 |                |
| READ        | GET             |   /tasks       |
|             |                 |   /tasks/:id   | (:id = task ID of the individual item we are trying to fetch)
|_____________|_________________|________________|
|             |                 |                | 
| UPDATE      | PATCH           |   /tasks/:id   | (manipulating individual item)
|_____________|_________________|________________|
|             |                 |                | 
| DELETE      | DELETE          |   /tasks/:id   | (deleting individual item)
|_____________|_________________|________________|
```

#### Structure of the HTTP request
The structure of the http request is text based. You can as many header details with your request as you like which is generally built with key:value pair.

**Request**
```
POST /tasks HTTP/1.1 - shows the create action
Accept: application/json - shows we are expecting json data back
Connection: Keep-Alive - shows we are likely to make other request shortly so keep it alive and keep it fast 
Authorization: Bearer djfjksdfsdlkfhdshfkdahfkhfjwsdjfhkjshfance.ksjagfiuagcnM<~cy... - shows authentication
...
{"description": "Order new year 7 books"} - Shows request body as json
```

**Response**
```
HTTP/1.1 201 Created - show the status
Date: Sun, 28 July 2021 15:13:37 GMT
Server: Express
Content-Type: application/json

{"_id": "564d94a909t48734", "description": "Order new year 7 books", "completed": "false"}
```