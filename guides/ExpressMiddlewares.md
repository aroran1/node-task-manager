# Express Middlewares
This is the step that sits between the request coming in and running the route handler.

### Without Middleware
```
New Request >>>>>>>>>>> Run Route Handler
```

### With Middleware
```
New Request >>>>>>>>>>> Do Something >>>>>>>>>>> Run Route Handler
```
This is useful to handle the authentication or any other steps that need to be taken care of before the router sends response.

### Simple example of disabling GET requests
In this middleware `app.use` accepts a function with `(req, res, next)`. req and res allow us to have information about the requests coming through and response going back but `next()` allows the router to run if condition is met.
```
  // simple GET disabling middleware
  app.use((req, res, next) => {
    if (req.method === 'GET') {
      res.send('GET methods are disabled!');
    } else {
      next();
    }
  })

  POSTMAN get response: GET methods are disabled!
```

There are different types of middlewares. Read More about [Express Middleware](https://expressjs.com/en/guide/using-middleware.html).