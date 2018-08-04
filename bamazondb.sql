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
item_bought INT (4) DEFAULT 0 NOT NULL,
item_sales DECIMAL(8, 2) DEFAULT 0 NOT NULL,
PRIMARY KEY(item_id)
);

CREATE TABLE departments(
  department_id INT AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  over_head_costs DECIMAL(10,2) NOT NULL,
  primary key(department_id)
);


SELECT *
FROM products;
