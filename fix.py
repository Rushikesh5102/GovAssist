import sqlite3
conn=sqlite3.connect('backend/sql_app.db')
c=conn.cursor()
c.execute("UPDATE users SET role='owner' WHERE email='pattiwarrushikesh5102@gmail.com'")
conn.commit()
conn.close()
