#Generic
import copy
from threading import Thread
from django.http import HttpRequest
import pandas as pd
from django.db.models import F, Q
from datetime import datetime, timedelta
import datetime as dt
from calendar import month_abbr
from dateutil.relativedelta import relativedelta
from concurrent.futures import ThreadPoolExecutor
from datetime import date, datetime

#GEE
import ee
from dashboard.models.rvf_cases import RVFCases

#Helper
from base.helper.accumulated_rainfall_chirps_helper import AccumulatedRainfallChirpsHelper
from base.helper.accumulated_rainfall_gpm_helper import AccumulatedRainfallGPMHelper

from base.helper.climate_accumulated_rainfall_chirps_helper import ClimateAccumulatedRainfallChirpsHelper
from base.helper.climate_accumulated_rainfall_gpm_helper import ClimateAccumulatedRainfallGPMHelper

from base.helper.temperature_helper import TemperatureHelper

#constants
from base import constants

#Base services
from base.services import GEEServices, BaseServices

# All models
from .models.rainfall_source import RainfallSource
from location.models import country,county,sub_county,ward
from dashboard.models.gee_indices import GeeIndices
from dashboard.models.iri_forecast import IRIForecast



class AccumulatedRainfallChirpsService:
    
    def tiff(self, request, clip_data):
        rainfall_ext = AccumulatedRainfallChirpsHelper.get_accumulated_rainfall_chirps(self, str(request.data['start_date']), str(request.data['end_date']), clip_data, 'map')
        
        #Image metadata
        image_start_date, scale, projection = GEEServices.get_image_metadata(self, constants.RAINFALL_CHIRPS_DATASET, constants.RAINFALL_CHIRPS_BAND_NAME)
        
        #Get min, max
        composite, min_val, max_val, result = AccumulatedRainfallChirpsService.get_min_max(self, request, "", clip_data, rainfall_ext, scale, request.data['temporal_aggregation'], "map")
        
        geo_tiff_url = GEEServices.generate_geo_tiff(self, composite, clip_data, min_val, max_val, scale, constants.RAINFALL_CHIRPS_PALETTE)
       
        #Result
        return {'geo_tiff': geo_tiff_url}
    
    #Map
    def map(self, request, clip_data): 
        #rainfall_ext = AccumulatedRainfallChirpsHelper.get_accumulated_rainfall_chirps(self,request.data['start_date'], request.data['end_date'], clip_data, 'map')
        
        date_obj = dt.datetime.strptime(request.data['end_date'], "%Y-%m-%d") # Date object
        
        date_obj = dt.datetime.strptime(request.data['end_date'], "%Y-%m-%d") # Date object
        filtered_images_list = [] 
        
        def rainfall_map(self,  start_date_ee, end_date_ee):
            filtered_images = AccumulatedRainfallChirpsHelper.get_accumulated_rainfall_chirps(self, str(start_date_ee), str(end_date_ee), clip_data, 'map')
            filtered_images = filtered_images.mean()
            filtered_images_list.append(filtered_images)
            
        thread_list = []
        past_years = 10
        for i in range(past_years):
            current_year = date_obj.year - i
            month_range = 1
            
            for j in range(month_range):
                start_date_val = datetime(current_year, date_obj.month, 1)
                past_year_month = start_date_val - relativedelta(months = j)
                start_date_ee,end_date_ee = BaseServices.get_start_and_end_dates(self,past_year_month.year,past_year_month.month)
                
                # Applied threading
                t =Thread(target = rainfall_map, args=(self, start_date_ee, end_date_ee))
                t.daemon = True
                t.start()
                thread_list.append(t)

        for j in thread_list:
            j.join()
            
        combined_image_collection = ee.ImageCollection.fromImages(filtered_images_list)

        # mean
        mean_image = combined_image_collection.mean()

        # standrad deviation
        standard_deviation_image = combined_image_collection \
        .reduce(ee.Reducer.stdDev())\
        .clip(clip_data)

        latest_start_date,latest_end_date = BaseServices.get_start_and_end_dates(self, date_obj.year, date_obj.month)
        
        # current month values
        chirpsCollection = ee.ImageCollection(constants.RAINFALL_CHIRPS_DATASET) \
        .select(constants.RAINFALL_CHIRPS_BAND_NAME) \
        .filterDate(str(latest_start_date),str(latest_end_date)) \
        .mean() \
        .clip(clip_data)

        # calculating anamoly score
        zScore = chirpsCollection.subtract(mean_image).divide(standard_deviation_image)
        
        # Image metadata
        image_start_date, scale, projection = GEEServices.get_image_metadata(self, constants.RAINFALL_CHIRPS_DATASET, constants.RAINFALL_CHIRPS_BAND_NAME)
        
        min_val, max_val = GEEServices.get_dynamic_min_max_values(self, zScore, clip_data, constants.RAINFALL_CHIRPS_MIN, constants.RAINFALL_CHIRPS_MAX, scale)
        
        #Get Palettes
        palette = GEEServices.getPaletteData(self, min_val, max_val, constants.RAINFALL_CHIRPS_PALETTE, request)
        
        #Generating Map ID
        map_id = zScore.getMapId(palette)

        #Generating Map URl
        map_data = GEEServices.get_map_url(self, map_id, palette) 

        map_data['min'] = float(format(map_data['min'],".2f"))
        map_data['max'] = float(format(map_data['max'],".2f"))
        map_data['units'] = constants.RAINFALL_CHIRPS_UNITS

        #Result
        return {'map_data': map_data}


    #Timeseries
    def timeseries(self, request, clip_data):
        ''' 
        1. Fetching data from the last 6 months within the past 10 years.
        2. Calculating mean and standard deviation based on months
        3. Calculate the mean and standard deviation of the data from the recent 6 months data 
        '''
        
        return RainfallCHIRPSStatic.z_score_rainfall_chirps(self, request, clip_data, 'chirps')
    #rainfall_timeseries(self, request, clip_data, 'chirps')
    
    def mean_rainfall_timeseries(self, request, clip_data):
        rainfall_ext = ee.ImageCollection(constants.RAINFALL_CHIRPS_DATASET).select(constants.RAINFALL_CHIRPS_BAND_NAME).filterDate(request.data['start_date'],request.data['end_date'])
        image_start_date, scale, projection = GEEServices.get_image_metadata(self, constants.RAINFALL_CHIRPS_DATASET, constants.RAINFALL_CHIRPS_BAND_NAME)

        try:
            temporal_aggr = GEEServices.switch_temporal_aggregation(self, request.data['spatial_aggregation'], rainfall_ext)
            url = temporal_aggr.getDownloadUrl({
            'region': clip_data,
            'scale':scale,
            'format': 'GEO_TIFF',
            'crs': 'EPSG:4326',
            'maxPixels':1e13
            })
        except:
            url = None
        
        band = constants.RAINFALL_CHIRPS_BAND_NAME
        spatial_aggreagtion = GEEServices.switch_spatial_aggregation(self, request.data['spatial_aggregation'])
        data = GEEServices.time_series_calculation(self, rainfall_ext, spatial_aggreagtion, scale, clip_data, band)
        
        data['millis'] = pd.to_datetime(data['millis'], unit='ms')  # Convert millis to datetime

        # Group by month and calculate the sum of 'data'
        monthly_data = data.groupby(pd.Grouper(key='millis', freq='M')).sum().reset_index()

        # Optional: Convert millis back to milliseconds
        monthly_data['millis'] = monthly_data['millis'].astype(int) / 1e6  # Convert back to milliseconds

        monthly_data['millis'] = pd.to_datetime(monthly_data['millis'], unit='ms')  # Convert millis to datetime
        dates = monthly_data['millis'].dt.strftime('%Y-%b').tolist()  # Convert datetime to 'YYYY-MMM' format
        data = monthly_data['data'].tolist()
        mean_rainfall = monthly_data['data'].mean()
        
        return  {
        "dates": dates,
        "data": data,
        "mean_rainfall": mean_rainfall,
        "tiff_file":url
    }
        
    #Get the MIn, Max
    def get_min_max(self, request, df, clip_data, img, scale, aggregation, type):
        #min, max
        if aggregation == 'sum':
            min_val, max_val = constants.RAINFALL_CHIRPS_MIN_SUM,constants.RAINFALL_CHIRPS_MAX_SUM
        else:
            min_val, max_val = constants.RAINFALL_CHIRPS_MIN,constants.RAINFALL_CHIRPS_MAX

        #Dynamic min, max
        composite = GEEServices.switch_temporal_aggregation(self, aggregation, img)
        composite = composite.clip(clip_data)

        if not str(request.data.get('min', '')) and not str(request.data.get('max', '')):
            img_reg = (composite.reduceRegion(ee.Reducer.minMax(),clip_data, scale, None, None, False, 1e13))
            min_max_values = ee.ImageCollection(img_reg).getInfo()
            max_val, min_val, *_ = min_max_values.values()

        else:
            min_val, max_val = request.data.get('min') or min_val, request.data.get('max') or max_val

        if type not in ["map", "timeseries"]:
            df.loc[df["data"]< min_val,'data'] = min_val
            df.loc[df["data"]> max_val,'data'] = max_val

        return composite, min_val, max_val, df
    

