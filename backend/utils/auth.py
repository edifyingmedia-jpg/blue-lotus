# Authentication utilities
import os
import hashlib
import secrets
from datetime import datetime, timezone, timedelta
from typing import Optional
import jwt

# Secret key for JWT - in production, use environment variable
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", secrets.token_hex(32))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24 * 7  # 7 days


def hash_password(password: str) -> str:
    """Hash password using SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash."""
    return hash_password(plain_password) == hashed_password


def create_access_token(user_id: str, email: str) -> str:
    """Create JWT access token."""
    expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    payload = {
        "sub": user_id,
        "email": email,
        "exp": expire,
        "iat": datetime.now(timezone.utc)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and verify JWT access token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
