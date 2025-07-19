
from fastapi import Request
from app.core.security import verify_token_and_get_token_data


def get_current_user(request: Request) -> dict:
    """Return the token data for the current request."""
    return verify_token_and_get_token_data(request)