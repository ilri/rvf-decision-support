
#Constants
from base import constants

#From GEE
import ee

#From datetime
from datetime import datetime

class TemperatureHelper:

    def get_temperature_timeseries(self, request, clip_data):

        # Load the dataset
        dataset = ee.ImageCollection(constants.TEMPERATURE_IMG_COL).select(constants.TEMPERATURE_IMG_COL_BAND).filterDate(request.data['start_date'], request.data['end_date'])

        if request.data.get('geometry'):
            filter_dataset = dataset
        else:
            filter_dataset = dataset.filterBounds(clip_data)
       
        return filter_dataset
    
    
    def get_temperature_map(self, start_date, end_date, clip_data):
        
        def calculate_monthly_mean(year, month):
            startDate = ee.Date.fromYMD(year, month, 1)
            endDate = startDate.advance(1, 'month')

            monthly_dataset = dataset.filter(ee.Filter.date(startDate, endDate)) \
                                    .mean() \
                                    .clip(clip_data)

            return monthly_dataset

        # Load the dataset
        dataset = ee.ImageCollection(constants.TEMPERATURE_IMG_COL).select(constants.TEMPERATURE_IMG_COL_BAND)

        # Calculate monthly means
        '''january_mean = calculate_monthly_mean(2023, 4)
        february_mean = calculate_monthly_mean(2023, 5)'''
           
        return calculate_monthly_mean(2023, 4)

                  