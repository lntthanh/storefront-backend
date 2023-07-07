/* Replace with your SQL commands */
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(24) NOT NULL,
    last_name VARCHAR(24) NOT NULL,
    username VARCHAR(32) UNIQUE NOT NULL,
    password VARCHAR NOT NULL
);