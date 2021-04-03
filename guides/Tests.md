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