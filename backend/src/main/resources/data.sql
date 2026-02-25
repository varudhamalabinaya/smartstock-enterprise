-- ============================================================
-- SmartStock Enterprise - Seed Data (PostgreSQL / Supabase)
-- ============================================================

-- -------------------------------------------------------
-- PRODUCTS (20 items across 4 categories)
-- -------------------------------------------------------
INSERT INTO products (name, category, stock_quantity, price, version)
VALUES
  ('Farm Fresh Milk 500ml',        'Groceries',     10,  45.00, 0),
  ('Whole Wheat Bread',            'Groceries',     15,  40.00, 0),
  ('Amul Butter 100g',             'Groceries',      8,  55.00, 0),
  ('Tata Salt 1kg',                'Groceries',     20,  22.00, 0),
  ('Aashirvaad Atta 5kg',          'Groceries',      6, 280.00, 0),
  ('Lays Classic Salted 26g',      'Snacks',         5,  20.00, 0),
  ('Dark Fantasy Choco Fills',     'Snacks',         8,  35.00, 0),
  ('Kurkure Masala Munch',         'Snacks',        12,  20.00, 0),
  ('Oreo Chocolate Cream',         'Snacks',         9,  30.00, 0),
  ('Haldiram Bhujia 200g',         'Snacks',         7,  60.00, 0),
  ('Coca Cola 750ml',              'Beverages',      3,  40.00, 0),
  ('Nescafe Instant Coffee',       'Beverages',     12, 150.00, 0),
  ('Tropicana Orange Juice 1L',    'Beverages',      6,  99.00, 0),
  ('Red Bull Energy Drink 250ml',  'Beverages',      4, 125.00, 0),
  ('Bisleri Water 1L',             'Beverages',     25,  20.00, 0),
  ('Dove Soap 100g',               'Personal Care', 14,  48.00, 0),
  ('Colgate Toothpaste 200g',      'Personal Care', 10,  89.00, 0),
  ('Head and Shoulders Shampoo',   'Personal Care',  5, 199.00, 0),
  ('Dettol Hand Wash 250ml',       'Personal Care',  8,  99.00, 0),
  ('Nivea Moisturizer 75ml',       'Personal Care',  6, 149.00, 0),
  -- Fruits & Vegetables
  ('Banana Robusta 6pcs',          'Fruits & Vegetables', 30,  49.00, 0),
  ('Tomato Local 500g',            'Fruits & Vegetables', 25,  29.00, 0),
  ('Onion 1kg',                    'Fruits & Vegetables', 20,  39.00, 0),
  ('Potato 1kg',                   'Fruits & Vegetables', 22,  35.00, 0),
  ('Apple Shimla 4pcs',            'Fruits & Vegetables', 15,  99.00, 0),
  ('Mango Alphonso 500g',          'Fruits & Vegetables',  8, 149.00, 0),
  ('Spinach 250g',                 'Fruits & Vegetables', 12,  25.00, 0),
  ('Carrot 500g',                  'Fruits & Vegetables', 18,  39.00, 0),
  ('Lemon 6pcs',                   'Fruits & Vegetables', 25,  29.00, 0),
  ('Watermelon 1pc',               'Fruits & Vegetables',  6, 199.00, 0)
ON CONFLICT DO NOTHING;

-- -------------------------------------------------------
-- USERS (2 demo users)
-- -------------------------------------------------------
INSERT INTO users (mobile_number)
VALUES
  ('9999999999'),
  ('8888888888')
ON CONFLICT (mobile_number) DO NOTHING;

-- -------------------------------------------------------
-- INVENTORY_LOGS (sample admin stock additions)
-- -------------------------------------------------------
INSERT INTO inventory_logs (product_id, admin_id, quantity_added, created_at)
SELECT p.id, 'admin', 50, NOW() FROM products p WHERE p.name = 'Farm Fresh Milk 500ml'
UNION ALL
SELECT p.id, 'admin', 30, NOW() FROM products p WHERE p.name = 'Lays Classic Salted 26g'
UNION ALL
SELECT p.id, 'admin', 20, NOW() FROM products p WHERE p.name = 'Coca Cola 750ml'
UNION ALL
SELECT p.id, 'admin', 40, NOW() FROM products p WHERE p.name = 'Dove Soap 100g';

-- -------------------------------------------------------
-- Verify
-- -------------------------------------------------------
SELECT 'Products: ' || COUNT(*) FROM products;
SELECT 'Users: '    || COUNT(*) FROM users;
