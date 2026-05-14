from datetime import datetime, timedelta
from app.extensions.extensions import bcrypt, db
from app.models.user import User
from app.utils.token_generator import generate_password_reset_token, generate_password_reset_jwt, verify_password_reset_jwt
from app.services.email_service import send_password_reset_email


def hash_password(password):
    return bcrypt.generate_password_hash(password).decode("utf-8")


def verify_password(hashed_password, password):
    return bcrypt.check_password_hash(hashed_password, password)


def request_password_reset(email):
    try:
        user = User.query.filter_by(email=email).first()
        if not user:
            return True, "If the email exists, a reset link will be sent"
        reset_token = generate_password_reset_jwt(str(user.id))
        user.reset_password_token = reset_token
        user.reset_password_expires = datetime.utcnow() + timedelta(minutes=30)
        db.session.commit()
        email_sent = send_password_reset_email(email, reset_token)
        if not email_sent:
            return True, f"Email failed. Use this token to reset: {reset_token}"
        return True, "If the email exists, a reset link will be sent"
    except Exception as e:
        db.session.rollback()
        print(f"Error in request_password_reset: {str(e)}")
        return True, "If the email exists, a reset link will be sent"


def reset_password(token, new_password):
    try:
        user_id = verify_password_reset_jwt(token)
        if not user_id:
            return False, "Invalid or expired token"
        user = User.query.get(int(user_id))
        if not user:
            return False, "Invalid or expired token"
        if user.reset_password_token != token:
            return False, "Invalid or expired token"
        if user.reset_password_expires < datetime.utcnow():
            return False, "Token has expired"
        user.password_hash = hash_password(new_password)
        user.reset_password_token = None
        user.reset_password_expires = None
        db.session.commit()
        return True, "Password reset successfully"
    except Exception as e:
        db.session.rollback()
        print(f"Error in reset_password: {str(e)}")
        return False, "Failed to reset password. Please try again."
