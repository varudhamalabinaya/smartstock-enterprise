-- SmartStock Enterprise - Seed Data
-- Run this in H2 Console or any SQLite viewer

-- Clear existing data
DELETE FROM PRODUCT_LOCKS;
DELETE FROM INVENTORY_LOGS;
DELETE FROM PRODUCTS;

-- Insert 20 Products
INSERT INTO PRODUCTS (name, category, stock_quantity, price, version) VALUES
-- Groceries
('Farm Fresh Milk 500ml',       'Groceries',    10, 45.00,  0),
('Whole Wheat Bread',           'Groceries',    15, 40.00,  0),
('Amul Butter 100g',            'Groceries',     8, 55.00,  0),
('Tata Salt 1kg',               'Groceries',    20, 22.00,  0),
('Aashirvaad Atta 5kg',         'Groceries',     6, 280.00, 0),
-- Snacks
('Lays Classic Salted 26g',     'Snacks',        5, 20.00,  0),
('Dark Fantasy Choco Fills',    'Snacks',        8, 35.00,  0),
('Kurkure Masala Munch',        'Snacks',       12, 20.00,  0),
('Oreo Chocolate Cream',        'Snacks',        9, 30.00,  0),
('Haldiram Bhujia 200g',        'Snacks',        7, 60.00,  0),
-- Beverages
('Coca Cola 750ml',             'Beverages',     3, 40.00,  0),
('Nescafe Instant Coffee',      'Beverages',    12, 150.00, 0),
('Tropicana Orange Juice 1L',   'Beverages',     6, 99.00,  0),
('Red Bull Energy Drink 250ml', 'Beverages',     4, 125.00, 0),
('Bisleri Water 1L',            'Beverages',    25, 20.00,  0),
-- Personal Care
('Dove Soap 100g',              'Personal Care', 14, 48.00,  0),
('Colgate Toothpaste 200g',     'Personal Care', 10, 89.00,  0),
('Head & Shoulders Shampoo',    'Personal Care',  5, 199.00, 0),
('Dettol Hand Wash 250ml',      'Personal Care',  8, 99.00,  0),
('Nivea Moisturizer 75ml',      'Personal Care',  6, 149.00, 0);

-- Verify
SELECT COUNT(*) AS total_products FROM PRODUCTS;
SELECT * FROM PRODUCTS ORDER BY category, name;
