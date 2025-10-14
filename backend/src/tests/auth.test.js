// const request = require('supertest');
// const { app } = require('../app');
// const { sequelize } = require('../models');
// //const User = require('../models');
// before(async () => {
// await sequelize.sync({ force: true });
// });
// after(async () => {
// await sequelize.close();
// });
// describe('Auth API', () => {
// it('should register and login', async () => {
// const res = await request(app).post('/api/auth/register').send({ name: 'T',
// email: 't@example.com', password: 'pass123' });
// //res.should.have.property('status'); 
// // check status 201
// if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
// //if (res.status !== 201) throw new Error('Expected 201');
// const res2 = await request(app).post('/api/auth/login').send({ email:
// 't@example.com', password: 'pass123' });
// //if (res2.status !== 200) throw new Error('Expected 200');
// if (res2.status !== 200) throw new Error(`Expected 200, got ${res2.status}`);
// if (!res2.body.token) throw new Error('Missing token');
// });
// });
const request = require('supertest');
const { app } = require('../app');
const { sequelize } = require('../models');

before(async () => {
  await sequelize.sync({ force: true });
});

after(async () => {
  await sequelize.close();
});

describe('Auth API', () => {
  it('should register and login', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Travis', email: 'travis@example.com', password: 'pass123' });

    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);

    const res2 = await request(app)
      .post('/api/auth/login')
      .send({ email: 'travis@example.com', password: 'pass123' });

    if (res2.status !== 200) throw new Error(`Expected 200, got ${res2.status}`);
    if (!res2.body.token) throw new Error('Missing token');
  });
});
