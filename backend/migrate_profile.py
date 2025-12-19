import sqlite3
import os

def migrate():
    db_path = "govassist.db" # Check standard path
    if not os.path.exists(db_path):
        # Fallback if in different dir
        db_path = "backend/govassist.db"
    
    if not os.path.exists(db_path):
         db_path = "c:\\Users\\Rushi\\Desktop\\GovAssist\\backend\\govassist.db"

    print(f"Migrating database at: {db_path}")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        cursor.execute("ALTER TABLE users ADD COLUMN profile_data TEXT DEFAULT '{}'")
        conn.commit()
        print("Successfully added profile_data column to users table.")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e).lower():
            print("Column profile_data already exists.")
        else:
            print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
