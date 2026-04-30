import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import User
from app.core.security import get_password_hash

DATABASE_URL = "sqlite:///./sql_app.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def update_users():
    db = SessionLocal()
    
    # 1. Rushikesh -> Owner
    rushi = db.query(User).filter(User.email == "pattiwarrushikesh5102@gmail.com").first()
    if rushi:
        rushi.role = "owner"
    
    # 2. Atharva -> Admin
    atharva = db.query(User).filter(User.email == "kulkarniatharva753@gmail.com").first()
    if atharva:
        atharva.role = "admin"
        
    # 3. Shashank -> Update credentials
    shashank = db.query(User).filter(User.email == "Gundawarshashank12@gmail.com").first()
    if shashank:
        shashank.hashed_password = get_password_hash("Gundawar24@")
        shashank.role = "owner"  # Assuming he's also an owner based on context
        print("Updated Shashank's password and role.")
    else:
        # Create Shashank if he somehow didn't exist properly, though we saw him in output
        new_shashank = User(
            email="Gundawarshashank12@gmail.com",
            hashed_password=get_password_hash("Gundawar24@"),
            full_name="Shashank Gundawar",
            role="owner"
        )
        db.add(new_shashank)
        print("Created Shashank.")

    db.commit()
    print("All user roles and credentials updated successfully.")
    db.close()

if __name__ == "__main__":
    update_users()
