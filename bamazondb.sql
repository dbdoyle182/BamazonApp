-- Initial schema 
DROP DATABASE IF EXISTS db_bamazon;

CREATE DATABASE db_bamazon;

USE db_bamazon;
CREATE TABLE products (
item_id INT(3) AUTO_INCREMENT,
product_name VARCHAR(30),
department_name VARCHAR(30),
price DECIMAL(10, 2),
stock_quantity INT (10),
PRIMARY KEY(item_id)
);



SELECT *
FROM products;
