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
