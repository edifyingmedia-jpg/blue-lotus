# Backend Security Engine - Secure API calls and protect sensitive data
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime, timezone
import uuid
import hashlib
import hmac
import base64
import re
import secrets


class SecurityLevel(str, Enum):
    PUBLIC = "public"  # No security
    BASIC = "basic"  # API key in header
    STANDARD = "standard"  # Bearer token + HTTPS
    HIGH = "high"  # Token rotation + request signing
    STRICT = "strict"  # All protections + rate limiting


class ThreatType(str, Enum):
    SQL_INJECTION = "sql_injection"
    XSS = "xss"
    CSRF = "csrf"
    SENSITIVE_DATA = "sensitive_data"
    INVALID_INPUT = "invalid_input"
    RATE_LIMIT = "rate_limit"


class SecurityConfig(BaseModel):
    """Security configuration for a connection."""
    config_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    connection_id: str
    security_level: SecurityLevel = SecurityLevel.STANDARD
    encrypt_stored_credentials: bool = True
    mask_sensitive_fields: List[str] = ["password", "token", "secret", "api_key", "credit_card"]
    allowed_domains: List[str] = []
    rate_limit_requests: int = 100  # Per minute
    rate_limit_window_ms: int = 60000
    enable_request_signing: bool = False
    signing_secret: Optional[str] = None


class SecurityThreat(BaseModel):
    """A detected security threat."""
    threat_id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    threat_type: ThreatType
    severity: str  # low, medium, high, critical
    description: str
    field_name: Optional[str] = None
    value_preview: Optional[str] = None
    blocked: bool = True


class SecurityScanResult(BaseModel):
    """Result of security scan."""
    is_safe: bool
    threats: List[SecurityThreat] = []
    sanitized_data: Optional[Dict[str, Any]] = None
    warnings: List[str] = []


