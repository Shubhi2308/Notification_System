import os
import requests


def send_web_push(user, title, message):
    app_id = os.getenv("ONESIGNAL_APP_ID")
    api_key = os.getenv("ONESIGNAL_REST_API_KEY")

    player_id = getattr(
        getattr(user, "notification_profile", None),
        "onesignal_player_id",
        None
    )

    if not app_id or not api_key:
        return {
            "success": False,
            "message": "OneSignal credentials are not configured."
        }

    if not player_id:
        return {
            "success": False,
            "message": "User does not have a Web Push subscription."
        }

    url = "https://api.onesignal.com/notifications"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Key {api_key}",
    }

    payload = {
        "app_id": app_id,
        "include_subscription_ids": [player_id],
        "headings": {
            "en": title or "Notification"
        },
        "contents": {
            "en": message
        }
    }

    try:
        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=30
        )

        data = response.json()

        if response.ok:
            return {
                "success": True,
                "message": "Web Push notification sent.",
                "response": data
            }

        return {
            "success": False,
            "message": "OneSignal returned an error.",
            "response": data
        }

    except requests.RequestException as exc:
        return {
            "success": False,
            "message": str(exc)
        }