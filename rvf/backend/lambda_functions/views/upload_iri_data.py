#From generics
from rest_framework import generics, status
from rest_framework.response import Response

#Messages
from util.global_response import success_response,error_response
from util import messages

#From serializer
from ..serializers import GeeIndicesSerializer


# Services
from ..services import LambdaServices


class UploadIRIData(generics.GenericAPIView):
    serializer_class = GeeIndicesSerializer

    def get(self,request):
        try:
            if LambdaServices.upload_iri_data(self):
                success_response.update(result="IRI data has been updated successfully.",code=status.HTTP_200_OK)
                return Response(success_response, status = status.HTTP_200_OK)
            else:
                error_response.update(code=status.HTTP_400_BAD_REQUEST,message="error", errors="")
                return Response(error_response, status=status.HTTP_400_BAD_REQUEST) 
        except Exception as error:
            return Response ({"exception":str(error)},status=status.HTTP_400_BAD_REQUEST)
        
    def scheduler_upload_iri_data():
        try:
            # Calling gee dataset function
            LambdaServices.upload_iri_data('')

        except Exception as error:
            return False
    