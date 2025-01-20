#From generics
from rest_framework import generics, status
from rest_framework.response import Response

#Froom google earth engine
import ee 

#Messages
from util.global_response import success_response, error_response
from util import messages

#Constants
from base import constants

#Serializers
from dashboard.serializers import MapSerializer

#From serices.py
from dashboard.services import AccumulatedRainfallChirpsService
from base.services import GEEServices
# from base.services import BaseServices

class AccumulatedRainfallChirpsTiff(generics.GenericAPIView):
    
    serializer_class = MapSerializer
    
    def post(self, request):
        try:
            serializer = self.serializer_class(self, request.data)

            if serializer.is_valid():#Validation mentioned into Serializers
                
                clip_data = ""

                if clip_data := GEEServices.get_clip_data(self, request, 'geometry'):
                    try:
                        if result := AccumulatedRainfallChirpsService.tiff(self, request, clip_data):
                        
                            success_response.update(result = result, code = status.HTTP_200_OK)
                            return Response(success_response, status = status.HTTP_200_OK)  

                    except Exception as error:
                        # error_response.update(code = status.HTTP_400_BAD_REQUEST, message = f"{indice_data.name} " + (messages.ERROR["EMPTY_DATA"]).lower(), errors = "")
                        error_response.update(code = status.HTTP_400_BAD_REQUEST, message = (messages.ERROR["EMPTY_MAP_DATA"]), errors = "")
                        return Response(error_response, status = status.HTTP_400_BAD_REQUEST) 

                else:
                    error_response.update(code = status.HTTP_400_BAD_REQUEST, message = messages.ERROR["CHOOSE_LOCATION_TIMESERIES"], errors = "")
                    return Response(error_response, status = status.HTTP_400_BAD_REQUEST) 

            else:
                #Only One Error shoule be shown at a time.
                error, *_ = serializer.errors.values()
                error = error[0] if error else ""

                error_response.update(code = status.HTTP_400_BAD_REQUEST, message = error,  errors= "")
                return Response(error_response, status = status.HTTP_400_BAD_REQUEST) 

        except Exception as error:
            return Response({"exception": str(error)}, status=status.HTTP_400_BAD_REQUEST)