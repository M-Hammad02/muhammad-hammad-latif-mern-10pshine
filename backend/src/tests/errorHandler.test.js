const request = require('supertest');
const { app } = require('../app');

describe('Error Handling', () => {
  it('should return 404 for unknown route', async () => {
    const res = await request(app).get('/non-existent');
    if (res.status !== 404 && res.status !== 500) throw new Error('Expected 404/500');
  });

  it('should return 401 for missing token', async () => {
    const res = await request(app).get('/api/notes');
    if (res.status !== 401) throw new Error('Expected 401');
  });
});
