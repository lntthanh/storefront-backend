import supertest from 'supertest';
import app from '../../index';

const request = supertest(app);

describe('Test User Endpoint', () => {
  const token =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiIkMmIkMTAkL2VlazNtZ0tjUVRjQVZJUVpzU0pmT2liTWh0UGFSaXAyQVQ4VkdaSVZNbGFDSzhLSG41ZUMifSwiaWF0IjoxNjg4ODMzMjk1fQ.c0iLQF-_2ldL6AWYKSHHSVitACKnl137QCT6IE4vo6o';

  it('User list success', async () => {
    const response = await request.get('/users').set('authorization', token);
    expect(response.status).toBe(200);
  });

  it('User list fail, un-authorize', async () => {
    const response = await request.get('/users');
    expect(response.status).toBe(401);
  });

  it('User with id=1 success', async () => {
    const response = await request.get('/users/1').set('authorization', token);
    expect(response.status).toBe(200);
  });

  it('User with id=1 fail, un-authorize', async () => {
    const response = await request.get('/users/1');
    expect(response.status).toBe(401);
  });

  it('Create User success', async () => {
    const response = await request
      .post('/users')
      .set('authorization', token)
      .send({
        username: 'user5',
        password: '12345678',
        last_name: 'last name',
        first_name: 'first name',
      });
    expect(response.status).toBe(200);
  });

  it('Create User fail, un-authorize', async () => {
    const response = await request.post('/users').send({
      username: 'user6',
      password: '123456',
      last_name: 'last name',
      first_name: 'first name',
    });
    expect(response.status).toBe(401);
  });

  it('Delete User with id=3 success', async () => {
    const response = await request
      .delete('/users/3')
      .set('authorization', token);
    expect(response.status).toBe(200);
  });

  it('Delete User with id=3 fail, un-authorize', async () => {
    const response = await request.delete('/users/3');
    expect(response.status).toBe(401);
  });
});
