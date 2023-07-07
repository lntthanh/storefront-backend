import Client from '../database/Client';
import bcrypt from 'bcrypt';

const { PASSWORD_SECRET, SALT_ROUND = '10' } = process.env;

export type User = {
  id?: number;
  first_name?: string;
  last_name?: string;
  username: string;
  password: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get Users. ${err}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find User ${id}. ${err}`);
    }
  }

  async create(b: User): Promise<User> {
    try {
      const usesql = 'SELECT * FROM users WHERE username=($1)';
      const conn = await Client.connect();

      const result = await conn.query(usesql, [b.username]);

      if (result.rows.length > 0) {
        throw new Error(`Exist user with username ${b.username}`);
      }

      conn.release();
    } catch (err) {
      throw new Error(`Could not add new user ${b.username}. ${err}`);
    }

    try {
      const sql =
        'INSERT INTO users (first_name, last_name, username, password) VALUES($1, $2, $3, $4) RETURNING *';
      const conn = await Client.connect();
      const hash = await bcrypt.hash(
        b.password + PASSWORD_SECRET,
        parseInt(SALT_ROUND)
      );

      const result = await conn.query(sql, [
        b.first_name,
        b.last_name,
        b.username,
        hash,
      ]);

      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`Could not add new User ${b.username}. ${err}`);
    }
  }

  async delete(id: number): Promise<User> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1)';
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete User ${id}. ${err}`);
    }
  }
}
