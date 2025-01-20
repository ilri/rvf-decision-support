#Generics
from rest_framework import generics, status
from rest_framework.response import Response

#Messages
from util.global_response import success_response, error_response
from util import messages

#Constants
from base import constants

#Serializers
from dashboard.serializers import MapSerializer

#Serices
from dashboard.services import AccumulatedRainfallService
from base.services import GEEServices
# from base.services import BaseServices

class AccumulatedRainfallMap(generics.GenericAPIView):
    
    serializer_class = MapSerializer
    
    def post(self, request):
        try:
            serializer = self.serializer_class(self, request.data)
            
            if serializer.is_valid():#Validation mentioned into Serializers
                
                clip_data = ""
                
                if clip_data := GEEServices.get_clip_data(self, request, 'no-geometry'):
                    try:
                        result = AccumulatedRainfallService.map(self, request, clip_data)
                        
                        #No rainfall
                        if result and result.get('map_data') and result['map_data']['min'] == 0 and result['map_data']['max'] == 0:
                            error_response.update(code = status.HTTP_400_BAD_REQUEST, message = messages.ERROR["NO_ACCUMULATED_RAIN_ERR"], errors = "")
                            return Response(error_response, status = status.HTTP_400_BAD_REQUEST) 
                        
                        
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

                error_response.update(code = status.HTTP_400_BAD_REQUEST, message = error, errors= "")
                return Response(error_response, status = status.HTTP_400_BAD_REQUEST) 

        except Exception as error:
            return Response({"exception": str(error)}, status=status.HTTP_400_BAD_REQUEST)
        