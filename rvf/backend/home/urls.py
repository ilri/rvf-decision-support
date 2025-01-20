from django.urls import path

from .views.general_tools import GeneralTools
from .views.general_banners import GeneralBanners

urlpatterns = [
    #General tools url
    path("general_tools",GeneralTools.as_view()),

    #General banners url
    path("general_banners",GeneralBanners.as_view())
]