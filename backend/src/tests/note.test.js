const request = require('supertest');
const { app } = require('../app');
const { sequelize } = require('../models');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

describe('Notes API', () => {
  let token;

  before(async () => {
    await sequelize.sync({ force: true });
    const user = await User.create({ name: 'A', email: 'a@example.com', password: 'pass123' });
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'changeme');
  });

  it('should create a new note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Note', content: 'Note content' });

    if (res.status !== 201) throw new Error('Expected 201');
    if (!res.body.id) throw new Error('Note ID missing');
  });

  it('should fetch all notes for a user', async () => {
    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${token}`);
    if (res.status !== 200) throw new Error('Expected 200');
  });

  it('should update a note', async () => {
    const note = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Old Title', content: 'Old content' });
    const res = await request(app)
      .put(`/api/notes/${note.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated', content: 'Updated content' });
    if (res.status !== 200) throw new Error('Expected 200');
  });

  it('should delete a note', async () => {
    const note = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'To Delete', content: 'content' });
    const res = await request(app)
      .delete(`/api/notes/${note.body.id}`)
      .set('Authorization', `Bearer ${token}`);
    if (res.status !== 200) throw new Error('Expected 200');
  });
});
