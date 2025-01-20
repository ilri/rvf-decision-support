#Generic
import datetime as dt

#GEE
import ee

#constants
from base import constants

class ClimateAccumulatedRainfallGPMHelper:
    def get_accumulated_rainfall(self, request, clip_data):

        #Without filterBounds
        rainfall_ext = ee.ImageCollection(constants.RAINFALL_DATASET).select(constants.RAINFALL_BAND_NAME)

        #Aggregating half hourly images to daily.
        con_st_dt = dt.datetime.strptime(request.data['start_date'], "%Y-%m-%d")
        startDate = ee.Date.fromYMD(con_st_dt.year, con_st_dt.month, con_st_dt.day)

        con_ed_dt = dt.datetime.strptime(request.data['end_date'], "%Y-%m-%d")
        endDate   = ee.Date.fromYMD(con_ed_dt.year, con_ed_dt.month, con_ed_dt.day)

        numberOfDays = endDate.difference(startDate, 'days')

        def hourly_to_daily(dayOffset):
            start = startDate.advance(dayOffset, 'days')    
            end = start.advance(1, 'days')
            return rainfall_ext.filterDate(start, end).sum().set('system:time_start', start.millis())
            
        #Aggregating half hourly images to daily.
        final = ee.ImageCollection(
            ee.List.sequence(0, numberOfDays.subtract(1)).map(hourly_to_daily)
        )
        return final