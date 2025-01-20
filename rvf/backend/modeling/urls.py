from django.urls import path

from modeling.views.forecasted_map import ForecastedMap



urlpatterns = [
    
    path('forcasted_map', ForecastedMap.as_view())
]