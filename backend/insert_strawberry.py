import sqlite3
conn = sqlite3.connect('data/smartstock.db')
cur = conn.cursor()
cur.execute(
    "INSERT OR IGNORE INTO products (name, category, stock_quantity, price, version) VALUES (?, ?, ?, ?, ?)",
    ('Strawberry (Mahabaleshwar)', 'Fruits & Vegetables', 10, 99.00, 0)
)
conn.commit()
cur.execute("SELECT id, name, stock_quantity, price FROM products WHERE name LIKE '%Strawberry%'")
rows = cur.fetchall()
print("Inserted Strawberry:", rows)
conn.close()