class TemperatureService:
    def timeseries(self, request, clip_data):
        
        # Monthly temperature
        monthly_temperature = TemperatureHelper.get_temperature_timeseries(self, request, clip_data)
        
        try:
            temporal_aggr = GEEServices.switch_temporal_aggregation(self, request.data['spatial_aggregation'], monthly_temperature)
            url = temporal_aggr.getDownloadUrl({
            'region': clip_data,
            'scale':constants.TEMPERATURE_SCALE,
            'format': 'GEO_TIFF',
            'crs': 'EPSG:4326',
            'maxPixels':1e13
            })
        except:
            url = None
        
        #Spatial aggregation
        aggregation = GEEServices.switch_spatial_aggregation(self, request.data['spatial_aggregation'])#, ee.ImageCollection(monthly_temperature))
        
        # Timeseries calculation
        timeseries_data = GEEServices.time_series_calculation(self, monthly_temperature,  aggregation, constants.TEMPERATURE_SCALE, clip_data, constants.TEMPERATURE_IMG_COL_BAND)
        
        timeseries_data['date'] = pd.to_datetime(timeseries_data['millis'], unit='ms')
        monthly_data = timeseries_data.resample('M', on='date').mean()
        
        monthly_data['millis'] = pd.to_datetime(monthly_data['millis'], unit='ms')  # Convert millis to datetime
        dates = monthly_data['millis'].dt.strftime('%Y-%b').tolist()  # Convert datetime to 'YYYY-MMM' format
        data = monthly_data['data'].tolist()
        mean_temp = monthly_data['data'].mean()
        
        return  {
        "dates": dates,
        "data": data,
        "mean_temperature": mean_temp,
        "tiff_file":url
        }
        
        
    


class SRTMServices:
    def tiff(self, request, clip_data):
        
        # SRTM img
        dataset = ee.Image(constants.SRTM_DATASET).clip(clip_data)
        
        # SRTM band
        elevation = dataset.select('elevation')

        #Get min, max, values from image collection
        min_val,max_val = GEEServices.get_dynamic_min_max_values(self,elevation, clip_data,constants.SRTM_DATASET_MIN,constants.SRTM_DATASET_MAX, constants.SRTM_SCALE)
            
        # Generating geotiff url
        geo_tiff_url = GEEServices.generate_geo_tiff(self, elevation, clip_data, min_val, max_val, constants.SRTM_SCALE, constants.SRTM_DATASET_PALETTE)
       
        #Result
        return {'geo_tiff': geo_tiff_url}
    



