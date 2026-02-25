import sqlite3

conn = sqlite3.connect('data/smartstock.db')
cur = conn.cursor()

products = [
    ('Banana Robusta 6pcs',   'Fruits & Vegetables', 30,  49.00, 0),
    ('Tomato Local 500g',     'Fruits & Vegetables', 25,  29.00, 0),
    ('Onion 1kg',             'Fruits & Vegetables', 20,  39.00, 0),
    ('Potato 1kg',            'Fruits & Vegetables', 22,  35.00, 0),
    ('Apple Shimla 4pcs',     'Fruits & Vegetables', 15,  99.00, 0),
    ('Mango Alphonso 500g',   'Fruits & Vegetables',  8, 149.00, 0),
    ('Spinach 250g',          'Fruits & Vegetables', 12,  25.00, 0),
    ('Carrot 500g',           'Fruits & Vegetables', 18,  39.00, 0),
    ('Lemon 6pcs',            'Fruits & Vegetables', 25,  29.00, 0),
    ('Watermelon 1pc',        'Fruits & Vegetables',  6, 199.00, 0),
]

for p in products:
    cur.execute(
        'INSERT OR IGNORE INTO products (name, category, stock_quantity, price, version) VALUES (?,?,?,?,?)', p
    )

conn.commit()

cur.execute("SELECT id, name, stock_quantity, price FROM products WHERE category='Fruits & Vegetables'")
rows = cur.fetchall()
print(f"Fruits & Vegetables products: {len(rows)}")
for row in rows:
    print(f"  id={row[0]}  {row[1]}  qty={row[2]}  price={row[3]}")

conn.close()
print("Done!")
