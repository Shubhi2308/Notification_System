from notifications.models import Trigger
from .whatsapp import send_whatsapp
from .email import send_email
from .webpush import send_web_push


def send_notification(trigger_name, user):
    """
    Find a trigger and send all enabled notification templates
    for that trigger.
    """

    try:
        trigger = Trigger.objects.get(
            name=trigger_name,
            is_active=True
        )
    except Trigger.DoesNotExist:
        return {
            "success": False,
            "message": f"Trigger '{trigger_name}' not found or inactive."
        }

    templates = trigger.templates.filter(
        is_active=True
    )

    results = []

    for template in templates:

        if template.channel == "WHATSAPP":
            result = send_whatsapp(
                user=user,
                message=template.body
            )

        elif template.channel == "EMAIL":
            result = send_email(
                user=user,
                subject=template.subject or template.title,
                body=template.body
            )

        elif template.channel == "WEB_PUSH":
            result = send_web_push(
                user=user,
                title=template.title,
                message=template.body
            )

        else:
            result = {
                "success": False,
                "message": f"Unsupported channel: {template.channel}"
            }

        results.append({
            "template_id": template.id,
            "channel": template.channel,
            "result": result
        })

    return {
        "success": True,
        "trigger": trigger.name,
        "results": results
    }