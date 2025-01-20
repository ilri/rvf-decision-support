from rest_framework.response import Response
from rest_framework import generics, status


# Response and Messages
from util.global_response import success_response, error_response

# All Serializers
from dashboard.serializers import RainfallSourceSerializer


# Services
from ..services import LambdaServices


# Create your views here.

class StoreGPMIRIADM1(generics.GenericAPIView):
    serializer_class = RainfallSourceSerializer
    
    def get(self, request):
        try:
            if LambdaServices.store_gpm_iri_data(self):
                success_response.update(result='DONE', code=status.HTTP_200_OK)
            else:
                success_response.update(result=[], code=status.HTTP_200_OK)
            return Response(success_response, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({"exception": str(error)}, status=status.HTTP_400_BAD_REQUEST)
        
        
    def scheduler_store_gpm_iri_data():
        try:
            # Calling gee dataset function
            LambdaServices.store_gpm_iri_data('')

        except Exception as error:
            return False