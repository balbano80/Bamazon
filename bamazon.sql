DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products(
item_id INT(11) NOT NULL AUTO_INCREMENT, 
product_name VARCHAR(40) NOT NULL,
department_name VARCHAR(30),
price DECIMAL(10, 2) DEFAULT 0.00,
stock_quantity INT(11) DEFAULT 0,
PRIMARY KEY (item_id)
);

INSERT INTO  products (product_name, department_name, price, stock_quantity)
VALUES ("Sony PS4", "Electronics", 399.99, 20), 
    ("Hue Light Kit", "Electronics", 79.99, 10), 
    ("32 inch Computer Monitor", "Electronics", 199.99, 15), 
    ("16.9 fl oz Water(24 pack)", "Grocery", 3.99, 100), 
    ("Chicken Noodle Soup(8 pack", "Grocery", 10.99, 40), 
    ("Macaroni and Cheese(5 pack)", "Grocery", 5.99, 25), 
    ("Crew socks(6 pack)", "Clothing", 12.99, 50), 
    ("Men's plain white T-shirts(5 pack)", "Clothing", 19.99, 60), 
    ("Flannel pajama pants(3 pack)", "Clothing", 24.99, 30), 
    ("Body wash", "Beauty and Health", 6.99, 40), 
    ("Toothpaste(2 pack)", "Beauty and Health", 4.99, 90), 
    ("Shaving cream", "Beauty and Health", 2.99, 60);

    -- SELECT * FROM products;

CREATE TABLE departments(
    department_id INT(11) NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(40) NOT NULL,
    over_head_costs DECIMAL(10, 2) DEFAULT 0.00
);
