from rest_framework.response import Response
from rest_framework import generics, status

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

# Response and Messages
from util.global_response import success_response, error_response

# All services
from dss.services import DecisionSupportServices

# Serializer
from dss.serializers import CategoryListSerializer


class Interventions(generics.GenericAPIView):
    serializer_class = CategoryListSerializer

    #Request Parameters
    epidemic_phase_id       = openapi.Parameter('epidemic_phase_id', in_=openapi.IN_QUERY, type=openapi.TYPE_STRING, required=True)
    event_id                = openapi.Parameter('event_id', in_=openapi.IN_QUERY, type=openapi.TYPE_STRING)
    sub_event_id            = openapi.Parameter('sub_event_id', in_=openapi.IN_QUERY, type=openapi.TYPE_STRING)
    category_id             = openapi.Parameter('category_id', in_=openapi.IN_QUERY, type=openapi.TYPE_STRING)
    activity_id             = openapi.Parameter('activity_id', in_=openapi.IN_QUERY, type=openapi.TYPE_STRING)


    @swagger_auto_schema(manual_parameters=[epidemic_phase_id, event_id, sub_event_id, category_id, activity_id])
    def get(self, request):
        try:
            if result := DecisionSupportServices.get_inrterventions(self, request):
                success_response.update(result=result, code=status.HTTP_200_OK)
            else:
                success_response.update(result=[], code=status.HTTP_200_OK)

            return Response(success_response, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({"exception": str(error)}, status=status.HTTP_400_BAD_REQUEST)