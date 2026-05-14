import secrets
from datetime import datetime, timedelta

import jwt
from app.config.config import Config


def generate_password_reset_token(user_id):
    """
    Generate a secure password reset token for a user.
    
    Args:
        user_id: The user's ID
        
    Returns:
        A unique token string
    """
    token = secrets.token_urlsafe(32)
    return token


def generate_password_reset_jwt(user_id, expires_in_minutes=30):
    """
    Generate a JWT for password reset.
    
    Args:
        user_id: The user's ID
        expires_in_minutes: Token expiration time in minutes
        
    Returns:
        JWT token string
    """
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(minutes=expires_in_minutes),
        "type": "password_reset"
    }
    
    token = jwt.encode(
        payload,
        Config.JWT_SECRET_KEY,
        algorithm="HS256"
    )
    
    return token


def verify_password_reset_jwt(token):
    """
    Verify a password reset JWT token.
    
    Args:
        token: The JWT token string
        
    Returns:
        user_id if valid, None if invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            Config.JWT_SECRET_KEY,
            algorithms=["HS256"]
        )
        
        if payload.get("type") != "password_reset":
            return None
            
        return payload.get("user_id")
        
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
