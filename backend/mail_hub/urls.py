from django.urls import path

# Mail Hub
from mail_hub.views.email_group_list import EmailGroupList

urlpatterns = [
    path("email_group/list", EmailGroupList.as_view())
]