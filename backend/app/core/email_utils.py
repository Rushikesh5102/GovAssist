import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
import logging

def send_otp_email(to_email: str, otp: str):
    """
    Sends an OTP email if SMTP settings are configured.
    Returns True if sent, False if mocked.
    """
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        print(f"==================================================")
        print(f" [MOCK EMAIL] To: {to_email} | OTP: {otp}")
        print(f"==================================================")
        return False

    try:
        msg = MIMEMultipart()
        msg['From'] = settings.EMAIL_FROM
        msg['To'] = to_email
        msg['Subject'] = "GovAssist Verification Code"

        body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #FF9933; text-align: center;">GovAssist Verification</h2>
                    <p>Hello,</p>
                    <p>Your verification code for GovAssist is:</p>
                    <div style="font-size: 24px; font-weight: bold; color: #333; text-align: center; padding: 15px; background: #fff; border: 1px solid #ddd; margin: 20px 0;">
                        {otp}
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p style="font-size: 12px; color: #888;">If you didn't request this code, please ignore this email.</p>
                </div>
            </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html'))

        server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        text = msg.as_string()
        server.sendmail(settings.EMAIL_FROM, to_email, text)
        server.quit()
        print(f" [REAL EMAIL] Sent to {to_email}")
        return True
    
    except Exception as e:
        print(f" [EMAIL ERROR] Failed to send email: {e}")
        # Fallback to print
        print(f" [MOCK EMAIL FALLBACK] To: {to_email} | OTP: {otp}")
        return False
