from django.urls import path
from . import views


urlpatterns = [

    path(
        "triggers/",
        views.trigger_list,
        name="trigger-list"
    ),

    path(
        "templates/",
        views.template_list,
        name="template-list"
    ),

    path(
        "templates/<int:pk>/",
        views.template_detail,
        name="template-detail"
    ),

    path(
        "templates/<int:pk>/toggle/",
        views.toggle_template,
        name="template-toggle"
    ),

    path(
        "templates/<int:pk>/test/",
        views.test_template,
        name="template-test"
    ),

    path(
    "login/",
    views.login_view,
    name="login"
),

path(
    "logout/",
    views.logout_view,
    name="logout"
),
path(
    "save-onesignal-subscription/",
    views.save_onesignal_subscription,
    name="save-onesignal-subscription"
),
path(
    "csrf/",
    views.csrf_token_view,
    name="csrf-token"
),
]