class AccumulatedRainfallService:
    
    def get_rainfall_from_shp(self, filter_id, filter_name):
        shapefile = ee.FeatureCollection('projects/idmt-321615/assets/RVF/forecast_tiff/rainfall_data')

        # Filter by 'name_1' equal to 'Meru'
        meru_region = shapefile.filter(ee.Filter.eq(filter_id, filter_name))

        # Function to calculate the mean for each column
        def calculate_mean(feature_collection, column_name):
            return feature_collection.reduceColumns(
                reducer=ee.Reducer.mean(),
                selectors=[column_name]
            ).get('mean')

        # Calculate the mean for each of the columns
        aug_sip_mean = calculate_mean(meru_region, 'Aug_SIP')
        sep_spi_mean = calculate_mean(meru_region, 'Sep_SPI')
        oct_spi_mean = calculate_mean(meru_region, 'Oct_SPI')
        nov_spi_mean = calculate_mean(meru_region, 'Nov_SPI')

        
        # Get the results as a dictionary
        mean_values = ee.Dictionary({
            '2024-Aug': aug_sip_mean,
            '2024-Sep': sep_spi_mean,
            '2024-Oct': oct_spi_mean,
            '2024-Nov': nov_spi_mean
        })
        
        # Fetch the results from Earth Engine
        return mean_values.getInfo()
        
    #Map
    def map(self, request, clip_data):
        #Rainfall Image
        # rainfall_ext = AccumulatedRainfallGPMHelper.get_accumulated_rainfall(self, request.data['start_date'], request.data['end_date'], clip_data, 'map')
        
        date_obj = dt.datetime.strptime(request.data['end_date'], "%Y-%m-%d") # Date object
        filtered_images_list = [] 
        
        def rainfall_map(self,  start_date_ee, end_date_ee):
            filtered_images = AccumulatedRainfallGPMHelper.get_accumulated_rainfall(self, str(start_date_ee), str(end_date_ee), clip_data, 'map')
            # filtered_images = filtered_images.mean()
            filtered_images = filtered_images.sum()
            filtered_images_list.append(filtered_images)
            
        thread_list = [] 
        past_years = 10
        for i in range(past_years):
            current_year = date_obj.year - i
            month_range = 1
            
            for j in range(month_range):
                start_date_val = datetime(current_year, date_obj.month, 1)
                past_year_month = start_date_val - relativedelta(months = j)
                start_date_ee,end_date_ee = BaseServices.get_start_and_end_dates(self,past_year_month.year,past_year_month.month)
                
                # Applied threading
                t =Thread(target = rainfall_map, args=(self, start_date_ee, end_date_ee))
                t.daemon = True
                t.start()
                thread_list.append(t)

        for j in thread_list:
            j.join()
            
        combined_image_collection = ee.ImageCollection.fromImages(filtered_images_list)

        # mean
        mean_image = combined_image_collection.mean()

        # standrad deviation
        standard_deviation_image = combined_image_collection \
        .reduce(ee.Reducer.stdDev())\
        .clip(clip_data)

        latest_start_date,latest_end_date = BaseServices.get_start_and_end_dates(self, date_obj.year, date_obj.month)
        
        # current month values
        chirpsCollection = ee.ImageCollection(constants.RAINFALL_DATASET) \
        .select(constants.RAINFALL_BAND_NAME) \
        .filterDate(str(latest_start_date),str(latest_end_date)) \
        .sum() \
        .clip(clip_data)

        # calculating anamoly score
        final_img = chirpsCollection.subtract(mean_image).divide(standard_deviation_image)
        
        #Image metadata
        image_start_date, scale, projection = GEEServices.get_image_metadata(self, constants.RAINFALL_DATASET, constants.RAINFALL_BAND_NAME)
        
        # Dynamic min-max
        min_val, max_val = GEEServices.get_dynamic_min_max_values(self, final_img, clip_data, constants.RAINFALL_MIN, constants.RAINFALL_MAX, scale)
        
        #Get Palettes
        palette = GEEServices.getPaletteData(self, min_val, max_val, constants.RAINFALL_PALETTE, request)
        
        #Generating Map ID
        map_id = final_img.getMapId(palette)

        #Generating Map URl
        map_data = GEEServices.get_map_url(self, map_id, palette) 

        map_data['min'] = float(format(map_data['min'],".2f"))
        map_data['max'] = float(format(map_data['max'],".2f"))
        map_data['units'] = constants.RAINFALL_UNITS

        #Result
        return {'map_data': map_data}


    #Timeseries
    def timeseries(self, request, clip_data):
        ''' 
        1. Fetching data from the last 6 months within the past 10 years.
        2. Calculating mean and standard deviation based on months
        3. Calculate the mean and standard deviation of the data from the recent 6 months data 
        '''
        
        return rainfall_timeseries(self, request, clip_data, 'gpm')
    
    
    def rainfall_data_from_shp(self, request):
        forecast_date_list = {
            'aug': '2024-08-31',
            'sep': '2024-09-30',
            'oct': '2024-10-31',
            'nov': '2024-11-30'
        }

        # Given date
        given_date = request.data.get('end_date')

        # Find the key and value corresponding to the given date
        key_value_pair = {key: value for key, value in forecast_date_list.items() if value == given_date}

        # Ensure the key is found
        if not key_value_pair:
            raise ValueError("Given date does not match any forecast dates.")

        key, _ = next(iter(key_value_pair.items()))

        # Load the shapefile from Earth Engine
        shapefile = ee.FeatureCollection('projects/idmt-321615/assets/RVF/forecast_tiff/rainfall_data')

        # Default assignment
        shp_data = shapefile

        # Filter based on the request
        if not request.data.get('adm1_name') and not request.data.get('adm2_name'):
            shp_data = shapefile.filter(ee.Filter.eq('state', 'Kenya'))
            
        elif request.data.get('adm1_name') and not request.data.get('adm2_name'):
            shp_data = shapefile.filter(ee.Filter.eq('name_1', request.data.get('adm1_name')))
                
        elif request.data.get('adm2_name'):
            shp_data = shapefile.filter(ee.Filter.eq('name_2', request.data.get('adm2_name')))

        # Function to format the data into the desired structure
        def format_feature_data(feature, key):
            state = feature.get('state').getInfo()
            name_1 = feature.get('name_1').getInfo()
            name_2 = feature.get('name_2').getInfo()
            
            # Extract value based on key
            if key == 'aug':
                value = feature.get('Aug_SIP').getInfo()
            elif key == 'sep':
                value = feature.get('Sep_SPI').getInfo()
            elif key == 'oct':
                value = feature.get('Oct_SPI').getInfo()
            elif key == 'nov':
                value = feature.get('Nov_SPI').getInfo()
            else:
                value = None
                
            if value is not None:
                value /= 100
                
                if value <= 1:
                    colour = "#F2B28B"
                elif 1 < value <= 2:
                    colour = "#D07A49"
                elif value > 2:
                    colour = "#D5461F"
                
                # Create a list of dictionaries with date and value for each month
                formatted_data = [
                    {'country_name': state, 'county_name': name_1, 'sub_county_name': name_2, 'date': f'2024-{key.capitalize()}', 'value': round(value, 2), 'colour': colour}
                ]
                
                return formatted_data
            return []

        # Convert the FeatureCollection to a list of features
        def extract_data(feature_collection):
            features_list = feature_collection.toList(feature_collection.size())
            results = []
            
            for i in range(features_list.size().getInfo()):
                feature = ee.Feature(features_list.get(i))
                results.extend(format_feature_data(feature, key))
            
            return results

        # Get the formatted data
        formatted_data = extract_data(shp_data)
        
        return formatted_data

    
    # GPM Forecastd Map
    def forecast_map(self, request, slug, gpm_chirps_type):
        ''' 
        1. Fetching data from the last 4 months within the past 10 years.
        2. Calculating mean and standard deviation based on months
        3. Calculate the mean and standard deviation of the data from the recent 1 months data 
        '''
        
        final_graph = []
        
        iri_data = [] # IRI forecasted data
        
        # Dataset enddate and user enddate
        gpm_indices     = GeeIndices.objects.get(slug = slug)
        gpm_max_date    = dt.datetime.strptime(str(gpm_indices.max_date), "%Y-%m-%d")
        user_max_date   = dt.datetime.strptime(request.data.get('end_date'), "%Y-%m-%d")
        
        # If user end date is greater than dataset enddate
        if gpm_max_date < user_max_date:
            ''' IRI forecasted data'''
            try:
                # Fetching iri data feom table and appending to iri_data list
                iri_forecast = IRIForecast.objects.all().values('ward_code', 'iri_data')
                for i in iri_forecast:
                    iri_data.append(
                        {'ward_code': i['ward_code'],
                        'iri_data':i['iri_data']})
            except:
                pass      

        if request.data.get('adm2_name') and request.data.get('adm1_name'):
            sub_county_data = [{'name':request.data.get('adm2_name')}]
        
        elif not request.data.get('adm2_name') and request.data.get('adm1_name'):
            county_data = county.County.objects.filter(name = request.data.get('adm1_name')).values('id')
            sub_county_data = sub_county.SubCounty.objects.filter(county_id = county_data[0]['id']).values('name')
        
        elif request.data.get('adm0_name') and not (request.data.get('adm2_name') and request.data.get('adm1_name')):
            country_data = country.Country.objects.filter(name = request.data.get('adm0_name')).values('id')
            sub_county_data = county.County.objects.filter(country_id = country_data[0]['id']).values('name') # County
        
        def process_sub_county(sub_county, request_copy, iri_data):
            # giving data for all county when user select country.
            if request.data.get('adm0_name') and not request.data.get('adm2_name') and not request.data.get('adm1_name'):
                request_copy.data['adm1_name'] = sub_county # county names
                request_copy.data['adm2_name'] = ""
            else:
                request_copy.data['adm2_name'] = sub_county
                
            if clip_data := GEEServices.get_clip_data(self, request_copy, 'geometry'):
                try:
                    if result := RainfallCHIRPSStatic.forecast_rainfall_map(self, request_copy, clip_data, iri_data, gpm_chirps_type):
                        final_graph.append(result)
                except:
                    pass
            else:
                return False
        if not request.data.get("adm1_name"):
            # location_list = []
            for i in sub_county_data:
                request_copy = HttpRequest()
                request_copy.data = copy.copy(request.data)
                process_sub_county(i['name'], request_copy, iri_data)
                '''location_list.append(i['name'])

            with ThreadPoolExecutor() as executor:
                request_copy = HttpRequest()
                request_copy.data = copy.copy(request.data)
                # Using submit to pass arguments separately 
                [executor.submit(process_sub_county, i, request_copy, iri_data) for i in location_list]'''

        else:
            # Create threads for each sub_county_name
            thread_list = []
            for i in sub_county_data:
                request_copy = HttpRequest()
                request_copy.data = copy.copy(request.data)
                t = Thread(target=process_sub_county, args=(i['name'],request_copy, iri_data))
                t.daemon = True
                t.start()
                thread_list.append(t)

            # Wait for all threads to finish
            for t in thread_list:
                t.join()
           
        return final_graph
    
    
    #Get the MIn, Max
    def get_min_max(self, request, df, clip_data, img, scale, aggregation, type):
        #min, max
        if aggregation == 'sum':
            min_val, max_val = constants.RAINFALL_MIN_SUM,constants.RAINFALL_MAX_SUM
        else:
            min_val, max_val = constants.RAINFALL_MIN,constants.RAINFALL_MAX
        
        #Dynamic min, max
        composite = GEEServices.switch_temporal_aggregation(self, aggregation, img)
        composite = composite.clip(clip_data)
        
        if not str(request.data.get('min', '')) and not str(request.data.get('max', '')):
            img_reg = (composite.reduceRegion(ee.Reducer.minMax(),clip_data, scale, None, None, False, 1e13))
            min_max_values = ee.ImageCollection(img_reg).getInfo()
            max_val, min_val, *_ = min_max_values.values()

        else:
            min_val, max_val = request.data.get('min') or min_val, request.data.get('max') or max_val

        if type not in ["map", "timeseries"]:
            df.loc[df["data"]< min_val,'data'] = min_val
            df.loc[df["data"]> max_val,'data'] = max_val

        return composite, min_val, max_val, df
 
