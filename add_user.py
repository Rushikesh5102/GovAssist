import sys
sys.path.append('backend')
from app.core.security import get_password_hash
from app.core.database import SessionLocal
from app.models.user import User

db = SessionLocal()

# Check if user already exists
user = db.query(User).filter(User.email == 'Gundawarshashank12@gmail.com').first()
if user:
    print("User already exists!")
else:
    new_user = User(
        email='Gundawarshashank12@gmail.com',
        hashed_password=get_password_hash('Gundawar24@'),
        full_name='Shashank Gundawar',
        phone_number='0000000000',
        role='owner',
        is_admin=True,
        is_active=True,
        is_verified=True,
        onboarding_completed=True
    )
    db.add(new_user)
    db.commit()
    print("User created successfully!")
db.close()
