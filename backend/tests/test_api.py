from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "GovAssist AI API is running"}

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_create_user():
    # Use a random email to avoid conflict
    import random
    email = f"testuser{random.randint(1000,9999)}@example.com"
    response = client.post(
        "/api/auth/register",
        json={"email": email, "password": "password123", "full_name": "Test User"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_chat_endpoint_unauthorized():
    response = client.post(
        "/api/chat",
        json={"message": "Hello"}
    )
    # Should fail without token
    assert response.status_code == 401
