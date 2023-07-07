import { ProductStore } from '../../models/product';

const store = new ProductStore();

describe('Product Model', () => {
  beforeAll(async () => {
    await store.create({
      name: 'product 1',
      price: 2000,
      category: 'hot',
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

  it('Should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });

  it('Create method should add a product', async () => {
    const result = await store.create({
      name: 'product 2',
      price: 2000,
      category: 'hot',
    });
    expect(result.id).toBeGreaterThanOrEqual(2);
    expect(result.name).toEqual('product 2');
    expect(result.price).toEqual(2000);
    expect(result.category).toEqual('hot');
  });

  it('Index method should return a list of product', async () => {
    const result = await store.index();
    expect(result.length).toBeGreaterThanOrEqual(2);
  });

  it('Show method should return the correct product', async () => {
    const result = await store.show(1);
    expect(result.id).toEqual(1);
    expect(result.name).toEqual('product 1');
    expect(result.price).toEqual(2000);
    expect(result.category).toEqual('hot');
  });

  it('Delete method should remove the product', async () => {
    await store.delete(2);
    const result = await store.index();
    expect(result.length).toBeGreaterThanOrEqual(1);
  });
});