################
class ClimateAccumulatedRainfallChirpsService:
    
    #Map
    def map(self, request, clip_data):
        rainfall_ext = ClimateAccumulatedRainfallChirpsHelper.get_accumulated_rainfall_chirps(self,request, clip_data)
        
        #Image metadata
        image_start_date, scale, projection = GEEServices.get_image_metadata(self, constants.RAINFALL_CHIRPS_DATASET, constants.RAINFALL_CHIRPS_BAND_NAME)
        
        #Get min, max
        composite, min_val, max_val, result = ClimateAccumulatedRainfallChirpsService.get_min_max(self, request, "", clip_data, rainfall_ext, scale, request.data['temporal_aggregation'], "map")

        #Get Palettes
        palette = GEEServices.getPaletteData(self, min_val, max_val, constants.RAINFALL_CHIRPS_PALETTE, request)
        
        #Generating Map ID
        map_id = composite.getMapId(palette)

        #Generating Map URl
        map_data = GEEServices.get_map_url(self, map_id, palette) 

        map_data['min'] = float(format(map_data['min'],".2f"))
        map_data['max'] = float(format(map_data['max'],".2f"))
        map_data['units'] = constants.RAINFALL_CHIRPS_UNITS

        #Result
        return {'map_data': map_data}


    #Timeseries
    def timeseries(self, request, clip_data):
        #Managing Area boundary clip(boundary simplication will make it easier to calculate timeseries.)
        if 'geometry' in request.data and request.data['geometry']:
            boun_clip = clip_data
            simplify_boun_clip = clip_data      
            
        else:
            boun_clip = clip_data #.bounds()
            simplify_boun_clip = clip_data #GEEServices.get_simplify(self, request, clip_data)

        #Rainfall image
        rainfall_ext = ClimateAccumulatedRainfallChirpsHelper.get_accumulated_rainfall_chirps(self,request, boun_clip)
        #Image metadata
        image_start_date, scale, projection = GEEServices.get_image_metadata(self, constants.RAINFALL_CHIRPS_DATASET, constants.RAINFALL_CHIRPS_BAND_NAME)
        
        #Spatial aggregation
        spatial_aggreagtion = GEEServices.switch_spatial_aggregation(self, request.data['spatial_aggregation'])
        
        #Timeseries Calculations
        result = GEEServices.time_series_calculation(self, rainfall_ext, spatial_aggreagtion, scale, simplify_boun_clip, constants.RAINFALL_CHIRPS_BAND_NAME)
        
        #Timeseries will be in b/w min, max
        if not result.empty:
            composite, min_val, max_val, result = AccumulatedRainfallChirpsService.get_min_max(self, request, result, boun_clip, rainfall_ext, scale, request.data['spatial_aggregation'], "timeseries")
        
        return result
    
    
    #Get the MIn, Max
    def get_min_max(self, request, df, clip_data, img, scale, aggregation, type):
        #min, max
        if aggregation == 'sum':
            min_val, max_val = constants.RAINFALL_CHIRPS_MIN_SUM,constants.RAINFALL_CHIRPS_MAX_SUM
        else:
            min_val, max_val = constants.RAINFALL_CHIRPS_MIN,constants.RAINFALL_CHIRPS_MAX

        #Dynamic min, max
        composite = GEEServices.switch_temporal_aggregation(self, aggregation, img)
        composite = composite.clip(clip_data)

        if not str(request.data.get('min', '')) and not str(request.data.get('max', '')):
            img_reg = (composite.reduceRegion(ee.Reducer.minMax(),clip_data, scale, None, None, False, 1e13))
            min_max_values = ee.ImageCollection(img_reg).getInfo()
            max_val, min_val, *_ = min_max_values.values()

        else:
            min_val, max_val = request.data.get('min') or min_val, request.data.get('max') or max_val

        if type not in ["map", "timeseries"]:
            df.loc[df["data"]< min_val,'data'] = min_val
            df.loc[df["data"]> max_val,'data'] = max_val

        return composite, min_val, max_val, df
    



class ClimateAccumulatedRainfallService:
    
    #Map
    def map(self, request, clip_data):
        #Rainfall Image
        rainfall_ext = ClimateAccumulatedRainfallGPMHelper.get_accumulated_rainfall(self, request, clip_data)
        
        #Image metadata
        image_start_date, scale, projection = GEEServices.get_image_metadata(self, constants.RAINFALL_DATASET, constants.RAINFALL_BAND_NAME)
        
        #Get min, max
        composite, min_val, max_val, result = ClimateAccumulatedRainfallService.get_min_max(self, request, "", clip_data, rainfall_ext, scale, request.data['temporal_aggregation'], "map")
            
        #Get Palettes
        palette = GEEServices.getPaletteData(self, min_val, max_val, constants.RAINFALL_PALETTE, request)
        
        #Generating Map ID
        map_id = composite.getMapId(palette)

        #Generating Map URl
        map_data = GEEServices.get_map_url(self, map_id, palette) 

        map_data['min'] = float(format(map_data['min'],".2f"))
        map_data['max'] = float(format(map_data['max'],".2f"))
        map_data['units'] = constants.RAINFALL_UNITS

        #Result
        return {'map_data': map_data}


    #Timeseries
    def timeseries(self, request, clip_data):
        #Rainfall image
        
        rainfall_ext = ClimateAccumulatedRainfallGPMHelper.get_accumulated_rainfall(self,request, clip_data)
        
        #Spatial aggregation
        spatial_aggreagtion = GEEServices.switch_spatial_aggregation(self, request.data['spatial_aggregation'])

        #Image metadata
        image_start_date, scale, projection = GEEServices.get_image_metadata(self, constants.RAINFALL_DATASET, constants.RAINFALL_BAND_NAME)
        
        '''#Managing Area boundary clip(boundary simplication will make it easier to calculate timeseries.)
        if 'geometry' in request.data and request.data['geometry']:
            simplify_boun_clip = clip_data
            boun_clip = clip_data
        else:
            boun_clip = clip_data#.bounds()
            simplify_boun_clip = clip_data#GEEServices.get_simplify(self, request, clip_data)'''

        #Timeseries
        result = GEEServices.time_series_calculation(self, rainfall_ext, spatial_aggreagtion, scale, clip_data, constants.RAINFALL_BAND_NAME)
        
        #Timeseries will be in b/w min, max
        '''if not result.empty:
            composite, min_val, max_val, result = AccumulatedRainfallService.get_min_max(self, request, result, clip_data, rainfall_ext, scale, request.data['spatial_aggregation'], "timeseries")'''
        
        return result
    
    
    #Get the MIn, Max
    def get_min_max(self, request, df, clip_data, img, scale, aggregation, type):
        #min, max
        if aggregation == 'sum':
            min_val, max_val = constants.RAINFALL_MIN_SUM,constants.RAINFALL_MAX_SUM
        else:
            min_val, max_val = constants.RAINFALL_MIN,constants.RAINFALL_MAX
        
        #Dynamic min, max
        composite = GEEServices.switch_temporal_aggregation(self, aggregation, img)
        composite = composite.clip(clip_data)
        
        if not str(request.data.get('min', '')) and not str(request.data.get('max', '')):
            img_reg = (composite.reduceRegion(ee.Reducer.minMax(),clip_data, scale, None, None, False, 1e13))
            min_max_values = ee.ImageCollection(img_reg).getInfo()
            max_val, min_val, *_ = min_max_values.values()

        else:
            min_val, max_val = request.data.get('min') or min_val, request.data.get('max') or max_val

        if type not in ["map", "timeseries"]:
            df.loc[df["data"]< min_val,'data'] = min_val
            df.loc[df["data"]> max_val,'data'] = max_val

        return composite, min_val, max_val, df
    

 


class DashboardServices:
    def get_rainfall_source_list():
        return RainfallSource.objects.filter(status = True).values('id','name', 'api_url',
                                                            dataset_min_date = F('indices__min_date'), dataset_max_date = F('indices__max_date'))
    

    def get_rvf_cases(self, request):
        query = RVFCases.objects

        def get_year_and_month_after_6month(start_year, start_month):
            # Create a datetime object for the starting year and month
            current_date = datetime(int(start_year), int(start_month), 1)

            # Calculate the date after 6 months
            result_date = current_date + timedelta(days=30 * 6)  # Assuming 30 days per month

            return result_date.year, result_date.month

        # End year, end month
        end_year, end_month = get_year_and_month_after_6month(request.GET.get("year"), request.GET.get("month"))

        other_field_conditions = Q() 

        if request.GET.get("country_id"):
            other_field_conditions &= Q(country_id = request.GET.get("country_id"))

        if request.GET.get("county_id"):
            other_field_conditions &= Q(county_id = request.GET.get("county_id"))

        if request.GET.get("sub_county_id"):
            other_field_conditions &= Q(sub_county_id = request.GET.get("sub_county_id"))

        if request.GET.get("year") and request.GET.get("month"):
            date_range_condition = (
                Q(year__gt=request.GET.get("year")) | (Q(year=request.GET.get("year")) & Q(month__gte=request.GET.get("month")))
            ) & (
                Q(year__lt=end_year) | (Q(year=end_year) & Q(month__lte=end_month))
            )
        
        # Combine both conditions
        conditions = other_field_conditions & date_range_condition

        # If the type is graph we are returning the data year and month wise
        # If the type is map then we are showing the data as sub county wise
        if request.GET.get("type") == "graph":
            group_by_cols = ["year", "month", "outcome"]
            result = query.filter(conditions).values("year", "month", "outcome")
        
        else:
            # if request.GET.get("sub_county_id"):
            #     group_by_cols = ["county_name" ,"sub_county_name", "sub_county_lat", "sub_county_long", "outcome"]
            # else:
            #     group_by_cols = ["county_name", "county_lat", "county_long", "outcome"]
            
            if not request.GET.get("county_id"):
                group_by_cols = ["country_name","county_name", "outcome"]
                result = query.filter(conditions).values(
                    "outcome", county_name = F("county__name"), country_name=F("country__name")
                    )
            else:
                group_by_cols = ["country_name", "county_name" ,"sub_county_name", "outcome"]
                result = query.filter(conditions).values(
                    "outcome", sub_county_name = F("sub_county__name"), county_name = F("county__name"), country_name = F("country__name")
                    )


        # Count the positive and negative cases
        if result:
            result = DashboardServices.count_rvf_cases_outcomes(self, result, group_by_cols)
            if not result.empty:
                result = result.to_dict(orient='records')

                for i in result:
                    if "positive_cases" not in i:
                        i['positive_cases'] = 0

                    if "negative_cases" not in i:
                        i['negative_cases'] = 0

        return result

        

    def count_rvf_cases_outcomes(self, data, group_by_cols):
        """
        Count the occurrences of '0' and '1' outcomes year and month-wise.
        """
        # Create a Pandas DataFrame from the data
        df = pd.DataFrame(data)

        # Group the data by year, month, and outcome, and calculate the counts
        result = df.groupby(group_by_cols).size().unstack(fill_value=0).reset_index()

        # Rename the columns for clarity
        result.columns.name = None  # Remove column index name
        result.rename(columns={0: 'negative_cases', 1: 'positive_cases'}, inplace=True)

        if 'month' in result.columns:
            result['month'] = pd.to_datetime(result['month'], format='%m').dt.strftime('%b')

        return result
    

    def add_mean_and_group_by_monthly(self, data):
        df = pd.DataFrame(data)

        # Convert to millis to date
        df['dates'] = pd.to_datetime(df['millis'], unit='ms')
        df['dates'] = pd.to_datetime(df['dates']).dt.strftime('%Y-%m')

        # Group by data with Month
        df = df.groupby(df['dates'])['data'].mean()
        
        # Reset index
        df =df.to_frame().reset_index()

        # Change month format
        df['dates'] = pd.to_datetime(df['dates'], format='%Y-%m').dt.strftime('%Y-%b')
        df['data'] = df['data'].round(2)

        df_dict = dict(df)
        
        # Mean Rainfall
        df_dict['mean_rainfall'] = df['data'].mean().round(2)

        return df_dict



