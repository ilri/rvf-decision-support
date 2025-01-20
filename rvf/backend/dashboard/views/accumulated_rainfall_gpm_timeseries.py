#From generics
from rest_framework import generics, status
from rest_framework.response import Response
import os
import json

#Messages
from util.global_response import success_response, error_response
from util import messages

#Constants
from base import constants 

#Serializers
from dashboard.serializers import TimeseriesSerializer

#From serices.py
from dashboard.services import AccumulatedRainfallService, DashboardServices
from base.services import GEEServices


class AccumulatedRainfallTimeseries(generics.GenericAPIView):
    serializer_class = TimeseriesSerializer
    
    def post(self, request):
        try:
            serializer = self.serializer_class(self, request.data)

            if serializer.is_valid():#Validation mentioned into Serializers
                
                clip_data = ""

                if clip_data := GEEServices.get_clip_data(self, request, 'geometry'):
                    try:
                        # Feting result from json files
                        file_path = f"{constants.GPM_IRI_STATIC_RESPONSE}/gpm_{request.data.get('end_date')}.json"
                        if os.path.exists(file_path) and not request.data.get('adm1_name'):
                            # Open the file and load its contents
                            with open(file_path, 'r') as file:
                                result = json.load(file)
                                success_response.update(result, code = status.HTTP_200_OK)
                                return Response(success_response, status = status.HTTP_200_OK)
                        else:
                            result = AccumulatedRainfallService.timeseries(self, request, clip_data)
                            #No Acc rainfall
                            if  not result: 
                                error_response.update(code = status.HTTP_400_BAD_REQUEST, message = messages.ERROR["NO_ACCUMULATED_RAIN_ERR"], errors = "")
                                return Response(error_response, status = status.HTTP_400_BAD_REQUEST) 
                            
                            result = {'graph_data': result}
                            
                            success_response.update(result = result, code = status.HTTP_200_OK)
                            return Response(success_response, status = status.HTTP_200_OK)

                    except Exception as error:
                        # error_response.update(code = status.HTTP_400_BAD_REQUEST, message = f"{indice_data.name} " + (messages.ERROR["EMPTY_DATA"]).lower(), errors = "")
                        error_response.update(code = status.HTTP_400_BAD_REQUEST, message = (messages.ERROR["EMPTY_TIMESERIES_DATA"]), errors = "")
                        return Response(error_response, status = status.HTTP_400_BAD_REQUEST)                             

                else:
                    error_response.update(code = status.HTTP_400_BAD_REQUEST, message = messages.ERROR["CHOOSE_LOCATION_TIMESERIES"], errors="")
                    return Response(error_response, status = status.HTTP_400_BAD_REQUEST) 

            else:
                #Only One Error shoule be shown at a time.
                error, *_ = serializer.errors.values()
                error = error[0] if error else ""

                error_response.update(code = status.HTTP_400_BAD_REQUEST, message = error, errors= "")
                return Response(error_response, status = status.HTTP_400_BAD_REQUEST) 

        except Exception as error:
            return Response({"exception": str(error)}, status=status.HTTP_400_BAD_REQUEST)