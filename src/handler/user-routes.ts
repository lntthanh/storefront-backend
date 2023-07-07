import express, { Request, Response } from 'express';
import { validatePwd, validateUsername } from '../helper/validator';
import verifyToken from '../middleware/verify-token';
import { User, UserStore } from '../models/user';

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  try {
    const results = await store.index();
    results.forEach((t) => (t.password = '******'));
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
    data.password = '******';
    res.json(data);
  } catch (err) {
    res.status(400);
    res.json({ message: `${err}` });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const data: User = {
      username: req.body.username,
      password: req.body.password,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    };

    if (
      !data.username ||
      !data.password ||
      !data.first_name ||
      !data.last_name
    ) {
      throw new Error(
        'username, password, first_name and last_name must be required'
      );
    }

    let validate = validateUsername(data.username) || validatePwd(data.username);;
    if (validate) {
      throw new Error(validate);
    }
    // validate = validatePwd(data.password);
    // if (validate) {
    //   throw new Error(validate);
    // }

    const newData = await store.create(data);
    newData.password = '******';
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

const userRoutes = (app: express.Application) => {
  app.get('/users', verifyToken, index);
  app.get('/users/:id', verifyToken, show);
  app.post('/users', verifyToken, create);
  app.delete('/users/:id', verifyToken, destroy);
};

export default userRoutes;