def rainfall_timeseries(self, request, clip_data, rainfall_type):
    # Converting String date to datetime
    str_date_time = dt.datetime.strptime(request.data.get('end_date'), "%Y-%m-%d")
    
    current_start_date,current_end_date = BaseServices.get_start_and_end_dates(self, str_date_time.year,  str_date_time.month)
    
    # Modifying day as month end day
    str_date_time = current_end_date
    request.data['end_date'] = str(current_end_date)
    
    start_year = str_date_time.year  # recent end year
    past_years =  10# Past years

    graph_data = []
    iri_data = []
    def get_past_data(self, start_date, end_date, current_year, current_month):
        try:
            #Rainfall image
            if rainfall_type == 'chirps':
                rainfall_ext = AccumulatedRainfallChirpsHelper.get_accumulated_rainfall_chirps(self,start_date, end_date, clip_data, 'graph')
                image_start_date, scale, projection = GEEServices.get_image_metadata(self, constants.RAINFALL_CHIRPS_DATASET, constants.RAINFALL_CHIRPS_BAND_NAME)
                band = constants.RAINFALL_CHIRPS_BAND_NAME
            else:
                rainfall_ext = AccumulatedRainfallGPMHelper.get_accumulated_rainfall(self,start_date, end_date, clip_data, 'graph')
                
                image_start_date, scale, projection = GEEServices.get_image_metadata(self, constants.RAINFALL_DATASET, constants.RAINFALL_BAND_NAME)
                band = constants.RAINFALL_BAND_NAME
                
            spatial_aggreagtion = GEEServices.switch_spatial_aggregation(self, request.data['spatial_aggregation'])
            result = GEEServices.time_series_calculation(self, rainfall_ext, spatial_aggreagtion, scale, clip_data, band)
            
            if not result.empty: 
                graph_data.append(result)
            else:
                pass
        except:
            pass 
        
    thread_list = []
    
    # Fecting last 6 months of past years base on recent year and month
    for i in range(past_years):
        current_year = start_year - i
        
        past_months = 8 # Past months
        for j in range(past_months):
            start_date_val = datetime(current_year, str_date_time.month, 1) 
            # adding 1 month for historical data to do mean and std for past months in all years
            start_date_val = start_date_val + relativedelta(months=1)
            past_year_month = start_date_val - relativedelta(months = j)
            
            current_date = datetime.now()  # Current date
            
            # Fetching current month end date
            current_start_date,current_end_date = BaseServices.get_start_and_end_dates(self, current_date.year,  current_date.month)
            
            # sending to apis as start_date and end_date
            start_date,end_date = BaseServices.get_start_and_end_dates(self, past_year_month.year,  past_year_month.month)
            
            if (past_year_month.year == current_date.year and past_year_month.month == current_date.month) and (end_date > current_end_date - relativedelta(days=1)): 
                
                # If end day is less than 30 days, taking that date as end date and past one month is taking as start month
                forecast_date = dt.datetime.strptime(request.data.get('end_date'), "%Y-%m-%d")
                past_one_month, user_end_date = BaseServices.get_start_and_end_dates(self, forecast_date.year,  forecast_date.month)
                
                t =Thread(target = get_past_data, args=(self, past_one_month, user_end_date, past_year_month.year,  past_year_month.month))
                t.daemon = True
                t.start()
                thread_list.append(t)
            else:
                t =Thread(target = get_past_data, args=(self, start_date, end_date, past_year_month.year,  past_year_month.month))
                t.daemon = True
                t.start()
                thread_list.append(t)
     
    for j in thread_list:
        j.join()
    
    if graph_data:
        
        iri_forecasted_data = []
        def foreasted(self, ward_id):
            ''' 
            Fetching IRI data from the list based on ward code
            '''
            
            if iri_data:
                for k in iri_data:
                    if k['ward_code'] == ward_id:
                        iri_forecasted_data.append(pd.DataFrame(k['iri_data']))
            
        # Dataset enddate and user enddate
        gpm_indices     = GeeIndices.objects.get(slug = 'accumulated_rainfall_gpm')
        gpm_max_date    = dt.datetime.strptime(str(gpm_indices.max_date), "%Y-%m-%d")
        user_max_date   = dt.datetime.strptime(request.data.get('end_date'), "%Y-%m-%d")
        
        # If user end date is greater than dataset enddate
        if gpm_max_date < user_max_date:
            try:
                # Fetching iri data feom table and appending to iri_data list
                iri_forecast = IRIForecast.objects.all().values('ward_code', 'iri_data')
                for i in iri_forecast:
                    iri_data.append(
                        {'ward_code': i['ward_code'],
                        'iri_data':i['iri_data']})
                    
                ward_data = ''
                # Fetching ward ids based on location
                if request.data.get('adm2_name'):
                    location_id = sub_county.SubCounty.objects.filter(name__icontains = request.data.get('adm2_name')).values('id')
                    ward_data = ward.Ward.objects.filter(sub_county_id = location_id[0]['id']).values('code')
                    
                elif request.data.get('adm1_name'):
                    location_id = county.County.objects.filter(name = request.data.get('adm1_name')).values('id')
                    ward_data = ward.Ward.objects.filter(county_id = location_id[0]['id']).values('code')
                
                elif request.data.get('adm0_name'):
                    location_id = country.Country.objects.filter(name = request.data.get('adm0_name')).values('id')
                    ward_data = ward.Ward.objects.filter(country_id = location_id[0]['id']).values('code')
            except:
                pass
            
            for ward_codes in ward_data:
                t =Thread(target = foreasted, args=(self, ward_codes['code']))
                t.daemon = True
                t.start()
                thread_list.append(t)
                
            for j in thread_list:
                j.join() 
            
                
        iri_forecasted_date = []
        def forecast_iri_data():
            ''' 
            We are getting forecasted rainfall data and appending to accumulated rainfall gpm data.
            '''
            
            if iri_forecasted_data:
                
                df_1 =pd.concat(iri_forecasted_data, ignore_index=True)
                df_1 = df_1.groupby(['index', 'date'])['rainfall'].sum().reset_index()

                # Function to convert date range to milliseconds
                def date_range_to_millis(date_range):
                    start_date_str, end_date_str = date_range.split(' to ')
                    start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                    end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
                    return int((start_date - datetime(1970, 1, 1)).total_seconds() * 1000), int((end_date - datetime(1970, 1, 1)).total_seconds() * 1000)

                # Apply the function to the 'date' column and create 'millis_start' and 'millis_end' columns
                df_1[['millis_start', 'millis']] = df_1['date'].apply(date_range_to_millis).apply(pd.Series)
                df_1.drop(['millis_start', 'index', 'date'], axis=1, inplace=True)
                df_1.rename(columns={'rainfall': 'data'}, inplace=True)
                df_1['date'] = pd.to_datetime(df_1['millis'], unit='ms')
                
                # Gpm data
                graph_list = pd.concat(graph_data, ignore_index=True)
                graph_list['millis'] = pd.to_datetime(graph_list['millis'], unit='ms')
                latest_date = graph_list['millis'].max()
                
                # Taking forecasted data from IRI
                df_millis_filtered = df_1[df_1['date'] > latest_date]
                
                if not df_millis_filtered.empty:
                    # Fetching IRI forecasted month to show in the results
                    get_iri_forecast_month = df_millis_filtered['date'].tail(1).to_string(index=False)
                    iri_forecasted_date.append(get_iri_forecast_month)
                    
                    df_millis_filtered.drop(['date'], axis=1, inplace=True)
                    
                    # Appending IRI forecasted data to gpm data
                    graph_data.append(df_millis_filtered) 
                    
                    return True
            
                
        forecast_iri_data()       
        
        df = pd.concat(graph_data, ignore_index=True)
        df['millis'] = pd.to_datetime(df['millis'], unit='ms')
        df = df.drop_duplicates(subset='millis', keep='first')

        # Extract the year and month from the 'millis' column
        df['year'] = df['millis'].dt.year
        df['month'] = df['millis'].dt.month
        
        # Group by year and month, and calculate the average value for each group
        graph_data_df = df.groupby(['year', 'month'])['data'].sum().reset_index()

        graph_data_df_sort = graph_data_df.sort_values(by=['year', 'month']) # Sorting
        
        # Taking recent 6 months data
        tail_graph_data = graph_data_df_sort.tail(7).to_dict(orient="records")
        
        # Calculating mean and standard deviation
        grouped = graph_data_df_sort.groupby("month")
        mean_values = grouped["data"].agg(['mean', 'std'])
        mean_values.reset_index(inplace=True) # Adding indexing
        
        final_data = [] 
            
        for i in tail_graph_data:
            data = mean_values[mean_values['month'] == i['month']] # month comparision
            
            # Calculate the mean and standard deviation of the data from the recent 6 months data 
            data = (i['data'] - data['mean']) / data['std']

            final_data.append({"year": i['year'], "month": i['month'], "data":data})
        
        # Converting dataframe
        df = pd.DataFrame(final_data)
        df = df.tail(6)
        df = df.sort_values(by='month')
        df['year_month'] = df.apply(lambda row: f"{row['year']}-{month_abbr[row['month']]}".replace("-0", "-"), axis=1)
        mean_rainfall = df.groupby('year_month')['data'].mean().reset_index()

        # Sort the DataFrame by 'year_month' in ascending order
        mean_rainfall['year_month'] = pd.to_datetime(mean_rainfall['year_month'], format='%Y-%b')
        mean_rainfall = mean_rainfall.sort_values(by='year_month')
        
        if iri_forecasted_date:
            dates = mean_rainfall['year_month'].dt.strftime('%Y-%b').tolist()
            dates[-1] = f"{dates[-1]} (till {iri_forecasted_date[-1]})"
        else:
            dates = mean_rainfall['year_month'].dt.strftime('%Y-%b').tolist()
        
        # Create the desired structure
        result = {
            "dates":dates,
            "data": [round(val, 2) for val in mean_rainfall['data'].tolist()],
            "mean_rainfall": round(mean_rainfall['data'].mean(), 2)
        }
        
        return result
    else:
        return False
    
    
    
    
