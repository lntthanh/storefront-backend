import { UserStore } from '../../models/user';

const store = new UserStore();

describe('User Model', () => {
  beforeAll(async () => {
    await store.create({
      username: 'thanhlnt1',
      password: '123456',
      first_name: 'Thanh',
      last_name: 'Le',
    });
  });

  it('Should have a index method', () => {
    expect(store.index).toBeDefined();
  });

  it('Should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('Should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });

  it('Create method should add a user', async () => {
    const result = await store.create({
      username: 'thanhlnt2',
      password: '123456',
      first_name: 'Thanh',
      last_name: 'Le',
    });
    expect(result.id).toBeGreaterThanOrEqual(3);
    expect(result.username).toEqual('thanhlnt2');
    expect(result.first_name).toEqual('Thanh');
    expect(result.last_name).toEqual('Le');
  });

  it('Index method should return a list of user', async () => {
    const result = await store.index();
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('Show method should return the correct user', async () => {
    const result = await store.show(1);
    expect(result.id).toBeGreaterThanOrEqual(1);
    expect(result.username).toEqual('thanhlnt');
    expect(result.first_name).toEqual('Thanh');
    expect(result.last_name).toEqual('Le');
  });

  it('Delete method should remove the user', async () => {
    await store.delete(2);
    const result = await store.index();
    expect(result.length).toBeGreaterThanOrEqual(1);
  });
});
