import random
import string
import time
from datetime import datetime, timedelta

# In-memory storage for MVP (Production should use Redis)
# Structure: { key (email/phone): { "otp": "123456", "expires_at": timestamp, "attempts": 0 } }
otp_storage = {}

OTP_EXPIRY_MINUTES = 5
MAX_ATTEMPTS = 3

class OTPService:
    @staticmethod
    def generate_otp(phone_number: str) -> str:
        otp = "".join(random.choices(string.digits, k=6))
        expires_at = datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES)
        
        otp_storage[phone_number] = {
            "otp": otp,
            "expires_at": expires_at,
            "attempts": 0
        }
        return otp

    @staticmethod
    def verify_otp(key: str, otp: str) -> tuple[bool, str]:
        """
        Verifies the OTP.
        Returns: (is_valid, message)
        """
        record = otp_storage.get(key)
        
        if not record:
            return False, "OTP not found or expired. Please request a new one."
            
        if datetime.utcnow() > record["expires_at"]:
            del otp_storage[key]
            return False, "OTP has expired."
            
        if record["attempts"] >= MAX_ATTEMPTS:
            del otp_storage[key]
            return False, "Too many failed attempts. Please request a new OTP."
            
        if record["otp"] != otp:
            record["attempts"] += 1
            return False, "Invalid OTP."
            
        # Success - clear OTP to prevent reuse
        del otp_storage[key]
        return True, "OTP Verified Successfully"

    @staticmethod
    def cleanup_expired():
        """Optional: Helper to clean up old keys (can be run periodically)"""
        now = datetime.utcnow()
        keys_to_delete = [k for k, v in otp_storage.items() if now > v["expires_at"]]
        for k in keys_to_delete:
            del otp_storage[k]
