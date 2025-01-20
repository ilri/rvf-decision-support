#From generics
from rest_framework import generics, status
from rest_framework.response import Response

#Messages
from util.global_response import success_response, error_response
from util import messages

#Froom google earth engine
import ee 
import pandas as pd
from datetime import date, datetime, timedelta

#Constants
from base import constants

#From serices.py
from base.services import GEEServices
from rainfall.services import RainfallServices

#Serializer
from ..serializers import ForecastDataTimeSeriesSerializer


class NoaaTimeseries(generics.GenericAPIView):
    serializer_class = ForecastDataTimeSeriesSerializer
    
    def post(self, request):
        try:
            #Removing pandas warnings from the terminal
            pd.options.mode.chained_assignment = None 
            
            serializer = self.serializer_class(self, request.data)
            
            #Some Manipulation Required Start
            serializer.context['api_start_date'] = constants.NOAA_START_DATE 
            #Some Manipulation Required End
            
            if serializer.is_valid():#Validation mentioned into Serializers
                
                #Check Validation as per NOAA Start
                end_date_16_days = date.today() + timedelta(days = constants.NOAA_DAYS) #Next 16 days with today date
                
                #if user entered end date more than 16 days throws error
                if request.data['end_date'] > str(end_date_16_days):
                    error_response.update(code = status.HTTP_400_BAD_REQUEST, message = messages.ERROR["NOAA_END_DATE_ERROR"]+str(end_date_16_days))
                    return Response(error_response, status = status.HTTP_400_BAD_REQUEST) 
                
                #Validation: if time period difference more than 16days.
                diff_days = (datetime.strptime(str(request.data['end_date']), constants.DATE_FORMAT) - datetime.strptime(str(request.data['start_date']), constants.DATE_FORMAT)).days
                if diff_days > 15: # i.e., 16 days 
                    error_response.update(code = status.HTTP_400_BAD_REQUEST, message = messages.ERROR["NOAA_DATE_DIFF_ERROR"])
                    return Response(error_response, status = status.HTTP_400_BAD_REQUEST)
            
                #Clip Data (Means it could be Country Name OR State Name OR District Name)    
                clip_data = ""
                          
                #Get Feature Collection
                if clip_data := GEEServices.get_clip_data(self, request, 'geometry'):

                    try:
                        #Geometry simplify point
                        simplify_point = GEEServices.get_simplify(self, request, clip_data)

                        #For default parameter_id
                        parameter_id = request.data.get('parameter_id', 'precipitation')
                        #Get Parameter and related Values
                        parameter_details = RainfallServices.get_noaa_parameter(self, parameter_id)

                        #today date
                        today_date    =   date.today()

                        #if user enters start is less than today date then considering user start date otherwise today date as start date.
                        initial_date = request.data['start_date'] if request.data['start_date'] <= str(today_date) else str(today_date)

                        #Manipulation Start
                        initial_date_format = datetime.strptime(initial_date, constants.DATE_FORMAT)
                        
                        #Start point and End point
                        start_point = int((datetime.strptime(request.data['start_date'], constants.DATE_FORMAT).date() - datetime.strptime(initial_date, constants.DATE_FORMAT).date()).days)
                        end_point = int((datetime.strptime(request.data['end_date'], constants.DATE_FORMAT).date() - datetime.strptime(initial_date, constants.DATE_FORMAT).date()).days) 
                        hours_listing = []
                        
                        while start_point <= (end_point):
                            value = start_point * 24 # Here 24 Hours is 1 day.
                            if value > 0:
                                hours_listing.append(value)
                            start_point += 1
                        #Manipulation End
                        
                        #Initial Date (where we start get data from this date)
                        ini_date = ee.Date(initial_date)

                        #Data Collection behalf of Noaa Datasets
                        data_collection  = ee.ImageCollection(constants.NOAA_DATASET)
                        
                        #Filteration 
                        collection = data_collection.filterDate(ini_date.advance(-1, 'day'), ini_date.advance(1, 'day')).filter(ee.Filter.neq('forecast_hours', 0)).select(parameter_details['select_band']).sort('system:time_start', False)

                        #forecast hours
                        def forecast(hours):
                            image = collection.filter(ee.Filter.eq('forecast_hours', hours)).first()
                            date = image.date().advance(hours, 'hours')
                            return image.set('date', date.format()) 

                        #Dataset
                        noaa_dataset = ee.ImageCollection(ee.List(hours_listing).map(lambda hours: forecast(hours)))  

                        #forecast time
                        forecast_time=[]
                        for i in noaa_dataset.getInfo()['features']:
                            forecast_time.append(i['properties']['forecast_time'])

                        spatial_aggregation = GEEServices.switch_spatial_aggregation(self, request.data['spatial_aggregation'])

                        #Get TImeseries
                        noaa_df = GEEServices.time_series_calculation(self, noaa_dataset, spatial_aggregation, constants.NOAA_SCALE, simplify_point, parameter_details['select_band'])
                        
                        #Adding units 
                        noaa_df['Units'] = parameter_details['units']
                        
                        #Manipulation with Timestamp Start
                        noaa_df['Timestamp'] =  ""                              
                        i = 0
                        noaa_df['millis'] = forecast_time
                        for data_milies in noaa_df['millis']:
                            value_timestamp = initial_date_format  +  timedelta(days = (hours_listing[i] / 24))
                            noaa_df['Timestamp'][i] = value_timestamp.date()
                            
                            i += 1
                        #Manipulation with Timestamp End  

                        #Renaming column names
                        graph_data = noaa_df.rename(columns={
                                parameter_details['select_band']: 'data'
                            })
                        vector_data={parameter_details['select_band']:graph_data}
                        
                        success_response.update(result = vector_data, code = status.HTTP_200_OK)
                        return Response(success_response, status=status.HTTP_200_OK)
                        
                    except Exception as error:
                        error_response.update(code = status.HTTP_400_BAD_REQUEST, message = messages.ERROR["EMPTY_DATA"], errors = "")
                        return Response(error_response, status=status.HTTP_400_BAD_REQUEST)
                    
                else:
                    error_response.update(code = status.HTTP_400_BAD_REQUEST, message = messages.ERROR["CHOOSE_LOCATION"], errors = "")
                    return Response(error_response, status = status.HTTP_400_BAD_REQUEST)

            else:
                #Only One Error shoule be shown at a time.
                error, *_ = serializer.errors.values()
                error = error[0] if error else ""

                error_response.update(code = status.HTTP_400_BAD_REQUEST, message = error, errors= "")
                return Response(error_response, status = status.HTTP_400_BAD_REQUEST) 
            
        except Exception as error:
            return Response ({"exception":str(error)},status=status.HTTP_400_BAD_REQUEST)
 