import Client from '../database/Client';
import { OrderProduct } from './order-product';

export type Order = {
  id?: number;
  items?: OrderProduct[];
  user_id: number;
  status: 'active' | 'completed';
};

export class OrderStore {
  async index(userId: number, status: string): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      let sql = 'SELECT * FROM orders where user_id=($1)';
      const params: unknown[] = [userId];
      if (['active', 'completed'].includes(status)) {
        sql += ' AND status=($2)';
        params.push(status);
      }

      const result = await conn.query(sql, params);
      const orderProductSql =
        'SELECT * FROM order_products WHERE order_id=($1)';
      for (const order of result.rows) {
        const orderItems = await conn.query(orderProductSql, [order.id]);
        order.items = orderItems.rows;
      }

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could NOT get Order. Error: ${err}`);
    }
  }

  async show(userId: number, orderId: number): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1) and user_id=($2)';
      const conn = await Client.connect();

      const result = await conn.query(sql, [orderId, userId]);
      const orderProductSql =
        'SELECT * FROM order_products WHERE order_id=($1)';

      if (result.rows.length > 0) {
        const orderItems = await conn.query(orderProductSql, [
          result.rows[0].id,
        ]);
        result.rows[0].items = orderItems.rows;
      }
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could NOT find Order ${orderId}. Error: ${err}`);
    }
  }

  async create(b: Order): Promise<Order> {
    try {
      const sql =
        'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
      const conn = await Client.connect();

      const result = await conn.query(sql, [b.user_id, b.status]);

      const data = result.rows[0];

      if (b?.items && b?.items?.length > 0) {
        const sql =
          'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
        for (const item of b.items) {
          await conn.query(sql, [item.quantity, data.id, item.product_id]);
        }
      }

      conn.release();

      return data;
    } catch (err) {
      throw new Error(`Could NOT add new Order. Error: ${err}`);
    }
  }

  async delete(userId: number, orderId: number): Promise<Order> {
    try {
      const conn = await Client.connect();

      const sql = 'DELETE FROM orders WHERE id=($1) AND user_id=($2)';
      const deleteItemsSql = 'DELETE FROM order_products WHERE order_id=($1)';

      await conn.query(deleteItemsSql, [orderId]);
      const result = await conn.query(sql, [orderId, userId]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could NOT delete Order ${orderId}. Error: ${err}`);
    }
  }

  async addProduct(
    userId: number,
    orderId: number,
    productId: number,
    quantity: number
  ): Promise<OrderProduct> {
    try {
      const ordersql = 'SELECT * FROM orders WHERE id=($1) AND user_id=($2)';
      const conn = await Client.connect();

      const result = await conn.query(ordersql, [orderId, userId]);

      const order = result.rows[0];

      if (order.status !== 'active') {
        throw new Error(
          `1. Could NOT add product ${productId} to order ${orderId} because order status is ${order.status}`
        );
      }

      conn.release();
    } catch (err) {
      throw new Error(`${err}`);
    }

    try {
      const conn = await Client.connect();
      const checkItemSql =
        'SELECT * FROM order_products WHERE order_id=($1) AND product_id=($2)';
      const itemsResult = await conn.query(checkItemSql, [orderId, productId]);
      const existItem = itemsResult.rows[0];

      if (!existItem) {
        const sql =
          'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';

        const result = await conn.query(sql, [quantity, orderId, productId]);
        conn.release();

        return result.rows[0];
      } else {
        const sql =
          'UPDATE order_products SET quantity=($1) WHERE order_id=($2) AND product_id=($3) RETURNING *';

        const newQuantity = quantity + existItem.quantity;

        const result = await conn.query(sql, [newQuantity, orderId, productId]);
        conn.release();

        return result.rows[0];
      }
    } catch (err) {
      throw new Error(
        `2. Could NOT add product ${productId} to order ${orderId}: ${err}`
      );
    }
  }

  async completeOrder(userId: number, orderId: number): Promise<Order> {
    // get order to see if it is open
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1) AND user_id=($2)';
      const conn = await Client.connect();

      const result = await conn.query(sql, [orderId, userId]);

      const order = result.rows[0];
      if (!order) {
        throw new Error(`Cannot find Order ${orderId}`);
      }
      if (order.status !== 'active') {
        throw new Error(`Cannot complete Order ${orderId}`);
      }

      conn.release();
    } catch (err) {
      throw new Error(`${err}`);
    }

    try {
      const status = 'completed';
      const sql =
        'UPDATE orders SET status=($1) WHERE id=($2) AND user_id=($3) RETURNING *';
      const conn = await Client.connect();

      const result = await conn.query(sql, [status, orderId, userId]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot complete Order ${orderId}: ${err}`);
    }
  }
}
