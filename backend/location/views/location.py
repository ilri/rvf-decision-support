from rest_framework import generics, status
from rest_framework.response import Response
from django.apps import apps

# Response and Messages
from util.global_response import success_response, error_response
from util import messages

# All serializers
from location.serializers import LocationSerializer

# All Services
from location.services import LocationService


class Location(generics.GenericAPIView):
    serializer_class = LocationSerializer

    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data)
            if serializer.is_valid():

                if request.data['location_type']:
                    requested_model = apps.get_model(
                        "location", request.data['location_type'])

                    if result := LocationService.get_location_by_type(self, requested_model, request.data.get('parent_id', None)):
                        success_response.update(
                            result=result, code=status.HTTP_200_OK)
                    else:
                        success_response.update(
                            result=[], code=status.HTTP_200_OK)
                    return Response(success_response, status=status.HTTP_200_OK)
                else:
                    error_response.update(
                        code=status.HTTP_400_BAD_REQUEST,
                        message=messages.ERROR["LOCATION_TYPE_MANDATORY"],
                    )
                    return Response(error_response, status=status.HTTP_400_BAD_REQUEST)

            else:
                error_response.update(code=status.HTTP_400_BAD_REQUEST,
                                      message=messages.ERROR['FORM_ERROR'], errors=serializer.errors)
                return Response(error_response, status=status.HTTP_400_BAD_REQUEST)

        except Exception as error:
            return Response({"exception": error}, status=status.HTTP_400_BAD_REQUEST)
