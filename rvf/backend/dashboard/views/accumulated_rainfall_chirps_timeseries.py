#From generics
from rest_framework import generics, status
from rest_framework.response import Response

#Messages
from util.global_response import success_response, error_response
from util import messages

#Constants
from base import constants

#Serializers
from dashboard.serializers import TimeseriesSerializer

#From serices.py
from dashboard.services import AccumulatedRainfallChirpsService,DashboardServices, AccumulatedRainfallService, RainfallCHIRPSStatic
from base.services import GEEServices
# from base.services import 
import os
import json
from datetime import datetime
from dateutil.relativedelta import relativedelta


class AccumulatedRainfallChirpsTimeseries(generics.GenericAPIView):
    serializer_class = TimeseriesSerializer
    
    def post(self, request):
        try:
            serializer = self.serializer_class(self, request.data)

            if serializer.is_valid():#Validation mentioned into Serializers
                
                clip_data = ""

                if clip_data := GEEServices.get_clip_data(self, request, 'geometry'):
                    try:
                        # date_1 = datetime.strptime(request.data['end_date'], '%Y-%m-%d')
                        # date_2 = date_1 + relativedelta(months=1)
                        # dates = [date_1, date_2]
                        
                        # Example inputs
                        dataset_end_date = datetime.strptime('2024-07-01', '%Y-%m-%d')
                        
                        
                        date_1 = datetime.strptime(request.data['end_date'], '%Y-%m-%d')
                        date_1 = date_1 + relativedelta(months=1) # 1 month forecast

                        # Calculate the difference in months
                        months_diff = (date_1.year - dataset_end_date.year) * 12 + (date_1.month - dataset_end_date.month)

                        # Starting date
                        date_2 = date_1 - relativedelta(months=int(months_diff))

                        # Generate all the missing dates (monthly) between date_2 and date_1
                        dates = []
                        current_date = date_2

                        while current_date <= date_1:
                            dates.append(current_date)
                            current_date = current_date + relativedelta(months=1)

                        # Feting result from json files
                        file_path = f"{constants.GPM_IRI_STATIC_RESPONSE}/chirps_{request.data.get('end_date')}.json"
                        if os.path.exists(file_path) and not request.data.get('adm1_name'):
                            # Open the file and load its contents
                            with open(file_path, 'r') as file:
                                result = json.load(file)
                                
                                for i in dates:
                                    date_obj = i.date()
                                    YM = date_obj.strftime('%Y-%b')
                                    if not YM in result['result']['graph_data']['dates']:
                                        if rainfall_data := AccumulatedRainfallService.get_rainfall_from_shp(self,'state', 'Kenya'):
                                            result['result']['graph_data']['dates'].append(YM)
                                            result['result']['graph_data']['data'].append(round(rainfall_data[YM], 2))
                                
                                success_response.update(result, code = status.HTTP_200_OK)
                                return Response(success_response, status = status.HTTP_200_OK)
                        else:
                            result = AccumulatedRainfallChirpsService.timeseries(self, request, clip_data)
                            
                            #No Acc rainfall
                            if not result:
                                error_response.update(code = status.HTTP_400_BAD_REQUEST, message = messages.ERROR["NO_ACCUMULATED_RAIN_ERR"], errors = "")
                                return Response(error_response, status = status.HTTP_400_BAD_REQUEST)
                            else:
                                
                                # ADM-2
                                if request.data.get('adm2_name'):
                                    for i in dates:
                                        date_obj = i.date()
                                        YM = date_obj.strftime('%Y-%b')
                                        
                                        if not YM in result['dates']:
                                    
                                            if rainfall_data := AccumulatedRainfallService.get_rainfall_from_shp(self,'name_2', request.data.get('adm2_name')):
                                                result['dates'].append(YM)
                                                result['data'].append(round(rainfall_data[YM]/100, 2))
                                
                                # ADM-1               
                                elif request.data.get('adm1_name') and not request.data.get('adm2_name'):
                                    for i in dates:
                                        date_obj = i.date()
                                        YM = date_obj.strftime('%Y-%b')
                                        
                                        if not YM in result['dates']:
                                    
                                            if rainfall_data := AccumulatedRainfallService.get_rainfall_from_shp(self,'name_1', request.data.get('adm1_name')):
                                                result['dates'].append(YM)
                                                result['data'].append(round(rainfall_data[YM]/100, 2))
                                # ADM-0
                                else:
                                    for i in dates:
                                        date_obj = i.date()
                                        YM = date_obj.strftime('%Y-%b')
                                        if not YM in result['dates']:
                                    
                                            if rainfall_data := AccumulatedRainfallService.get_rainfall_from_shp(self,'state', 'Kenya'):
                                                result['dates'].append(YM)
                                                
                                                result['data'].append(round(rainfall_data[YM]/100, 2))
                                
                                                
                                result['dates'] = result['dates'][-7:]
                                result['data'] = result['data'][-7:]
                                
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

                error_response.update(code = status.HTTP_400_BAD_REQUEST, message = error,  errors= "")
                return Response(error_response, status = status.HTTP_400_BAD_REQUEST) 

        except Exception as error:
            return Response({"exception": str(error)}, status=status.HTTP_400_BAD_REQUEST)