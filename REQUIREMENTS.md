# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Admins

- Index [admin token required]: GET /admins
- Show [admin token required]: GET /admins/:id
- Create [admin token required]: POST /admins
- Login [provide username, password]: POST /admins/login

#### Products

- Index: GET /products
- Show: GET /products/:id
- Create [admin token required]: POST /products
- Delete [admin token required]: DELETE /products/:id

#### Users

- Index [admin token required]: GET /users
- Show [admin token required]: GET /users/:id
- Create [admin token required]: POST /users
- Delete [admin token required]: DELETE /users/:id

#### Orders

- Create Order by user (args: user id)[admin token required]: POST /users/:userId/orders
- Add Product to Order by user (args: user id, order id)[admin token required]: POST /users/:userId/orders/:id
- Complete the Order by user (args: user id, order id)[admin token required]: POST /users/:userId/orders/:id/complete
- Get Orders by user & orderId (args: user id, order id)[admin token required]: GET: /users/:userId/orders/:id
- Delete Orders by user & orderId (args: user id, order id)[admin token required]: DELETE: /users/:userId/orders/:id
- All Orders by user (args: user id, order id)[admin token required]: GET: /users/:userId/orders
- Current Orders by user (active status) (args: user id)[admin token required]: GET: /users/:userId/orders?status=active
- Completed Orders by user(completed status) (args: user id)[admin token required] GET: /users/:userId/orders?status=completed

## Data Shapes

#### Admin

Database Table: admins
Column list:

```
id SERIAL PRIMARY KEY,
username VARCHAR(32) UNIQUE,
password VARCHAR
```

#### User

Database Table: users
Column list:

```
id SERIAL PRIMARY KEY,
first_name VARCHAR(24),
last_name VARCHAR(24),
username VARCHAR(32) UNIQUE,
password VARCHAR
```

#### Product

Database Table: products
Column list:

```
id SERIAL PRIMARY KEY,
name VARCHAR(64) NOT NULL,
price Integer NOT NULL,
category VARCHAR(64)
```

#### Order

Database Table: orders
Column list:

```
id SERIAL PRIMARY KEY,
status VARCHAR(15),
user_id bigint REFERENCES users(id)
items Order_Product list
```

#### Order_Product

Database Table: order_product
Column list:

```
id SERIAL PRIMARY KEY,
quantity integer,
order_id bigint REFERENCES orders(id),
product_id bigint REFERENCES products(id)
```
