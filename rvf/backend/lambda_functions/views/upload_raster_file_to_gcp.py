#From generics
from rest_framework import generics, status
from rest_framework.response import Response

#Messages
from util.global_response import success_response,error_response
from util import messages

#From serializer
from ..serializers import GeeIndicesSerializer

from lambda_functions.services import ModelingServices


class UploadRasterFileToGCP(generics.GenericAPIView):
    serializer_class = GeeIndicesSerializer

    def get(self,request):
        try:
            if ModelingServices.predicted_raster(self): 
                success_response.update(result=messages.SUCCESS['UPLOAD_RASTER'],code=status.HTTP_200_OK)
                return Response(success_response, status = status.HTTP_200_OK)
            else:
                error_response.update(code=status.HTTP_400_BAD_REQUEST,message="error", errors="")
                return Response(error_response, status=status.HTTP_400_BAD_REQUEST) 
        except Exception as error:
            return Response ({"exception":str(error)},status=status.HTTP_400_BAD_REQUEST)
        
        
    def upload_forecasted_raster_file():
        try:
            # Calling gee dataset function
            ModelingServices.predicted_raster('')

        except Exception as error:
            return False