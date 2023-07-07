import express, { Request, Response } from 'express';
import { Admin, AdminStore } from '../models/admin';
import verifyToken from '../middleware/verify-token';
const { TOKEN_SECRET = '' } = process.env;
import { validatePwd, validateUsername } from '../helper/validator';
import jwt from 'jsonwebtoken';

const store = new AdminStore();

const index = async (req: Request, res: Response) => {
  try {
    const results = await store.index();
    results.forEach((item) => (item.password = '******'));
    res.json(results);
  } catch (err) {
    res.status(400);
    res.json({ message: `${err}` });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const data = await store.show(req.params.id);
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
    const data: Admin = {
      username: req.body.username,
      password: req.body.password,
      id: undefined,
    };

    if (!data.username || !data.password) {
      throw new Error('Username & Password must be required !!!');
    }

    let validate = validateUsername(data.username) || validatePwd(data.username);
    if (validate) {
      throw new Error(validate);
    }
    // validate = validatePwd(data.username);
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

const authenticate = async (req: Request, res: Response) => {
  try {
    const u = await store.authenticate(req.body.username, req.body.password);
    if (!u) {
      res.status(401).json({ message: 'Invalid Username or Password !!!' });
      return;
    }
    const token = jwt.sign({ user: u }, TOKEN_SECRET);
    res.json({ token: token });
  } catch (err) {
    res.status(400);
    res.json({ message: `${err}` });
  }
};

const adminRoutes = (app: express.Application) => {
  app.get('/admins', verifyToken, index);
  app.get('/admins/:id', verifyToken, show);
  app.post('/admins', verifyToken, create);
  app.post('/admins/login', authenticate);
};

export default adminRoutes;
