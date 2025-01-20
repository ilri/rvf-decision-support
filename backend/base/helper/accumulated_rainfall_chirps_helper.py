#Generic


#Constants
from base import constants

#From GEE
import ee


#From datetime
import datetime as dt

class AccumulatedRainfallChirpsHelper:

    def get_accumulated_rainfall_chirps(self, start_date, end_date, clip_data, map_graph):
        
        # converting string date to date object
        con_st_dt = dt.datetime.strptime(str(start_date), "%Y-%m-%d")
        startDate = ee.Date.fromYMD(con_st_dt.year, con_st_dt.month, con_st_dt.day)
        # startDate = ee.Date.fromYMD(con_st_dt.year-10, 1, 1) # taking past 10 years from the end date 

        con_ed_dt = dt.datetime.strptime(str(end_date), "%Y-%m-%d")
        endDate   = ee.Date.fromYMD(con_ed_dt.year, con_ed_dt.month, con_ed_dt.day)
        
        # Start date taking past 10 years from end date
        #Commented filterBounds
        if map_graph == 'map':
            rainfall_ext = ee.ImageCollection(constants.RAINFALL_CHIRPS_DATASET).select(constants.RAINFALL_CHIRPS_BAND_NAME).filterDate(f"{con_ed_dt.year-10}-01-01", end_date)
        else:
            rainfall_ext = ee.ImageCollection(constants.RAINFALL_CHIRPS_DATASET).select(constants.RAINFALL_CHIRPS_BAND_NAME)
            
        #Aggregating half hourly images to daily.
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