def forecast_rainfall_map(self, request, clip_data, iri_data, rainfall_type):
    
    # Converting String date to datetime
    str_date_time = dt.datetime.strptime(request.data.get('end_date'), "%Y-%m-%d")
    
    start_year = str_date_time.year  # recent end year
    past_years =  10# Past years

    graph_data = [] # GPM data
    
    def get_past_data(self, start_date, end_date, current_year, current_month):
        try:
            #Rainfall image
            if rainfall_type == 'chirps':
                rainfall_ext = AccumulatedRainfallChirpsHelper.get_accumulated_rainfall_chirps(self,start_date, end_date, clip_data, 'graph')
                image_start_date, scale, projection = GEEServices.get_image_metadata(self, constants.RAINFALL_CHIRPS_DATASET, constants.RAINFALL_CHIRPS_BAND_NAME)
                band = constants.RAINFALL_CHIRPS_BAND_NAME
            else:
                rainfall_ext = AccumulatedRainfallGPMHelper.get_accumulated_rainfall(self,start_date, end_date, clip_data, 'graph')
                #image_start_date, scale, projection = GEEServices.get_image_metadata(self, constants.RAINFALL_DATASET, constants.RAINFALL_BAND_NAME)
                scale = constants.RAINFALL_SCALE
                band = constants.RAINFALL_BAND_NAME
                
            spatial_aggreagtion = GEEServices.switch_spatial_aggregation(self, request.data['spatial_aggregation'])
            result = GEEServices.time_series_calculation(self, rainfall_ext, spatial_aggreagtion, scale, clip_data, band)
            if not result.empty: 
                graph_data.append(result)
            else: 
                pass
        except:
            pass 
        
    thread_list = []
    
    # Fecting last 3 months of past years base on recent year and month
    for i in range(past_years):
        current_year = start_year - i
        
        past_months = 1 # Past months
        for j in range(past_months): 
            start_date_val = datetime(current_year, str_date_time.month, 1) 
            # adding 1 month for historical data to do mean and std for past months in all years
            # start_date_val = start_date_val + relativedelta(months=0)
            past_year_month = start_date_val - relativedelta(months = j)
            
            current_date = datetime.now()  # Current date
            
            # Fetching current month end date
            current_start_date,current_end_date = BaseServices.get_start_and_end_dates(self, current_date.year,  current_date.month)
            
            # sending to apis as start_date and end_date
            start_date,end_date = BaseServices.get_start_and_end_dates(self, past_year_month.year,  past_year_month.month)
            
            if (past_year_month.year == current_date.year and past_year_month.month == current_date.month) and (end_date > current_end_date - relativedelta(days=1)): 
                
                # If end day is less than 30 days, taking that  date as end date and past one month is taking as start month
                dataset_end_time = dt.datetime.strptime(request.data.get('end_date'), "%Y-%m-%d")
                past_one_month =  dataset_end_time - relativedelta(months=1)
                
                t =Thread(target = get_past_data, args=(self, past_one_month.date(), dataset_end_time.date(), past_year_month.year,  past_year_month.month))
                t.daemon = True
                t.start()
                thread_list.append(t)
            else:
                t =Thread(target = get_past_data, args=(self, start_date, end_date, past_year_month.year,  past_year_month.month))
                t.daemon = True
                t.start()
                thread_list.append(t)
     
    for j in thread_list:
        j.join()
        
    if graph_data:
        
        iri_forecasted_data = []
        
        def foreasted(self, ward_id):
            ''' 
            Fetching IRI data from the list based on ward code
            '''
            
            if iri_data:
                for k in iri_data:
                    if k['ward_code'] == ward_id:
                        iri_forecasted_data.append(pd.DataFrame(k['iri_data']))
            
        # Dataset enddate and user enddate
        gpm_indices     = GeeIndices.objects.get(slug = 'accumulated_rainfall_gpm')
        gpm_max_date    = dt.datetime.strptime(str(gpm_indices.max_date), "%Y-%m-%d")
        user_max_date   = dt.datetime.strptime(request.data.get('end_date'), "%Y-%m-%d")
        
        # If user end date is greater than dataset enddate
        if gpm_max_date < user_max_date:
            try:
                ward_data = ''
                # Fetching ward ids based on location
                if request.data.get('adm2_name'):
                    location_id = sub_county.SubCounty.objects.filter(name__icontains = request.data.get('adm2_name')).values('id')
                    ward_data = ward.Ward.objects.filter(sub_county_id = location_id[0]['id']).values('code')
                    
                elif request.data.get('adm1_name'):
                    location_id = county.County.objects.filter(name = request.data.get('adm1_name')).values('id')
                    ward_data = ward.Ward.objects.filter(county_id = location_id[0]['id']).values('code')
                
                elif request.data.get('adm0_name'):
                    location_id = country.Country.objects.filter(name = request.data.get('adm0_name')).values('id')
                    ward_data = ward.Ward.objects.filter(country_id = location_id[0]['id']).values('code')
            except:
                pass
            
            for ward_codes in ward_data:
                t =Thread(target = foreasted, args=(self, ward_codes['code']))
                t.daemon = True
                t.start()
                thread_list.append(t)
                
            for j in thread_list:
                j.join() 
            
            
        iri_forecasted_date = []
        def forecast_iri_data():
            ''' 
            We are getting forecasted rainfall data and appending to accumulated rainfall gpm data.
            '''
            
            if iri_forecasted_data:
                
                df_1 =pd.concat(iri_forecasted_data, ignore_index=True)
                df_1 = df_1.groupby(['index', 'date'])['rainfall'].sum().reset_index()

                # Function to convert date range to milliseconds
                def date_range_to_millis(date_range):
                    start_date_str, end_date_str = date_range.split(' to ')
                    start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
                    end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
                    return int((start_date - datetime(1970, 1, 1)).total_seconds() * 1000), int((end_date - datetime(1970, 1, 1)).total_seconds() * 1000)

                # Apply the function to the 'date' column and create 'millis_start' and 'millis_end' columns
                df_1[['millis_start', 'millis']] = df_1['date'].apply(date_range_to_millis).apply(pd.Series)
                df_1.drop(['millis_start', 'index', 'date'], axis=1, inplace=True)
                df_1.rename(columns={'rainfall': 'data'}, inplace=True)
                df_1['date'] = pd.to_datetime(df_1['millis'], unit='ms')
                
                # Gpm data
                graph_list = pd.concat(graph_data, ignore_index=True)
                graph_list['millis'] = pd.to_datetime(graph_list['millis'], unit='ms')
                latest_date = graph_list['millis'].max()
                
                # Taking forecasted data from IRI
                df_millis_filtered = df_1[df_1['date'] > latest_date]
                
                last_month = df_1['date'].max()
                last_month_data = df_1[df_1['date'].dt.to_period('M') == last_month.to_period('M')]
                
                # If user end date is greater than the iri forecast end date
                if not (len(last_month_data) >=3) and (str_date_time.year >= last_month.year) and (str_date_time.month >= last_month.month) :
                    return False
               
                # If there is data available for the latest month spanning three weeks.
                if len(last_month_data) >= 3:
                    
                    # Fetching IRI forecasted month to show in the results
                    get_iri_forecast_month = df_millis_filtered['date'].tail(1).to_string(index=False)
                    iri_forecasted_date.append(get_iri_forecast_month)
                    
                    df_millis_filtered.drop(['date'], axis=1, inplace=True)
                    
                    # Appending IRI forecasted data to gpm data
                    graph_data.append(df_millis_filtered) 
                
                    return True
                
                # Except latest month reaming data taking.
                else:
                    remaining_data = df_1[~(df_1['date'].dt.to_period('M') == last_month.to_period('M'))]
                    
                    # Fetching IRI forecasted month to show in the results
                    get_iri_forecast_month = remaining_data['date'].tail(1).to_string(index=False)
                    iri_forecasted_date.append(get_iri_forecast_month)
                    
                    remaining_data.drop(['date'], axis=1, inplace=True)
                    
                    # Appending IRI forecasted data to gpm data
                    graph_data.append(remaining_data) 

                    return True
            
            else:
                return True
               
        is_trure = forecast_iri_data() 
        
        if not is_trure:
            ''' If user end date is greater than the iri forecast end date'''
            return False
        
        df = pd.concat(graph_data, ignore_index=True)
        df['millis'] = pd.to_datetime(df['millis'], unit='ms')
        df = df.drop_duplicates(subset='millis', keep='first')

        # Extract the year and month from the 'millis' column
        df['year'] = df['millis'].dt.year
        df['month'] = df['millis'].dt.month
        
        # Group by year and month, and calculate the average value for each group
        graph_data_df = df.groupby(['year', 'month'])['data'].sum().reset_index()

        graph_data_df_sort = graph_data_df.sort_values(by=['year', 'month']) # Sorting
        
        # Cheking user selected end in GPM
        filter_data = graph_data_df_sort[(graph_data_df_sort['month'] == str_date_time.month) & (graph_data_df_sort['year'] == str_date_time.year)] 
        if not filter_data.empty :
            # Taking recent 1 months data
            tail_graph_data = filter_data.tail(1).to_dict(orient="records")
            
            # Calculating mean and standard deviation
            grouped = graph_data_df_sort.groupby("month")
            mean_values = grouped["data"].agg(['mean', 'std'])
            mean_values.reset_index(inplace=True) # Adding indexing
 
            final_data = [] 
                
            for i in tail_graph_data:
                data = mean_values[mean_values['month'] == i['month']] # month comparision
                
                # Calculate the mean and standard deviation of the data from the recent 6 months data 
                data = (i['data'] - data['mean']) / data['std']

                final_data.append({"year": i['year'], "month": i['month'], "data":data})
            
            # Converting dataframe
            df = pd.DataFrame(final_data)
            df = df.sort_values(by='month')
            
            df['year_month'] = df.apply(lambda row: f"{row['year']}-{month_abbr[row['month']]}".replace("-0", "-"), axis=1)
           
            mean_rainfall = df.groupby('year_month')['data'].mean().reset_index()

            # Sort the DataFrame by 'year_month' in ascending order
            mean_rainfall['year_month'] = pd.to_datetime(mean_rainfall['year_month'], format='%Y-%b')
            mean_rainfall = mean_rainfall.sort_values(by='year_month')
            
            dates = mean_rainfall['year_month'].dt.strftime('%Y-%b').tolist()
                
            z_score_val = [round(val, 2) for val in mean_rainfall['data'].tolist()][0]
            
            if z_score_val <= 1:
                colour = "#F2B28B"
                
            elif 1 < z_score_val <= 2:
                colour = "#D07A49"
                
            elif z_score_val > 2:
                colour = "#D5461F"
                     
            # Create the desired structure
            result = {
                "country_name":request.data['adm0_name'],
                "county_name":request.data['adm1_name'],
                "sub_county_name":request.data['adm2_name'],
                "date":dates[0],
                "value": z_score_val,
                "colour": colour
            }
            return result
        else:
            pass
        
    else:
        return False
    
    ##################################################################################
    
