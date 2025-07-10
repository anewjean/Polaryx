import json
from typing import Dict, List
import uuid
from pywebpush import webpush, WebPushException

from app.config.config import settings
from app.repository.push_subscription import QueryRepo as PushRepo

repo = PushRepo()

def add_subscription(user_id: str, subscription: Dict):
    data = {
        "user_id": uuid.UUID(user_id).bytes,
        "endpoint": subscription.get("endpoint"),
        "p256dh": subscription.get("keys", {}).get("p256dh"),
        "auth": subscription.get("keys", {}).get("auth"),
    }
    repo.insert(data)

def _send_to_subs(subs: List[Dict], data: Dict):
    for sub in subs:
        info = {
            "endpoint": sub["endpoint"],
            "keys": {
                "p256dh": sub["p256dh"],
                "auth": sub["auth"],
            },
        }
        try:
            webpush(
                subscription_info=info,
                data=json.dumps(data),
                vapid_private_key=settings.VAPID_PRIVATE_KEY,
                vapid_claims={"sub": settings.VAPID_EMAIL},
            )
        except WebPushException as e:
            print("Web push error:", repr(e))


def send_push_to(user_ids: List[str], data: Dict):
    for user_id in user_ids:
        subs: List[Dict] = repo.find_user(uuid.UUID(user_id).bytes)
        _send_to_subs(subs, data)