class BackendSecurityEngine:
    """
    Backend Security Engine.
    
    Responsibilities:
    - Secure API calls
    - Protect tokens and credentials
    - Prevent injection attacks
    - Sanitize input/output
    - Rate limiting
    - Request signing
    """
    
    # Patterns for detecting potential attacks
    SQL_INJECTION_PATTERNS = [
        r"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b)",
        r"(--)|(;)",
        r"('|\").*(\bOR\b|\bAND\b).*('|\")",
        r"(\bEXEC\b|\bEXECUTE\b)",
    ]
    
    XSS_PATTERNS = [
        r"<script[^>]*>",
        r"javascript:",
        r"on\w+\s*=",
        r"<iframe",
        r"<object",
        r"<embed",
    ]
    
    SENSITIVE_PATTERNS = [
        r"\b\d{16}\b",  # Credit card numbers
        r"\b\d{3}-\d{2}-\d{4}\b",  # SSN
        r"password\s*[:=]",
        r"api[_-]?key\s*[:=]",
        r"secret\s*[:=]",
        r"token\s*[:=]",
    ]
    
    # Rate limit tracking
    _rate_limit_cache: Dict[str, List[datetime]] = {}
    
    @classmethod
    def scan_request(
        cls,
        data: Dict[str, Any],
        config: SecurityConfig
    ) -> SecurityScanResult:
        """Scan request data for security threats."""
        threats = []
        warnings = []
        
        # Recursively scan all string values
        def scan_value(value: Any, field_path: str = ""):
            if isinstance(value, str):
                # Check for SQL injection
                for pattern in cls.SQL_INJECTION_PATTERNS:
                    if re.search(pattern, value, re.IGNORECASE):
                        threats.append(SecurityThreat(
                            threat_type=ThreatType.SQL_INJECTION,
                            severity="high",
                            description="Potential SQL injection detected",
                            field_name=field_path,
                            value_preview=value[:50] + "..." if len(value) > 50 else value
                        ))
                        break
                
                # Check for XSS
                for pattern in cls.XSS_PATTERNS:
                    if re.search(pattern, value, re.IGNORECASE):
                        threats.append(SecurityThreat(
                            threat_type=ThreatType.XSS,
                            severity="high",
                            description="Potential XSS attack detected",
                            field_name=field_path,
                            value_preview=value[:50] + "..." if len(value) > 50 else value
                        ))
                        break
                
                # Check for sensitive data exposure
                if config.security_level in [SecurityLevel.HIGH, SecurityLevel.STRICT]:
                    for pattern in cls.SENSITIVE_PATTERNS:
                        if re.search(pattern, value, re.IGNORECASE):
                            warnings.append(f"Potential sensitive data in field: {field_path}")
                            break
            
            elif isinstance(value, dict):
                for k, v in value.items():
                    scan_value(v, f"{field_path}.{k}" if field_path else k)
            
            elif isinstance(value, list):
                for i, item in enumerate(value):
                    scan_value(item, f"{field_path}[{i}]")
        
        scan_value(data)
        
        # Sanitize data if threats found
        sanitized = cls.sanitize_data(data) if threats else data
        
        return SecurityScanResult(
            is_safe=len(threats) == 0,
            threats=threats,
            sanitized_data=sanitized,
            warnings=warnings
        )
    
    @classmethod
    def sanitize_data(cls, data: Dict[str, Any]) -> Dict[str, Any]:
        """Sanitize data by removing potentially dangerous content."""
        import html
        
        def sanitize_value(value: Any) -> Any:
            if isinstance(value, str):
                # HTML encode
                sanitized = html.escape(value)
                # Remove script tags
                sanitized = re.sub(r"<script[^>]*>.*?</script>", "", sanitized, flags=re.IGNORECASE | re.DOTALL)
                # Remove javascript: protocol
                sanitized = re.sub(r"javascript:", "", sanitized, flags=re.IGNORECASE)
                # Remove event handlers
                sanitized = re.sub(r"\bon\w+\s*=", "", sanitized, flags=re.IGNORECASE)
                return sanitized
            elif isinstance(value, dict):
                return {k: sanitize_value(v) for k, v in value.items()}
            elif isinstance(value, list):
                return [sanitize_value(item) for item in value]
            return value
        
        return sanitize_value(data)
    
    @classmethod
    def mask_sensitive_data(
        cls,
        data: Dict[str, Any],
        sensitive_fields: List[str]
    ) -> Dict[str, Any]:
        """Mask sensitive fields in data for logging/display."""
        def mask_value(value: Any, field_name: str = "") -> Any:
            if isinstance(value, str):
                field_lower = field_name.lower()
                for sensitive in sensitive_fields:
                    if sensitive.lower() in field_lower:
                        return "***MASKED***"
                return value
            elif isinstance(value, dict):
                return {k: mask_value(v, k) for k, v in value.items()}
            elif isinstance(value, list):
                return [mask_value(item, field_name) for item in value]
            return value
        
        return mask_value(data)
    
    @classmethod
    def encrypt_credential(cls, credential: str, encryption_key: str) -> str:
        """Encrypt a credential for storage."""
        # Simple encryption using HMAC - in production use proper encryption
        key_bytes = encryption_key.encode()
        credential_bytes = credential.encode()
        
        # Create HMAC signature
        signature = hmac.new(key_bytes, credential_bytes, hashlib.sha256).digest()
        
        # XOR encrypt (simple obfuscation)
        encrypted = bytes(a ^ b for a, b in zip(credential_bytes, signature * (len(credential_bytes) // 32 + 1)))
        
        return base64.b64encode(encrypted).decode()
    
    @classmethod
    def check_rate_limit(
        cls,
        identifier: str,
        config: SecurityConfig
    ) -> tuple[bool, int]:
        """Check if request is within rate limit. Returns (allowed, remaining)."""
        now = datetime.now(timezone.utc)
        window_start = now.timestamp() - (config.rate_limit_window_ms / 1000)
        
        # Get request history
        if identifier not in cls._rate_limit_cache:
            cls._rate_limit_cache[identifier] = []
        
        # Clean old entries
        cls._rate_limit_cache[identifier] = [
            ts for ts in cls._rate_limit_cache[identifier]
            if ts.timestamp() > window_start
        ]
        
        current_count = len(cls._rate_limit_cache[identifier])
        remaining = config.rate_limit_requests - current_count
        
        if current_count >= config.rate_limit_requests:
            return False, 0
        
        # Record this request
        cls._rate_limit_cache[identifier].append(now)
        
        return True, remaining - 1
    
    @classmethod
    def sign_request(
        cls,
        method: str,
        url: str,
        body: Optional[str],
        secret: str,
        timestamp: Optional[str] = None
    ) -> Dict[str, str]:
        """Sign a request for verification."""
        ts = timestamp or str(int(datetime.now(timezone.utc).timestamp()))
        
        # Create signature payload
        payload = f"{method}:{url}:{ts}:{body or ''}"
        
        # Generate signature
        signature = hmac.new(
            secret.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return {
            "X-Signature": signature,
            "X-Timestamp": ts,
            "X-Signature-Algorithm": "HMAC-SHA256"
        }
    
    @classmethod
    def verify_signature(
        cls,
        method: str,
        url: str,
        body: Optional[str],
        secret: str,
        signature: str,
        timestamp: str,
        max_age_seconds: int = 300
    ) -> bool:
        """Verify a request signature."""
        # Check timestamp is recent
        try:
            ts = int(timestamp)
            now = int(datetime.now(timezone.utc).timestamp())
            if abs(now - ts) > max_age_seconds:
                return False
        except:
            return False
        
        # Verify signature
        expected = cls.sign_request(method, url, body, secret, timestamp)
        return hmac.compare_digest(expected["X-Signature"], signature)
    
    @classmethod
    def generate_secure_token(cls, length: int = 32) -> str:
        """Generate a cryptographically secure random token."""
        return secrets.token_urlsafe(length)
    
    @classmethod
    def validate_domain(cls, url: str, allowed_domains: List[str]) -> bool:
        """Validate URL against allowed domains."""
        if not allowed_domains:
            return True
        
        from urllib.parse import urlparse
        parsed = urlparse(url)
        domain = parsed.netloc.lower()
        
        for allowed in allowed_domains:
            allowed = allowed.lower()
            if domain == allowed or domain.endswith(f".{allowed}"):
                return True
        
        return False
    
    @classmethod
    def get_security_recommendations(cls, config: SecurityConfig) -> List[str]:
        """Get security recommendations based on config."""
        recommendations = []
        
        if config.security_level == SecurityLevel.PUBLIC:
            recommendations.append("Consider adding API key authentication")
        
        if not config.encrypt_stored_credentials:
            recommendations.append("Enable credential encryption for stored API keys")
        
        if not config.allowed_domains:
            recommendations.append("Configure allowed domains to prevent SSRF attacks")
        
        if config.rate_limit_requests > 1000:
            recommendations.append("Consider lowering rate limits to prevent abuse")
        
        if config.security_level in [SecurityLevel.HIGH, SecurityLevel.STRICT]:
            if not config.enable_request_signing:
                recommendations.append("Enable request signing for HIGH/STRICT security")
        
        return recommendations
