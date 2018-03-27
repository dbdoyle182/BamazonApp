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

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Supersonic Headphones', 'Electronics', 60.99, 50),
('Auto Kitty Litter', 'Pet Goods', 49.99, 25),
('Mega Juicer', 'Appliances', 99.99, 40),
('Baby Safe Car Seat', 'Baby Products', 39.50, 50),
('Breast Pump', 'Baby Products', 30.00, 65),
('Orbital Sander', 'Home Improvement', 65.00, 20),
('Ultra Allergy Medicine', 'Medicine', 24.99, 100),
('Star Wars Lightsaber', 'Toys and Games', 109.99, 15),
('Poop Emoji Pillow', 'Home Decor', 14.99, 500),
('Cat Leash', 'Pet Goods', 11.99, 35),
('Cold Brew Maker', 'Appliances', 34.99, 100);

SELECT *
FROM products;
