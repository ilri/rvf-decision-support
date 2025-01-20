from rest_framework.response import Response
from rest_framework import generics, status

# Response and Messages
from util.global_response import success_response, error_response

# Services
from dss.services import DecisionSupportServices

# Serializer
from dss.serializers import CategoryListSerializer

class PhasesList(generics.GenericAPIView):
    serializer_class = CategoryListSerializer

    def get(self, request):

        try:
            if result := DecisionSupportServices.get_phases(self):
                success_response.update(result=result, code=status.HTTP_200_OK)
            else:
                success_response.update(result=[], code=status.HTTP_200_OK)

            return Response(success_response, status=status.HTTP_200_OK)

        except Exception as error:
            return Response({"exception": str(error)}, status=status.HTTP_400_BAD_REQUEST)