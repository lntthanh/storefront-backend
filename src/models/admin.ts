import Client from '../database/Client';
import bcrypt from 'bcrypt';

const { PASSWORD_SECRET, SALT_ROUND = '10' } = process.env;

export type Admin = {
  id?: number;
  username: string;
  password: string;
};

export class AdminStore {
  async index(): Promise<Admin[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM admins';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could NOT get admins. ${err}`);
    }
  }

  async show(id: string): Promise<Admin> {
    try {
      const sql = 'SELECT * FROM admins WHERE id=($1)';
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could NOT find admins ${id}. ${err}`);
    }
  }

  async create(b: Admin): Promise<Admin> {
    try {
      const adminsql = 'SELECT * FROM admins WHERE username=($1)';
      const conn = await Client.connect();

      const result = await conn.query(adminsql, [b.username]);

      if (result.rows.length > 0) {
        throw new Error(`Exist admin with Username ${b.username}`);
      }

      conn.release();
    } catch (err) {
      throw new Error(`Could NOT add new admin ${b.username}. ${err}`);
    }

    try {
      const sql =
        'INSERT INTO admins (username, password) VALUES($1, $2) RETURNING *';
      const conn = await Client.connect();
      const hash = await bcrypt.hash(
        b.password + PASSWORD_SECRET,
        parseInt(SALT_ROUND)
      );
      const result = await conn.query(sql, [b.username, hash]);

      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`Could NOT add new admins ${b.username}. ${err}`);
    }
  }

  async authenticate(
    username: string,
    password: string
  ): Promise<Admin | undefined | null> {
    try {
      const sql = 'SELECT * FROM admins WHERE username=($1)';
      const conn = await Client.connect();

      const result = await conn.query(sql, [username]);
      conn.release();
      if (result.rows.length) {
        const user = result.rows[0];

        if (bcrypt.compareSync(password + PASSWORD_SECRET, user?.password)) {
          return user;
        }
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(
        `Could NOT Authenticate Admin ${username}. Error: ${err}`
      );
    }
  }
}
