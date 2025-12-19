from app.core.database import engine, Base
from app.models.scheme import Scheme
from sqlalchemy import text

def migrate():
    print("Creating 'schemes' table...")
    Base.metadata.create_all(bind=engine)
    print("Migration complete.")

    # verify
    with engine.connect() as conn:
        result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='schemes';"))
        if result.fetchone():
            print("Table 'schemes' verified exists.")
        else:
            print("Error: Table 'schemes' not found.")

if __name__ == "__main__":
    migrate()
