from django.urls import path

from location.views.location import Location

urlpatterns = [
    path("get-location",Location.as_view())
]