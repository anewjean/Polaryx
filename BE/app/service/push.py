import json
from typing import List, Dict
from pywebpush import webpush, WebPushException
from app.config.config import settings

subscribers: List[Dict] = []

def add_subscription(subscription: Dict):
    if subscription not in subscribers:
        subscribers.append(subscription)

def send_push(data: Dict):
    for sub in subscribers:
        try:
            webpush(
                subscription_info=sub,
                data=json.dumps(data),
                vapid_private_key=settings.VAPID_PRIVATE_KEY,
                vapid_claims={"sub": settings.VAPID_EMAIL},
            )
        except WebPushException as e:
            print("Web push error:", repr(e))