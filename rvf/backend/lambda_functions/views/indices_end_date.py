#From generics
from rest_framework import generics, status
from rest_framework.response import Response

#Messages
from util.global_response import success_response,error_response
from util import messages

#From serializer
from ..serializers import GeeIndicesSerializer


# Services
from ..services import GeeIndicesServices


class GeeIndices(generics.GenericAPIView):
    serializer_class = GeeIndicesSerializer

    def get(self,request):
        try:
            if GeeIndicesServices.get_dataset_end_dateand(self):
                success_response.update(result="Dataset end date has been updated successfully.",code=status.HTTP_200_OK)
                return Response(success_response, status = status.HTTP_200_OK)
            else:
                error_response.update(code=status.HTTP_400_BAD_REQUEST,message="error", errors="")
                return Response(error_response, status=status.HTTP_400_BAD_REQUEST) 
        except Exception as error:
            return Response ({"exception":str(error)},status=status.HTTP_400_BAD_REQUEST)
    
    def update_end_date_scheduler():
        try:
            # Calling gee dataset function
            GeeIndicesServices.get_dataset_end_dateand('')

        except Exception as error:
            return False