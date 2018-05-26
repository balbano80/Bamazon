DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazon;

CREATE TABLE products(
item_id INT(11) AUTO_INCREMENT NOT NULL;
product_name VARCHAR(30) NOT NULL;
department_name VARCHAR(30);
price DECIMAL(10, 2) DEFAULT 0.00;
stock_quantity INT(11) DEFAULT 0;
);

INSERT INTO  products (product_name, department_name, price, stock_quantity)
VALUES ("", "", , ), 
    ("", "", , ), 
    ("", "", , ), 
    ("", "", , ), 
    ("", "", , ), 
    ("", "", , ), 
    ("", "", , ), 
    ("", "", , ), 
    ("", "", , ), 
    ("", "", , ), 
    ("", "", , ), 
    ("", "", , );
