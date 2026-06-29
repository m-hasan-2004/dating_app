import os
from datetime import timedelta


def _parse_minutes(value: str, default: int) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


ACCESS_TOKEN_LIFETIME_MINUTES = _parse_minutes(
    os.getenv("ACCESS_TOKEN_LIFETIME_MINUTES"), 15
)

REFRESH_TOKEN_LIFETIME_DAYS = _parse_minutes(
    os.getenv("REFRESH_TOKEN_LIFETIME_DAYS"), 7
)

ACCESS_TOKEN_LIFETIME = timedelta(minutes=ACCESS_TOKEN_LIFETIME_MINUTES)
REFRESH_TOKEN_LIFETIME = timedelta(days=REFRESH_TOKEN_LIFETIME_DAYS)

JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
