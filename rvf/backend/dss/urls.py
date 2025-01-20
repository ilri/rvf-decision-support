from django.urls import path

# Views
from .views.get_interventions import Interventions
from .views.phase_list import PhasesList
from .views.category_list import CategoryList

urlpatterns = [
    # Interventions url
    path("get_interventions",Interventions.as_view()),

    # phase, events, sub_events url
    path("epidemic_phase_list", PhasesList.as_view()),

    # category, activity url
    path("category_list", CategoryList.as_view()),

]