import supertest from 'supertest';
import app from '../../index';

const request = supertest(app);

describe('Test Product Endpoint', () => {
  const token =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiIkMmIkMTAkL2VlazNtZ0tjUVRjQVZJUVpzU0pmT2liTWh0UGFSaXAyQVQ4VkdaSVZNbGFDSzhLSG41ZUMifSwiaWF0IjoxNjgxMzEzNTg0fQ.-uXhCIKEC1n-85sYqaA3aFJ8bDv8awfbSm0X28noxjo';

  it('Product list success', async () => {
    const response = await request.get('/products');
    expect(response.status).toBe(200);
  });

  it('Product list success, un-authorize', async () => {
    const response = await request.get('/products');
    expect(response.status).toBe(200);
  });

  it('Product with id=1 success', async () => {
    const response = await request.get('/products/1');
    expect(response.status).toBe(200);
  });

  it('Product with id=1 fail, un-authorize', async () => {
    const response = await request.get('/products/1');
    expect(response.status).toBe(200);
  });

  it('Create Product success', async () => {
    const response = await request
      .post('/products')
      .set('authorization', token)
      .send({
        name: 'product 3',
        price: 2000,
        category: 'hot',
      });
    expect(response.status).toBe(200);
  });

  it('Create Product fail, un-authorize', async () => {
    const response = await request.post('/products').send({
      name: 'product 4',
      price: 2000,
      category: 'hot',
    });
    expect(response.status).toBe(401);
  });

  it('Delete Product with id=3 success', async () => {
    const response = await request
      .delete('/products/3')
      .set('authorization', token);
    expect(response.status).toBe(200);
  });

  it('Delete Product with id=3 fail, un-authorize', async () => {
    const response = await request.delete('/products/3');
    expect(response.status).toBe(401);
  });
});
