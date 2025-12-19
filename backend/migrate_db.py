
import sqlite3

def migrate():
    conn = sqlite3.connect('sql_app.db')
    cursor = conn.cursor()
    
    try:
        # Check if column exists
        cursor.execute("PRAGMA table_info(chat_messages)")
        columns = [info[1] for info in cursor.fetchall()]
        
        if 'feedback' not in columns:
            print("Adding feedback column to chat_messages...")
            cursor.execute("ALTER TABLE chat_messages ADD COLUMN feedback VARCHAR")
            conn.commit()
            print("Migration successful.")
        else:
            print("Column 'feedback' already exists.")
            
    except Exception as e:
        print(f"Migration failed: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
