import express from 'express';
import jwt from 'jsonwebtoken';

const { TOKEN_SECRET = '' } = process.env;

const verifyToken = (
  req: express.Request,
  res: express.Response,
  // eslint-disable-next-line @typescript-eslint/ban-types
  next: Function
): void => {
  try {
    const authorizationHeader = req.headers.authorization || ' ';
    const token = authorizationHeader.split(' ')[1];
    jwt.verify(token, TOKEN_SECRET);
    next();
  } catch (err) {
    res.status(401);
    res.json('Access Denied, Invalid Token !!!');
    return;
  }
};

export default verifyToken;
