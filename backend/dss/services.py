from django.db.models import F, Q

# All models
from dss.models import Intervention
from dss.models import EpidemicPhase
from dss.models import Category

# Serializers
from dss.serializers import EpidemicPhaseSerializer
from dss.serializers import CategorySerializer

import pandas as pd

class DecisionSupportServices:

    def get_inrterventions(self, request):

        filter_conditions = Q() 
        if request.GET.get("epidemic_phase_id"):
            filter_conditions &= Q(epidemic_phase_id = request.GET.get("epidemic_phase_id"))
        if request.GET.get("event_id"):
            filter_conditions &= Q(event_id = request.GET.get("event_id"))
        if request.GET.get("category_id"):
            filter_conditions &= Q(category_id = request.GET.get("category_id"))
        if request.GET.get("activity_id"):
            filter_conditions &= Q(activity_id = request.GET.get("activity_id"))
        if request.GET.get("sub_event_id"):
            filter_conditions &= Q(sub_event_id = request.GET.get("sub_event_id"))

        result = Intervention.objects.filter(filter_conditions).values(
                    "id","human_health","animal_health", category_name = F("category__name"), activity_name=F("activity__name")
                    ).annotate(category_order=F("category__order"), activity_order= F("activity__order"))
        result = result.order_by("category_order", "activity_order")

        if result:
            df = pd.DataFrame(result)
            # First, group by 'category_name'
            grouped_by_category = df.groupby('category_name')

            nested_array = []

            for category, category_group in grouped_by_category:
                category_result = {
                    "category_name": category,
                    "activities": []
                }

                # Within each category, group by 'activity_name'
                grouped_by_activity = category_group.groupby('activity_name')

                for activity, activity_group in grouped_by_activity:
                    activity_result = {
                        "activity_name": activity,
                        "interventions": activity_group.to_dict('records')
                    }
                    category_result["activities"].append(activity_result)

                nested_array.append(category_result)

            result = nested_array

        return result
    
    def get_phases(self):

        result =  EpidemicPhaseSerializer(EpidemicPhase.objects.filter(status= True).order_by('order'), many =True)
        return result.data
    
    def get_category(self, request):

        filter_conditions = Q()
        if request.GET.get("epidemic_phase_id"):
            filter_conditions &= Q(epidemic_phase_id = request.GET.get("epidemic_phase_id"))
        if request.GET.get("event_id"):
            filter_conditions &= Q(event_id = request.GET.get("event_id"))
        if request.GET.get("sub_event_id"):
            filter_conditions &= Q(sub_event_id = request.GET.get("sub_event_id"))

        result = CategorySerializer(Category.objects.filter(filter_conditions, status= True).order_by('order'), many = True)

        return result.data