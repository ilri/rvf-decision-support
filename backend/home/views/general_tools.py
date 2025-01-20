from rest_framework.response import Response
from rest_framework import generics, status

# Response and Messages
from util.global_response import success_response

# All Serializers
from home.serializers import GeneralToolsSerializer

# All services
from home.services import HomeServices

from django.templatetags.static import static

# constants
from base import constants

# Create your views here.


class GeneralTools(generics.GenericAPIView):
    serializer_class = GeneralToolsSerializer

    def get(self, request):
        try:
            if result := HomeServices.get_general_tool_list():
                for val in result:
                    val["icon"] = constants.GENERAL_TOOLS_ICON_URL_PATH + val["icon"]
                    
                success_response.update(result=result, code=status.HTTP_200_OK)

            else:
                success_response.update(result=[], code=status.HTTP_200_OK)
            return Response(success_response, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({"exception": str(error)}, status=status.HTTP_400_BAD_REQUEST)
