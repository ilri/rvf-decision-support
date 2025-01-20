from django.urls import path

# Views
from .views.noaa_timeseries import NoaaTimeseries

urlpatterns = [
    # GFS-NoaaTimeseries url
    path("noaa/timeseries",NoaaTimeseries.as_view()),

]