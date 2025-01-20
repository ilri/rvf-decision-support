from rest_framework.response import Response
from rest_framework import generics, status

# Response and Messages
from util.global_response import success_response

# All Serializers
from dashboard.serializers import RainfallSourceSerializer

# All services
from dashboard.services import DashboardServices


# Create your views here.

class RainfallSource(generics.GenericAPIView):
    serializer_class = RainfallSourceSerializer

    def get(self, request):
        try:
            if result := DashboardServices.get_rainfall_source_list():    
                success_response.update(result=result, code=status.HTTP_200_OK)

            else:
                success_response.update(result=[], code=status.HTTP_200_OK)
            return Response(success_response, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({"exception": str(error)}, status=status.HTTP_400_BAD_REQUEST)