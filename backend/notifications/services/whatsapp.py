import os
import requests


def send_whatsapp(user, message):

    access_token = os.getenv("WHATSAPP_ACCESS_TOKEN")
    phone_number_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
    api_version = os.getenv("WHATSAPP_API_VERSION", "v23.0")

    phone_number = getattr(
        getattr(user, "notification_profile", None),
        "phone_number",
        None
    )

    if not access_token or not phone_number_id:
        return {
            "success": False,
            "message": "WhatsApp credentials are not configured."
        }

    if not phone_number:
        return {
            "success": False,
            "message": "User does not have a WhatsApp phone number."
        }

    url = (
        f"https://graph.facebook.com/"
        f"{api_version}/"
        f"{phone_number_id}/messages"
    )

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    payload = {
        "messaging_product": "whatsapp",
        "to": phone_number,
        "type": "text",
        "text": {
            "body": message
        }
    }

    try:
        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=30
        )

        if response.ok:
            return {
                "success": True,
                "message": "WhatsApp notification sent.",
                "response": response.json()
            }

        return {
            "success": False,
            "message": "WhatsApp API returned an error.",
            "response": response.json()
        }

    except requests.RequestException as exc:
        return {
            "success": False,
            "message": str(exc)
        }