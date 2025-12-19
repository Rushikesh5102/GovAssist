from twilio.rest import Client
from app.core.config import settings

def send_otp_sms(to_number: str, otp: str):
    """
    Sends an OTP SMS if Twilio settings are configured.
    Returns True if sent, False if mocked.
    """
    if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN or not settings.TWILIO_PHONE_NUMBER:
        print(f"==================================================")
        print(f" [MOCK SMS] To: {to_number} | OTP: {otp}")
        print(f"==================================================")
        return False

    try:
        # Check for +91 or + code, if specific region logic needed.
        # Assuming to_number has country code or we default
        if not to_number.startswith('+'):
            # Default to India for this project as it mentions Aadhar
            to_number = f"+91{to_number}"

        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        
        message = client.messages.create(
            body=f"Your GovAssist Verification Code is: {otp}. Valid for 10 minutes.",
            from_=settings.TWILIO_PHONE_NUMBER,
            to=to_number
        )
        
        print(f" [REAL SMS] Sent to {to_number} (SID: {message.sid})")
        return True
    
    except Exception as e:
        print(f" [SMS ERROR] Failed to send SMS: {e}")
        # Fallback to print
        print(f" [MOCK SMS FALLBACK] To: {to_number} | OTP: {otp}")
        return False
