const request = require('supertest');
const { app } = require('../app');
const { sequelize } = require('../models');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

describe('User API', () => {
  let token;

  before(async () => {
    await sequelize.sync({ force: true });
    const user = await User.create({ name: 'B', email: 'b@example.com', password: 'pass123' });
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'changeme');
  });

  it('should get current user profile', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    if (res.status !== 200) throw new Error('Expected 200');
  });

  it('should update user info', async () => {
    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name' });
    if (res.status !== 200) throw new Error('Expected 200');
  });
});
