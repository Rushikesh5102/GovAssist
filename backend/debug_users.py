from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.user import User

db = SessionLocal()
try:
    users = db.query(User).all()
    print(f"Total users: {len(users)}")
    for user in users:
        print(f"ID: {user.id}, Email: '{user.email}', Role: {user.role}, IsAdmin: {user.is_admin}")
        
    admin_email_lower = "pattiwarrushikesh5102@gmail.com"
    user_lower = db.query(User).filter(User.email == admin_email_lower).first()
    print(f"Search for lowercase '{admin_email_lower}': {'Found' if user_lower else 'Not Found'}")

    admin_email_cap = "Pattiwarrushikesh5102@gmail.com"
    user_cap = db.query(User).filter(User.email == admin_email_cap).first()
    print(f"Search for capitalized '{admin_email_cap}': {'Found' if user_cap else 'Not Found'}")
    
finally:
    db.close()
