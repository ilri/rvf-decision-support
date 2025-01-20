from rest_framework.response import Response
from rest_framework import generics, status

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

# Response and Messages
from util.global_response import success_response, error_response

# All Serializers
from dashboard.serializers import RainfallSourceSerializer

# All services
from dashboard.services import DashboardServices

# Messages
from util import messages


# Create your views here.

class RVFCases(generics.GenericAPIView):
    serializer_class = RainfallSourceSerializer

    #Request Parameters
    country_id       = openapi.Parameter('country_id', in_=openapi.IN_QUERY, type=openapi.TYPE_STRING, required=True)
    county_id       = openapi.Parameter('county_id', in_=openapi.IN_QUERY, type=openapi.TYPE_STRING)
    sub_county_id   = openapi.Parameter('sub_county_id', in_=openapi.IN_QUERY, type=openapi.TYPE_STRING)
    year            = openapi.Parameter('year', in_=openapi.IN_QUERY, type=openapi.TYPE_INTEGER, required=True)
    month           = openapi.Parameter('month', in_=openapi.IN_QUERY, type=openapi.TYPE_INTEGER)
    type            = openapi.Parameter('type', in_=openapi.IN_QUERY, type=openapi.TYPE_STRING, required=True)


    @swagger_auto_schema(manual_parameters=[country_id, county_id, sub_county_id, year, month, type])
    def get(self, request):
        try:
            TYPE_LIST = ["graph", "map"]
            if request.GET.get("type") not in TYPE_LIST:
                error_response.update(code = status.HTTP_400_BAD_REQUEST, message = messages.ERROR["RVF_CASE_TYPE_ERROR"].format(TYPE_LIST), errors = "")
                return Response(error_response, status = status.HTTP_400_BAD_REQUEST) 
                    
            if result := DashboardServices.get_rvf_cases(self, request):    
                success_response.update(result=result, code=status.HTTP_200_OK)

            else:
                success_response.update(result=[], code=status.HTTP_200_OK)
            return Response(success_response, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({"exception": str(error)}, status=status.HTTP_400_BAD_REQUEST)