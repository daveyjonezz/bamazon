DROP DATABASE IF EXISTS bamazon_db;
CREATE database bamazon_db;

USE bamazon_db;

CREATE TABLE products (
id INTEGER(11) AUTO_INCREMENT NOT NULL,
product_name VARCHAR(50) NULL,
department_name VARCHAR(50) NULL,
price INT NULL,
stock_quantity INT NULL,
PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Graham Crackers", "Food", 4, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Marshmallows", "Food", 3, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Chocolate Bars", "Food", 5, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Metal Skewers", "Household", 2, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Fire Pit", "Patio & Garden", 150, 7);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Lawn Chair", "Patio & Garden", 40, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Wireless Speaker", "Electronics", 75, 24);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Firewood", "Patio & Garden", 7, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Lighter Fluid", "Patio & Garden", 2, 17);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Mosquito Spray", "Household", 8, 130);