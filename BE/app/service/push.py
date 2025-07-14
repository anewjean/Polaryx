import json
from typing import Dict, List
import uuid
from pywebpush import webpush, WebPushException

from app.config.config import settings
from app.repository.push_subscription import QueryRepo as PushRepo

class PushService:
    def __init__(self):
        self.repo = PushRepo()

    def add_subscription(self, user_id: str, subscription: Dict):
        data = {
            "user_id": uuid.UUID(user_id).bytes,
            "endpoint": subscription.get("endpoint"),
            "p256dh": subscription.get("keys", {}).get("p256dh"),
            "auth": subscription.get("keys", {}).get("auth"),
        }
        print("[add_subscription]저장할 구독 정보:", data)
        self.repo.insert(data)

    def _send_to_subs(self, subs: List[Dict], data: Dict):
        for sub in subs:
            if isinstance(sub, tuple):
                endpoint, p256dh, auth = sub
            else:
                endpoint = sub.get("endpoint")
                p256dh = sub.get("p256dh")
                auth = sub.get("auth")

            info = {
                "endpoint": endpoint,
                "keys": {
                    "p256dh": p256dh,
                    "auth": auth,
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
                  

    def send_push_to(self, user_ids: List[str], data: Dict):
        for user_id in user_ids:
            subs: List[Dict] = self.repo.find_user(uuid.UUID(user_id).bytes)
            self._send_to_subs(subs, data)
