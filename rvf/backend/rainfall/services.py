
#Constant
from base import constants

class RainfallServices:

    #NOAA parameters
    def get_noaa_parameter(self, parameter):
        # parameterSlug = Parameter.objects.filter(id = parameter).values('slug')
        # parameter_name = parameterSlug[0]['slug']
        
        if parameter == "precipitation": #Precipitation
            select_band  = constants.NOAA_PRECIPITATION_BAND_
            min_val      = constants.NOAA_PRECIPITATION_MIN    
            max_val      = constants.NOAA_PRECIPITATION_MAX 
            units        = constants.NOAA_PRECIPITATION_UNITS
            palette      = constants.NOAA_PRECIPITATION_PALETTE
        
        if parameter == "temperature": #Temperature
            select_band = constants.NOAA_TEMPERATURE_BAND
            min_val     = constants.NOAA_TEMPERATURE_MIN   
            max_val     = constants.NOAA_TEMPERATURE_MAX
            units       = constants.NOAA_TEMPERATURE_UNITS
            palette     = constants.NOAA_TEMPERATURE_PALETTE

        return {'select_band': select_band, 'min_val': min_val, 'max_val': max_val,'units':units,'palette':palette} 