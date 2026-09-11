import os
import requests


def send_email(user, subject, message):
    token = os.getenv("POSTMARK_SERVER_TOKEN")
    from_email = os.getenv("POSTMARK_FROM_EMAIL")

    to_email = getattr(user, "email", None)

    if not token or not from_email:
        return {
            "success": False,
            "message": "Postmark credentials are not configured."
        }

    if not to_email:
        return {
            "success": False,
            "message": "User does not have an email address."
        }

    url = "https://api.postmarkapp.com/email"

    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": token,
    }

    payload = {
        "From": from_email,
        "To": to_email,
        "Subject": subject,
        "TextBody": message,
    }

    try:
        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=30,
        )

        if response.ok:
            return {
                "success": True,
                "message": "Email notification sent.",
                "response": response.json(),
            }

        return {
            "success": False,
            "message": "Postmark returned an error.",
            "response": response.json(),
        }

    except requests.RequestException as exc:
        return {
            "success": False,
            "message": str(exc),
        }