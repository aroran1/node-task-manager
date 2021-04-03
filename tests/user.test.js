const request = require('supertest');

// moved to fixtures/db.js
// const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

// beforeEach(async () => {
//   // console.log('beforeEach')
//   // moved to fixtures/db.js
//   // await User.deleteMany(); // emptying db 
//   // await new User(userOne).save();
// });

beforeEach(setupDatabase);

// moved to fixtures/db.js
// const userOneId = new mongoose.Types.ObjectId();
// const userOne = {
//   _id: userOneId,
//   name: 'Louis Briggs',
//   email: 'louisbriggs@heathwallace.com',
//   password: 'louisbriggs123!',
//   tokens: [{
//     token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
//   }]
// }

// could also be done as done instead of async
// beforeEach((done) => {
//   await User.deleteMany();
//   done();
// });

// afterEach(() => {
//   console.log('afterEach')
// });

test('Should signup a new user', async () => {
  const response = await request(app).post('/users').send({
    age: 27,
    name: 'Andrew Mead',
    email: 'andymead@udemy.com',
    password: 'AndrewMead'
  }).expect(201);

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
})

test('Should login existing user', async () => {
  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200);
  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
})

test('Should not login with incorrect login details', async () => {
  await request(app).post('/users/login').send({
    email: userOne.email,
    password: 'dfsdmnsd'
  }).expect(400);
})

test('Should get user profile for authenticated user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
})

test('Should not get user profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401);
})

test('Should detete users profile for authenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user).toBeNull();
})


test('Should not detete users profile for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401);
})

test('should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
})

test('should update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Jess'
    })
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.name).toEqual('Jess');
})

test('should not update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: 'Delhi'
    })
    .expect(400);
})
