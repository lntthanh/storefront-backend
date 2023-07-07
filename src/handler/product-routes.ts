import express, { Request, Response } from 'express';
import verifyToken from '../middleware/verify-token';
import { Product, ProductStore } from '../models/product';

const store = new ProductStore();

const index = async (req: Request, res: Response) => {
  try {
    const results = await store.index();
    res.json(results);
  } catch (err) {
    res.status(400);
    res.json({ message: `${err}` });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const data = await store.show(parseInt(req.params.id));
    if (!data) {
      res.status(404).json({ message: 'Data not found !!!' });
      return;
    }
    res.json(data);
  } catch (err) {
    res.status(400);
    res.json({ message: `${err}` });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const data: Product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
    };

    if (!data.name || !data.price) {
      throw new Error('Name and Price must be required !!!');
    }

    if (data.price < 0) {
      throw new Error('Price must be more than or equal 0 !!!');
    }

    const newData = await store.create(data);
    res.json(newData);
  } catch (err) {
    res.status(400);
    res.json({ message: `${err}` });
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const deleted = await store.delete(parseInt(req.params.id));
    res.json(deleted);
  } catch (err) {
    res.status(400);
    res.json({ message: `${err}` });
  }
};

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyToken, create);
  app.delete('/products/:id', verifyToken, destroy);
};

export default productRoutes;