class RainfallCHIRPSStatic:
    
    def z_score_rainfall_chirps(self, request, clip_data, rainfall_type):
        # Converting String date to datetime
        str_date_time = dt.datetime.strptime('2024-07-31', "%Y-%m-%d")
        
        #from may to july months data
        final_data = [] 
        for i in range(0,3):
            if i != 0:
                str_date_time = str_date_time-relativedelta(months=1)
        
            current_start_date,current_end_date = BaseServices.get_start_and_end_dates(self, str_date_time.year,  str_date_time.month)
            
            # Modifying day as month end day
            str_date_time = current_end_date
            request.data['end_date'] = str(current_end_date)
            
            start_year = str_date_time.year  # recent end year

            graph_data = []
            iri_data = []
            def get_past_data(self, start_date, end_date, current_year, current_month):
                try:
                    #Rainfall image
                    if rainfall_type == 'chirps':
                        rainfall_ext = AccumulatedRainfallChirpsHelper.get_accumulated_rainfall_chirps(self,start_date, end_date, clip_data, 'graph')
                        image_start_date, scale, projection = GEEServices.get_image_metadata(self, constants.RAINFALL_CHIRPS_DATASET, constants.RAINFALL_CHIRPS_BAND_NAME)
                        band = constants.RAINFALL_CHIRPS_BAND_NAME
                    else:
                        rainfall_ext = AccumulatedRainfallGPMHelper.get_accumulated_rainfall(self,start_date, end_date, clip_data, 'graph')
                        
                        image_start_date, scale, projection = GEEServices.get_image_metadata(self, constants.RAINFALL_DATASET, constants.RAINFALL_BAND_NAME)
                        band = constants.RAINFALL_BAND_NAME
                        
                    spatial_aggreagtion = GEEServices.switch_spatial_aggregation(self, request.data['spatial_aggregation'])
                    result = GEEServices.time_series_calculation(self, rainfall_ext, spatial_aggreagtion, scale, clip_data, band)
                    
                    if not result.empty: 
                        graph_data.append(result)
                    else:
                        pass
                except:
                    pass 
                
            thread_list = []
            
                
            past_months = 7 # Past months
            for j in range(past_months):
                start_date_val = datetime(str_date_time.year, str_date_time.month, 1) 
                past_year_month = start_date_val - relativedelta(months = j)
                
                current_date = datetime.now()  # Current date
                
                # Fetching current month end date
                current_start_date,current_end_date = BaseServices.get_start_and_end_dates(self, current_date.year,  current_date.month)
                
                # sending to apis as start_date and end_date
                start_date,end_date = BaseServices.get_start_and_end_dates(self, past_year_month.year,  past_year_month.month)
                
                if (past_year_month.year == current_date.year and past_year_month.month == current_date.month) and (end_date > current_end_date - relativedelta(days=1)): 
                    
                    # If end day is less than 30 days, taking that date as end date and past one month is taking as start month
                    forecast_date = dt.datetime.strptime(request.data.get('end_date'), "%Y-%m-%d")
                    past_one_month, user_end_date = BaseServices.get_start_and_end_dates(self, forecast_date.year,  forecast_date.month)
                    
                    t =Thread(target = get_past_data, args=(self, past_one_month, user_end_date, past_year_month.year,  past_year_month.month))
                    t.daemon = True
                    t.start()
                    thread_list.append(t)
                else:
                    t =Thread(target = get_past_data, args=(self, start_date, end_date, past_year_month.year,  past_year_month.month))
                    t.daemon = True
                    t.start()
                    thread_list.append(t)
            
            for j in thread_list:
                j.join()
            
            
            if graph_data:
                
                df = pd.concat(graph_data, ignore_index=True)
                df['millis'] = pd.to_datetime(df['millis'], unit='ms')
                df = df.drop_duplicates(subset='millis', keep='first')

                # Extract the year and month from the 'millis' column
                df['year'] = df['millis'].dt.year
                df['month'] = df['millis'].dt.month
                
                # Group by year and month, and calculate the average value for each group
                graph_data_df = df.groupby(['year', 'month'])['data'].sum().reset_index()

                graph_data_df_sort = graph_data_df.sort_values(by=['year', 'month']) # Sorting
                
                graph_data_df_sort = graph_data_df_sort.sort_values(by=["year", "month"], ascending=[False, False])

                # Taking recent 6 months data
                tail_graph_data = graph_data_df_sort.head(6).to_dict(orient="records")
                
                past_six_months = pd.DataFrame(tail_graph_data)
                
                latest_data = past_six_months.iloc[0]

                mean = past_six_months['data'].mean()
                std_dev = past_six_months['data'].std()
                
                
                z_score = (latest_data - mean) / std_dev
                
                # Create final data with z-score for the latest year-month
                final_data.append({"year": latest_data['year'], "month": latest_data['month'], "data": z_score})
        
        # Extract months and years
        months = [int(entry['month']) for entry in final_data]
        years = [int(entry['year']) for entry in final_data]

        # Define the range of months based on the data
        start_month = min(months)
        end_month = max(months)

        # Generate month names dynamically
        all_months = [pd.to_datetime(f'{month}', format='%m').strftime('%b') for month in range(start_month, end_month + 1)]

        # Generate the full list of months for the year
        all_dates = [f'2024-{month}' for month in all_months]

        # Initialize result dictionary
        result_data = dict.fromkeys(all_dates, 0)

        # Extract and update values
        for entry in final_data:
            year = int(entry['year'])
            month = int(entry['month'])
            month_name = pd.to_datetime(f'{month}', format='%m').strftime('%b')
            date_key = f'{year}-{month_name}'
            if date_key in result_data:
                result_data[date_key] = entry['data']['data']

        # Prepare final result with rounded values
        result = {
            "dates": all_dates,
            "data": [round(result_data[date], 2) for date in all_dates],
            "mean_rainfall": round(sum(result_data.values()) / len(result_data), 2)
        }

        return result
        
        
        
  ###############################################################################      
    def forecast_rainfall_map(self, request, clip_data, iri_data, rainfall_type):
        
        # Converting String date to datetime
        str_date_time = dt.datetime.strptime(request.data['end_date'], "%Y-%m-%d")
        
        #from may to july months data
        final_data = [] 
        
        current_start_date,current_end_date = BaseServices.get_start_and_end_dates(self, str_date_time.year,  str_date_time.month)
        
        # Modifying day as month end day
        str_date_time = current_end_date
        request.data['end_date'] = str(current_end_date)
        

        graph_data = []
        def get_past_data(self, start_date, end_date, current_year, current_month):
            
            try:
                #Rainfall image
                if rainfall_type == 'chirps':
                    rainfall_ext = AccumulatedRainfallChirpsHelper.get_accumulated_rainfall_chirps(self,start_date, end_date, clip_data, 'graph')
                    image_start_date, scale, projection = GEEServices.get_image_metadata(self, constants.RAINFALL_CHIRPS_DATASET, constants.RAINFALL_CHIRPS_BAND_NAME)
                    band = constants.RAINFALL_CHIRPS_BAND_NAME
                else:
                    rainfall_ext = AccumulatedRainfallGPMHelper.get_accumulated_rainfall(self,start_date, end_date, clip_data, 'graph')
                    
                    image_start_date, scale, projection = GEEServices.get_image_metadata(self, constants.RAINFALL_DATASET, constants.RAINFALL_BAND_NAME)
                    band = constants.RAINFALL_BAND_NAME
                    
                spatial_aggreagtion = GEEServices.switch_spatial_aggregation(self, request.data['spatial_aggregation'])
                result = GEEServices.time_series_calculation(self, rainfall_ext, spatial_aggreagtion, scale, clip_data, band)
                
                if not result.empty: 
                    graph_data.append(result)
                else:
                    pass
            except:
                pass 
            
        thread_list = []
        
            
        past_months = 7 # Past months
        for j in range(past_months):
            start_date_val = datetime(str_date_time.year, str_date_time.month, 1) 
            past_year_month = start_date_val - relativedelta(months = j)
            
            current_date = datetime.now()  # Current date
            
            # Fetching current month end date
            current_start_date,current_end_date = BaseServices.get_start_and_end_dates(self, current_date.year,  current_date.month)
            
            # sending to apis as start_date and end_date
            start_date,end_date = BaseServices.get_start_and_end_dates(self, past_year_month.year,  past_year_month.month)
            
            if (past_year_month.year == current_date.year and past_year_month.month == current_date.month) and (end_date > current_end_date - relativedelta(days=1)): 
                
                # If end day is less than 30 days, taking that date as end date and past one month is taking as start month
                forecast_date = dt.datetime.strptime(request.data.get('end_date'), "%Y-%m-%d")
                past_one_month, user_end_date = BaseServices.get_start_and_end_dates(self, forecast_date.year,  forecast_date.month)
                
                t =Thread(target = get_past_data, args=(self, past_one_month, user_end_date, past_year_month.year,  past_year_month.month))
                t.daemon = True
                t.start()
                thread_list.append(t)
            else:
                t =Thread(target = get_past_data, args=(self, start_date, end_date, past_year_month.year,  past_year_month.month))
                t.daemon = True
                t.start()
                thread_list.append(t)
        
        for j in thread_list:
            j.join()
        
        
        if graph_data:
            
            df = pd.concat(graph_data, ignore_index=True)
            df['millis'] = pd.to_datetime(df['millis'], unit='ms')
            df = df.drop_duplicates(subset='millis', keep='first')

            # Extract the year and month from the 'millis' column
            df['year'] = df['millis'].dt.year
            df['month'] = df['millis'].dt.month
            
            # Group by year and month, and calculate the average value for each group
            graph_data_df = df.groupby(['year', 'month'])['data'].sum().reset_index()
            graph_data_df_sort = graph_data_df.sort_values(by=['year', 'month']) # Sorting
            graph_data_df_sort = graph_data_df_sort.sort_values(by=["year", "month"], ascending=[False, False])

            # Taking recent 6 months data
            tail_graph_data = graph_data_df_sort.head(6).to_dict(orient="records")
            
            past_six_months = pd.DataFrame(tail_graph_data)
            
            # If the latest date is exist (end_date)
            date_exists = ((past_six_months['year'] == str_date_time.year) & (past_six_months['month'] == str_date_time.month)).any()

            
            if not date_exists:
                return False
            
            # Calculating z-square value
            latest_data = past_six_months.iloc[0]
            
            mean = past_six_months['data'].mean()
            std_dev = past_six_months['data'].std()
            z_score = (latest_data - mean) / std_dev
            
            # Create final data with z-score for the latest year-month
            final_data.append({"year": latest_data['year'], "month": latest_data['month'], "data": z_score})
            
        if final_data:
            # Function to determine color based on Z-score
            def get_color(z_score):
                if z_score <= 1:
                    return "#F2B28B"
                elif 1 < z_score <= 2:
                    return "#D07A49"
                else:
                    return "#D5461F"

            # Create response list
            responses = []
            for entry in final_data:
                year = int(entry['year'])
                month = int(entry['month'])
                month_name = pd.to_datetime(f'{month}', format='%m').strftime('%b')
                date_key = f'{year}-{month_name}'
                z_score_val = entry['data']['data']
                colour = get_color(z_score_val)
                
                response = {
                    "country_name":request.data['adm0_name'],
                    "county_name":request.data['adm1_name'],
                    "sub_county_name":request.data['adm2_name'],
                    "date": date_key,
                    "value": round(z_score_val, 2),
                    "colour": colour
                }
                responses.append(response)
            
            return response
        return False