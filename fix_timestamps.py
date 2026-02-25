import sqlite3

conn = sqlite3.connect('backend/data/smartstock.db')
c = conn.cursor()

# Fix timestamps that have 'T' instead of space (ISO format → SQLite format)
c.execute("UPDATE inventory_logs SET created_at = REPLACE(created_at, 'T', ' ') WHERE created_at LIKE '%T%'")
print(f"Rows updated: {c.rowcount}")

# Also fix timestamps that have timezone suffix like '+05:30'
c.execute("UPDATE inventory_logs SET created_at = SUBSTR(created_at, 1, 19) WHERE LENGTH(created_at) > 19")
print(f"Rows trimmed: {c.rowcount}")

rows = c.execute('SELECT id, created_at FROM inventory_logs').fetchall()
for r in rows:
    print(r)

conn.commit()
conn.close()
print('Done!')
