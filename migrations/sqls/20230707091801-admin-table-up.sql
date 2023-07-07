/* Replace with your SQL commands */
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(32) UNIQUE NOT NULL,
    password VARCHAR  NOT NULL
);

INSERT INTO admins(username, password) VALUES('admin', '$2b$10$/eek3mgKcQTcAVIQZsSJfOibMhtPaRip2AT8VGZIVMlaCK8KHn5eC');