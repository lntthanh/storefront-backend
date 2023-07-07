import supertest from 'supertest';
import app from '../../index';

const request = supertest(app);

describe('Test Order Endpoint', () => {
  const token =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiIkMmIkMTAkL2VlazNtZ0tjUVRjQVZJUVpzU0pmT2liTWh0UGFSaXAyQVQ4VkdaSVZNbGFDSzhLSG41ZUMifSwiaWF0IjoxNjgxMzEzNTg0fQ.-uXhCIKEC1n-85sYqaA3aFJ8bDv8awfbSm0X28noxjo';
  const user_id = 1;
  const product_id = 1;

  it('Orders by user_id=1 success', async () => {
    const response = await request
      .get(`/users/${user_id}/orders`)
      .set('authorization', token);
    expect(response.status).toBe(200);
  });

  it('Orders by user_id=1, status=active success', async () => {
    const response = await request
      .get(`/users/${user_id}/orders?status=active`)
      .set('authorization', token);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

  it('Orders by user_id=1, status=complete success', async () => {
    const response = await request
      .get(`/users/${user_id}/orders?status=completed`)
      .set('authorization', token);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);
  });

  it('Orders by user_id=1 fail, un-authorize', async () => {
    const response = await request.get(`/users/${user_id}/orders`);
    expect(response.status).toBe(401);
  });

  it('Orders with id=1, user_id=1 success', async () => {
    const response = await request
      .get(`/users/${user_id}/orders/1`)
      .set('authorization', token);
    expect(response.status).toBe(200);
  });

  it('Orders with id=1, user_id=1 fail, un-authorize', async () => {
    const response = await request.get(`/users/${user_id}/orders/1`);
    expect(response.status).toBe(401);
  });

  it('Create Order user_id=1 success', async () => {
    const response = await request
      .post(`/users/${user_id}/orders`)
      .set('authorization', token)
      .send({
        user_id: user_id,
        items: [],
      });
    expect(response.status).toBe(200);
  });

  it('Create Order user_id=1 fail, un-authorize', async () => {
    const response = await request.post(`/users/${user_id}/orders`).send({
      user_id: user_id,
      items: [],
    });
    expect(response.status).toBe(401);
  });

  it('Add Product into Order id=3, user_id=1 success', async () => {
    const response = await request
      .post(`/users/${user_id}/orders/3/products`)
      .set('authorization', token)
      .send({
        product_id: product_id,
        quantity: 2,
      });
    expect(response.status).toBe(200);
  });

  it('Add Product into Order id=3, user_id=1 fail, un-authorize', async () => {
    const response = await request
      .post(`/users/${user_id}/orders/3/products`)
      .send({
        product_id: product_id,
        quantity: 2,
      });
    expect(response.status).toBe(401);
  });

  it('Complete Order id=3, user_id=1 success', async () => {
    const response = await request
      .post(`/users/${user_id}/orders/3/complete`)
      .set('authorization', token)
      .send({});
    expect(response.status).toBe(200);
  });

  it('Complete Order id=3, user_id=1 fail, un-authorize', async () => {
    const response = await request
      .post(`/users/${user_id}/orders/3/complete`)
      .send({});
    expect(response.status).toBe(401);
  });

  it('Delete Order with id=3, user_id=1 success', async () => {
    const response = await request
      .delete(`/users/${user_id}/orders/3`)
      .set('authorization', token);
    expect(response.status).toBe(200);
  });

  it('Delete Order with id=3, user_id=1 fail, un-authorize', async () => {
    const response = await request.delete(`/users/${user_id}/orders/3`);
    expect(response.status).toBe(401);
  });
});
