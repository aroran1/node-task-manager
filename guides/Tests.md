# Tests

You can use any framework to automate your testing like Jest or Mocha. We are using Jest in this project.

Jest is a no configuration required framework. Nelow steps for setup:

- Just install in the project by `npm i jest@latest`
- set up command in package.json as `"test": "jest"`
- create `tests` folder at project root 
- run `npm run test` in your project's terminal.

You can see its already running and not finding any tests to run
```
nidhiarora@Nidhis-MacBook-Pro node-task-manager % npm run test

> task-manager@1.0.0 test
> jest

No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
In /Users/nidhiarora/Development/node/node-task-manager
  14 files checked.
  testMatch: **/__tests__/**/*.[jt]s?(x), **/?(*.)+(spec|test).[tj]s?(x) - 0 matches
  testPathIgnorePatterns: /node_modules/ - 14 matches
  testRegex:  - 0 matches
Pattern:  - 0 matches
``` 

Create a dymmy file as `tests/math.test.js` and re-run the tests which will give you different error
```
 FAIL  tests/math.test.js
  ● Test suite failed to run

    Your test suite must contain at least one test.
```

Adding dummy test
```
tests/math.test.js
test('Hello World!', () => {})

TERMINAL OUTPUT
> task-manager@1.0.0 test
> jest

 PASS  tests/math.test.js
  ✓ Hello World! (1 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.052 s
Ran all test suites.
``` 

Making Test fail
```
Adding a new test to tests/math.test.js
test('This should fail', () => {
  throw new Error('Failure!');
})

TERMINAL OUTPUT
nidhiarora@Nidhis-MacBook-Pro node-task-manager % npm run test

> task-manager@1.0.0 test
> jest

 FAIL  tests/math.test.js
  ✓ Hello World! (1 ms)
  ✕ This should fail (1 ms)

  ● This should fail

    Failure!

      4 |
      5 | test('This should fail', () => {
    > 6 |   throw new Error('Failure!');
        |         ^
      7 | })

      at Object.<anonymous> (tests/math.test.js:6:9)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
Snapshots:   0 total
Time:        1.028 s
```

Tests Benefits:
- Saves time in long run
- Creates reliable software and more confidence in code
- Gives flexibility to developers
  - Helps with refactoring code
  - Collabrating with new people when they join the project while they build up understanding
  - Profiling - as you build up on test cases the developent can become faster overtime 
- Peace of mind

Add `"test": "jest --watch"` to run the tests as developing (press a)
```
› Press a to run all tests.
 › Press f to run only failed tests.
 › Press p to filter by a filename regex pattern.
 › Press t to filter by a test name regex pattern.
 › Press q to quit watch mode.
 › Press Enter to trigger a test run.
```

## Async tests
To test a normal function we just assert by using expect and toBe but when we are working with async functions we need to make sure the test waits enough time to test the outcome. Here are different approaches to do that with setTimeout with done, or .then and async/await.

```
// Async test
// test('Async demo test', () => {
//   expect(1).toBe(2); // test fails correctly
// })

// test not waiting 2 seconds
// test('Async demo test', () => {
//   setTimeout(() => {
//     expect(1).toBe(2);
//   }, 2000)
// })

// Aproach 1 with done
test('Async demo test', (done) => {
  setTimeout(() => {
    expect(1).toBe(1); //expect(1).toBe(2);
    done();
  }, 2000)
})

// Aproach 1 with promise / then
test('should add two numbers', (done) => {
  add(2, 3).then((sum) => {
    expect(sum).toBe(5);
    done(); 
  });
})

// Aproach 2 with asunc / await
test('should add two numbers async/await', async () => {
  const sum = await add(20, 23);
  expect(sum).toBe(43);
})
```

## Jest setup
Setting up tests to use differe mongoDB by using test.env file.
Also setting jest object and testEnvironment as `node` by default its set as `jsdom`.
```
  "scripts": {
    "start": "node src/index.js",
    "dev": "env-cmd -f ./config/dev.env nodemon src/index.js",
    "test": "env-cmd -f ./config/test.env jest --watch"
  },
  "jest": {
    "testEnvironment": "node",
    "testTimeout": 30000
  },
```

## Supertests
We are using [Spuertests](https://www.npmjs.com/package/supertest) to test the express application. Install it with `npm install supertest --save-dev`. Supertests doesn't ~need your db. It also doesn't~ need your express application to run to tests the routes, its just need the express application to set it up.

To setup supertests we need to import the express app inside the test file but we don't want to listen to any server so we do a little code refactoring with `src/app.js` and `src/index.js` which enables us to import app.js to our test file.

tests/user.test.js
```
const { TestScheduler } = require('jest');
const request = require('supertest');
const app = require('../src/app');

test('Should signup a new user', async () => {
  await request(app).post('/users').send({
    age: 27,
    name: 'Andrew Mead',
    email: 'andymead@udemy.com',
    password: 'AndrewMead'
  }).expect(201);
})
```
To make the above test case pass make sure your MongoDB Local instance is running and connect the compass to it. and once the test has run you can see a new collection as `task-manager-api-test` has also been created. You also need to make sure each time the runs, it clears the db as well otherwise the test cases will interrup diffetrent scenarios.

Making sure tests are more meaningful you can test assertions like
```
  // Assert that the database was changed correctly 
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertions about the response
  // expect(response.body.user.name).toBe('Andrew Mead');
  // OR
  expect(response.body).toMatchObject({
    user: {
      age: 27,
      name: 'Andrew Mead',
      email: 'andymead@udemy.com',
    },
    token: user.tokens[0].token
  })
  expect(user.password).not.toBe('AndrewMead');
```

## Emails
Testing emails etc may not get tested as expected but that's okay but we need to make sure out tests don't run us out of emails budgets from sendgrid. To prevent that, create `__mocks__` folder in tests folder and create the same folder/file structure which is used for sendgrid within mocks `__mocks__/@sendgrid/mail`. Now in main.js add the mock  `setApiKey` and `send` methods and export them to make them accessible.

### List od additional test cases
```
//
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated

//
// Task Test Ideas
//
// Should not create task with invalid description/completed
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks
```