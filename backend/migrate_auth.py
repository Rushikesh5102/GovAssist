import sqlite3

def migrate_auth():
    conn = sqlite3.connect('sql_app.db')
    cursor = conn.cursor()
    
    columns_to_add = [
        ("is_verified", "BOOLEAN DEFAULT 0"),
        ("onboarding_completed", "BOOLEAN DEFAULT 0"),
        ("preferences", "VARCHAR DEFAULT '{}'"),
        ("location", "VARCHAR DEFAULT '{}'"),
        ("language", "VARCHAR DEFAULT 'en'"),
        ("otp_hash", "VARCHAR"),
        ("otp_expires_at", "VARCHAR")
    ]
    
    try:
        cursor.execute("PRAGMA table_info(users)")
        existing_columns = [info[1] for info in cursor.fetchall()]
        
        for col_name, col_type in columns_to_add:
            if col_name not in existing_columns:
                print(f"Adding {col_name} column to users...")
                try:
                    cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}")
                    print(f"Added {col_name}.")
                except Exception as e:
                    print(f"Failed to add {col_name}: {e}")
            else:
                pass
                
        conn.commit()
        print("Auth migration completed successfully.")
            
    except Exception as e:
        print(f"Migration failed: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_auth()
