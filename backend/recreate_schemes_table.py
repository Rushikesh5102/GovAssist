from app.core.database import engine, Base
from app.models.scheme import Scheme
from sqlalchemy import text

def recreate_schemes():
    print("Dropping 'schemes' table if exists...")
    with engine.connect() as conn:
        conn.execute(text("DROP TABLE IF EXISTS schemes"))
        print("Table dropped.")
    
    print("Recreating 'schemes' table...")
    Base.metadata.create_all(bind=engine)
    print("Table recreated.")

if __name__ == "__main__":
    recreate_schemes()
