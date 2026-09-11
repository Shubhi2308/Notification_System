from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import AllowAny
from django.middleware.csrf import get_token

# Create your views here.
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Trigger, NotificationTemplate, NotificationProfile
from .serializers import (
    TriggerSerializer,
    NotificationTemplateSerializer,
)
from .services.dispatcher import send_notification

# --------------------------------------------------
# TRIGGER APIs
# --------------------------------------------------

@api_view(["GET", "POST"])
def trigger_list(request):

    # GET /api/triggers/
    if request.method == "GET":
        triggers = Trigger.objects.all().order_by("-created_at")

        serializer = TriggerSerializer(
            triggers,
            many=True
        )

        return Response(serializer.data)

    # POST /api/triggers/
    if request.method == "POST":
        serializer = TriggerSerializer(
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# --------------------------------------------------
# TEMPLATE APIs
# --------------------------------------------------

@api_view(["GET", "POST"])
def template_list(request):

    # GET /api/templates/
    if request.method == "GET":
        templates = NotificationTemplate.objects.all().order_by(
            "-created_at"
        )

        serializer = NotificationTemplateSerializer(
            templates,
            many=True
        )

        return Response(serializer.data)

    # POST /api/templates/
    if request.method == "POST":
        serializer = NotificationTemplateSerializer(
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# --------------------------------------------------
# UPDATE TEMPLATE
# --------------------------------------------------

@api_view(["PUT"])
def template_detail(request, pk):

    try:
        template = NotificationTemplate.objects.get(pk=pk)

    except NotificationTemplate.DoesNotExist:
        return Response(
            {"error": "Template not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = NotificationTemplateSerializer(
        template,
        data=request.data
    )

    if serializer.is_valid():
        serializer.save()

        return Response(serializer.data)

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# --------------------------------------------------
# TOGGLE TEMPLATE
# --------------------------------------------------

@api_view(["PATCH"])
def toggle_template(request, pk):

    try:
        template = NotificationTemplate.objects.get(pk=pk)

    except NotificationTemplate.DoesNotExist:
        return Response(
            {"error": "Template not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    template.is_active = not template.is_active
    template.save()

    serializer = NotificationTemplateSerializer(template)

    return Response(serializer.data)


# --------------------------------------------------
# TEST TEMPLATE
# --------------------------------------------------

@api_view(["POST"])
def test_template(request, pk):

    try:
        template = NotificationTemplate.objects.get(pk=pk)

    except NotificationTemplate.DoesNotExist:
        return Response(
            {"error": "Template not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response({
        "message": "Test notification successful",
        "template_id": template.id,
        "channel": template.channel,
        "body": template.body,
    })

@api_view(["POST"])
def login_view(request):

    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {
                "error": "Email and password are required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        from django.contrib.auth.models import User

        user = User.objects.get(email=email)

    except User.DoesNotExist:
        return Response(
            {
                "error": "Invalid email or password."
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    authenticated_user = authenticate(
        username=user.username,
        password=password
    )

    if authenticated_user is None:
        return Response(
            {
                "error": "Invalid email or password."
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    login(request, authenticated_user)

    notification_result = send_notification(
        "LOGIN",
        authenticated_user
    )

    return Response({
        "message": "Login successful",
        "user": {
            "id": authenticated_user.id,
            "username": authenticated_user.username,
            "email": authenticated_user.email
        },
        "notification": notification_result
    })

@api_view(["POST"])
def logout_view(request):

    user = request.user

    if not user.is_authenticated:
        return Response(
            {
                "error": "User is not logged in."
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    notification_result = send_notification(
        "LOGOUT",
        user
    )

    logout(request)

    return Response({
        "message": "Logout successful",
        "notification": notification_result
    })
@api_view(["POST"])
def save_onesignal_subscription(request):
    if not request.user.is_authenticated:
        return Response(
            {
                "error": "User is not logged in."
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    subscription_id = request.data.get("subscription_id")

    if not subscription_id:
        return Response(
            {
                "error": "subscription_id is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    profile, created = NotificationProfile.objects.get_or_create(
        user=request.user
    )

    profile.onesignal_player_id = subscription_id
    profile.save()

    return Response({
        "success": True,
        "message": "OneSignal subscription saved.",
        "subscription_id": subscription_id
    })
@api_view(["GET"])
def csrf_token_view(request):
    return Response({
        "csrfToken": get_token(request)
    })