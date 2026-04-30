import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./sql_app.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def check_users():
    db = SessionLocal()
    from app.models.user import User
    users = db.query(User).all()
    for u in users:
        print(f"ID: {u.id}, Email: {u.email}, Name: {u.full_name}, Role: {u.role}")
    db.close()

if __name__ == "__main__":
    check_users()
