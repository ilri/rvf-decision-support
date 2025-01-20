
#Genric
import ee
from threading import Thread
import requests
from concurrent.futures import ThreadPoolExecutor
import os
import json

# Date
from datetime import date, datetime, timedelta
from datetime import datetime as dt
import pytz
from dateutil.relativedelta import relativedelta

# Settings
from decouple import config
from google.cloud import storage
from django.conf import settings

# GDAL
from osgeo import gdal, ogr,osr

# Pandas
import geopandas as gpd
from rasterstats import zonal_stats
import pandas as pd

# Pickel
import pickle

#constants
from base import constants

#Models
from dashboard.models.gee_indices import GeeIndices
from location.models import ward, country
from dashboard.models.iri_forecast import IRIForecast
from modeling.models.block_data import BlockData

class LambdaServices:

    def get_dataset_end_date_store_in_db(self, each_ind_data):
            """ Fetching dataset(image/image collection) end date and storing into DB """
            
            #converting to ImageCollection
            conv_img_col = ee.ImageCollection(str(each_ind_data['dataset'])) 
            
            #Fetching last image
            lastimg = conv_img_col.limit(1, 'system:time_start', False).first() 
            
            #fetching last image date
            dataset_end_date = ee.Date(lastimg.get('system:time_start')) 
            
            #converting to date
            end_date = dt.fromtimestamp(dataset_end_date.getInfo()['value'] / constants.LAMBDA_GEE_DATASET_ENDDATE_TIMESTAMP_DIVIDE_VALUE).strftime(constants.DATE_FORMAT)

            GeeIndices.objects.filter(id= each_ind_data['id']).update(max_date = end_date, updated_date = dt.now(pytz.utc))
            
    # Inserting IRI forecasted data 
    def upload_iri_data(self):
        
        def get_iri_data_from_api(ward_id):
            '''
            fetching all ward codes 
            Fetching data from IRI API
            inserting to database
            '''
            
            # IRI endpoint URL
            url = constants.IRI_FORECAST_URL

            # JSON payload for IRI
            data = {
                "wardCode": ward_id,
                "dataSrcId": constants.IRI_dataSrcId
            }
            
            # Inserting IRI data to DB
            try:
                response = requests.post(url, json=data)
                if response.status_code == 200:
                    response_data = response.json()
                    
                    if not IRIForecast.objects.filter(ward_code = ward_id).exists():
                        IRIForecast.objects.create(ward_code = ward_id, iri_data = response_data['data'])
                    
                    elif not IRIForecast.objects.filter(ward_code = ward_id, iri_data = response_data['data']).exists():
                        IRIForecast.objects.filter(ward_code = ward_id).update(iri_data = response_data['data'])
            except:
                pass
        
        # Fetching all ward codes
        ward_data = ward.Ward.objects.all().values('code')
        ward_ids = []
        if ward_data:
            '''
            Appending all ward ids to list
            '''
            for ward_codes in ward_data:
                ward_ids.append(ward_codes['code'])
        
        # Threading 
        num_threads = 15
        with ThreadPoolExecutor(max_workers=num_threads) as executor:
            executor.map(get_iri_data_from_api, ward_ids)
        
        return True
    
    
    def store_gpm_iri_data(self):
        ''' Storing GPM and IRI data only for Kenya Country '''
        
        # Check if the folder exists
        if os.path.exists(constants.GPM_IRI_STATIC_RESPONSE):
            # Iterate through all files in the folder
            for file_name in os.listdir(constants.GPM_IRI_STATIC_RESPONSE):
                file_path = os.path.join(constants.GPM_IRI_STATIC_RESPONSE, file_name)
                
                # Check if it's a file (not a directory)
                if os.path.isfile(file_path):
                    os.remove(file_path)
        
        # gpm_indices     = GeeIndices.objects.get(slug = 'accumulated_rainfall_gpm')
        
        gpm_indices     = GeeIndices.objects.get(slug = 'accumulated_rainfall_chrips')
        
        gpm_max_date    = dt.strptime(str(gpm_indices.max_date), "%Y-%m-%d")
        
        ################# GPM Timeseries ######################
        # GPM endpoint URL 
        # url = f'{constants.BE_LINK}dashboard/accumulated_rainfall/gpm/timeseries'
        
        url = f'{constants.BE_LINK}dashboard/accumulated_rainfall/chirps/timeseries'
        
        headers = {
            'Referer': constants.BE_LINK 
        }
         
        # JSON payload for IRI
        data = {
                "adm0_name": "Kenya",
                "spatial_aggregation": "mean",
                "start_date": str((gpm_max_date - relativedelta(months = 1)).date()),
                "end_date": str(gpm_max_date.date()),
                }
        
        # Specify the file path where you want to save the JSON file
        gpm_json_file_path = f"{constants.GPM_IRI_STATIC_RESPONSE}/chirps_{str(gpm_max_date.date())}.json"

        # Check if the file already exists
        if os.path.exists(gpm_json_file_path):
            pass
        else:
            response = requests.post(url, headers=headers, json=data)
            if response.status_code == 200:
                response_data = response.json()

                # Write response_data to JSON file
                with open(gpm_json_file_path, 'w') as json_file:
                    json.dump(response_data, json_file)

        ############# IRI forecast map ##################
        from base.services import BaseServices
        
        forecast_max_date = gpm_max_date + relativedelta(months = 1)
        PAST_MONTHS = 7
        for i in range(PAST_MONTHS):
            past_month = forecast_max_date - relativedelta(months = i)
            start_date, end_date = BaseServices.get_start_and_end_dates(self, past_month.year,  past_month.month)
        
            # IRI endpoint URL
            # iri_url = f'{constants.BE_LINK}dashboard/accumulated_rainfall/gpm/forecast/map'
            
            iri_url = f'{constants.BE_LINK}dashboard/accumulated_rainfall/chirps/forecast/map'
            
            # JSON payload for IRI 
            data = {
                    "adm0_name": "Kenya",
                    "spatial_aggregation": "mean",
                    "start_date": str(start_date),
                    "end_date": str(end_date)
                    }
            
            # Specify the file path where you want to save the JSON file
            iri_json_file_path = f"{constants.GPM_IRI_STATIC_RESPONSE}/iri_{str(end_date)}.json"

            # Check if the file already exists
            if os.path.exists(iri_json_file_path):
                pass
            else:
                response = requests.post(iri_url, headers=headers, json=data)
                if response.status_code == 200:
                    response_data = response.json()

                    # Write response_data to JSON file
                    with open(iri_json_file_path, 'w') as json_file:
                        json.dump(response_data, json_file)
                else:
                    with open(iri_json_file_path, 'w') as json_file:
                        json.dump(response.json(), json_file)
                    
        return True
        
        
class GeeIndicesServices:

    def get_dataset_end_dateand(self):
        try:
            # Fetching all datasets
            ind_data = GeeIndices.objects.filter(status = True).values('id','dataset')
            
            #Aplliying thread to each dataset.
            for each_ind_data in ind_data:
                if each_ind_data['dataset']:
                    Thread(target = LambdaServices.get_dataset_end_date_store_in_db, args = (self,each_ind_data)).start()
            
            return True
        
        except Exception as error:
            return False
        
        
class ModelingServices:
    
    def make_raster_from_shp(forecated_year, forecated_month):
        ''' 
        Updating predicted values in shp file based on the block id
        Creating raster file using shape file with crs 32736
        modifying CRS 4326 to genarted raster file
        uploading 4326 raster file to GCP
        '''
        
        
        ''' To update predicted values in shp file based on block id '''

        block_data = BlockData.objects.filter(status = True).values('block_id', 'predicted')
        block_data_dict = {entry['block_id']: entry['predicted'] for entry in block_data}

        # Step 2: Read the shapefile
        shapefile_path = f"{constants.SHP_FILE_PATH}/32736/ken_5km_predicted_32736.shp"
        gdf = gpd.read_file(shapefile_path)

        # Step 3: Update predicted values in the GeoDataFrame based on block_data
        gdf['predicted'] = gdf['block_id'].map(block_data_dict)

        # Step 4: Write the modified GeoDataFrame back to the shapefile
        gdf.to_file(shapefile_path)
        
        
        ''' Creating raster file by using shpe file (CRS:32736) '''
        
        input_shp = ogr.Open(f"{constants.SHP_FILE_PATH}/32736")
        source_layer = input_shp.GetLayer()
        
        # Creating ratser from shapefile 
        out_raster_location = f"{constants.RASTER_FILE_PATH}/32736_raster.tif"
        pixel_size = 5000
        xmin, xmax, ymin, ymax = source_layer.GetExtent()
        x_res = int(round((xmax - xmin) / pixel_size))
        y_res = int(round((ymax - ymin) / pixel_size))

        # Create the output raster
        target_ds = gdal.GetDriverByName('GTiff').Create(out_raster_location, x_res, y_res, 1, gdal.GDT_Int32, ['COMPRESS=LZW'])

        # Set the geotransform
        target_ds.SetGeoTransform((xmin, pixel_size, 0, ymax, 0, -pixel_size))

        # Set the spatial reference
        sr = osr.SpatialReference()
        sr.ImportFromEPSG(32736)  # UTM Zone 36S
        target_ds.SetProjection(sr.ExportToWkt())

        # Set NoData value
        band = target_ds.GetRasterBand(1)
        band.SetNoDataValue(-999)
        band.Fill(-999)

        # Rasterize the layer
        gdal.RasterizeLayer(target_ds, [1], source_layer, options=['ALL_TOUCHED=TRUE', 'ATTRIBUTE=Predicted'])

        # Close the dataset
        target_ds = None
        
        ''' Making CRS 4326 to a raster file '''
        
        # Input and output frile paths
        input_raster_path = out_raster_location
        output_raster_path = f"{constants.RASTER_FILE_PATH}/4326_raster.tif"

        # Open the input raster
        input_raster = gdal.Open(input_raster_path)

        # Define the output projection
        output_projection = 'EPSG:4326'

        # Reproject the raster
        gdal.Warp(output_raster_path, input_raster, dstSRS=output_projection, format='COG')

        # Close the input raster
        input_raster = None
        
        
        ''' Uploading raster files to GCP '''
       
        # tiff_file_path = 'path_to_your_tiff_file.tif'
        tiff_file_path = output_raster_path

        # Specify the name for the file in the bucket
        destination_blob_name = f"{constants.GCP_RASTE_DIR}/kenya_predicted_raster_{forecated_year}-{forecated_month}.tif"
        
        key = os.path.join(settings.BASE_DIR, config('GEE_PRIVATE_KEY_PATH'))
        client = storage.Client.from_service_account_json(key)
        bucket = client.get_bucket(constants.GCP_BUCKET)
        
        
        blob = bucket.blob(f'{destination_blob_name}')
        blob.upload_from_filename(f'{tiff_file_path}')
        
        return True
    
    def predicted_raster(self):
        ''' Creating raster file for 21 days noaa precipitation and temperature '''
        
        country_qry = country.Country.objects.filter(name= 'Kenya',status = True).values('adm0_feature_collection')
        
        clip_data = ee.FeatureCollection(country_qry[0]['adm0_feature_collection']).geometry()
        
        # Date manipulation for forecasted 16 days and past 5 days
        date_1 = {
            "2": {
                "start_date": str(date.today()),
                "end_date": str(date.today() + timedelta(days=15)),
            },
            "1": {
                "start_date": str(date.today() - timedelta(days=5)),
                "end_date": str(date.today() - timedelta(days=1)),
            },
        }
        
        for noaa_bands in [constants.NOAA_PRECIPITATION_BAND_, constants.NOAA_TEMPERATURE_BAND]:
            img_col_list = []  # Creating empty imgecollection list
            
            for dt in (1, 2):  # past and forecast dates
                start_date = date_1[str(dt)]["start_date"]
                end_date = date_1[str(dt)]["end_date"]
                today_date = date.today()

                # if user enters start is less than today date then considering user start date otherwise today date as start date.
                initial_date = (
                    start_date if start_date <= str(today_date) else str(today_date)
                )

                # Start point and End point
                start_point = int(
                    (
                        datetime.strptime(start_date, constants.DATE_FORMAT).date()
                        - datetime.strptime(initial_date, constants.DATE_FORMAT).date()
                    ).days
                )
                end_point = int(
                    (
                        datetime.strptime(end_date, constants.DATE_FORMAT).date()
                        - datetime.strptime(initial_date, constants.DATE_FORMAT).date()
                    ).days
                )
                hours_listing = []  # Hours listing

                while start_point <= (end_point):
                    value = start_point * 24 # Here 24 Hours is 1 day.
                    if value > 0:
                        hours_listing.append(value)
                    start_point += 1

                # Initial Date (where we start get data from this date)
                ini_date = ee.Date(initial_date)

                # Data Collection behalf of Noaa Datasets
                data_collection = ee.ImageCollection(constants.NOAA_DATASET)

                # Bands
                #collection = data_collection.select(noaa_bands).filterDate(ini_date.advance(-1, 'day'), ini_date.advance(1, 'day')).sort('system:time_start', False)
                collection = data_collection.filterDate(ini_date.advance(-1, 'day'), ini_date.advance(1, 'day')).filter(ee.Filter.neq('forecast_hours', 0)).select(noaa_bands).sort('system:time_start', False)


                # forecast hours
                def forecast(hours):
                    image = collection.filter(ee.Filter.eq('forecast_hours', hours)).first() #collection.filterMetadata("forecast_hours", "equals", hours).first()
                    img_date = image.date().advance(hours, "hours")
                    return image.set("date", img_date.format())

                # Dataset
                noaa_dataset = ee.ImageCollection(
                    ee.List(hours_listing).map(lambda hours: forecast(hours))
                ).mean()
                
                noaa_dataset.updateMask(noaa_dataset.gt(0)) if noaa_bands == constants.NOAA_PRECIPITATION_BAND_ else noaa_dataset
                
                img_col_list.append(noaa_dataset)

            combine_img = ee.ImageCollection(img_col_list[0]).merge(img_col_list[1])
            
            if noaa_bands == constants.NOAA_PRECIPITATION_BAND_:
                aggr = combine_img.sum()
            else:
                aggr = combine_img.mean()
                
            url = aggr.getDownloadUrl({
            'region': clip_data,
            'scale':27830,
            'format': 'GEO_TIFF',
            'crs': 'EPSG:4326',
            'maxPixels':1e13
            })
            
            response = requests.get(url, stream=True)

            if response.status_code == 200:
                if noaa_bands == constants.NOAA_PRECIPITATION_BAND_:
                    tiff_name = 'noaa_precip.tiff'
                else:
                    tiff_name = 'noaa_tmp.tiff'
                    
                with open(f"{constants.RASTER_FILE_PATH}/{tiff_name}", 'wb') as file:
                    file.write(response.content)
                print('Download successful.')
            else:
                print('Failed to download:', response.status_code, response.reason)

        ############# Applying Zonal stats #############
        
        # Load the Kenya shapefile
        kenya_shapefile_path = f"{constants.SHP_FILE_PATH}/4326"
        kenya_shapefile = gpd.read_file(kenya_shapefile_path)

        # Load the temperature and precipitation TIFF files
        temperature_tiff_path = f"{constants.RASTER_FILE_PATH}/noaa_tmp.tiff"
        precipitation_tiff_path = f"{constants.RASTER_FILE_PATH}/noaa_precip.tiff" 

        # Perform zonal statistics for temperature
        temperature_stats = zonal_stats(kenya_shapefile_path, temperature_tiff_path, stats="mean", nodata=-999, all_touched=True)
        temperature_values = [stat['mean'] if stat else None for stat in temperature_stats]

        # Perform zonal statistics for precipitation
        precipitation_stats = zonal_stats(kenya_shapefile_path, precipitation_tiff_path, stats="mean", nodata=-999, all_touched=True)
        precipitation_values = [stat['mean'] if stat else None for stat in precipitation_stats]

        # Add temperature and precipitation values to the Kenya shapefile
        kenya_shapefile['temperature'] = temperature_values
        kenya_shapefile['precipitation'] = precipitation_values

        response = requests.get(constants.PKL_FILE_URL)
        
        if response.status_code != 200:  # cheking status code
            return None

        # Content
        content = response.content
        loaded_model = pickle.loads(content)
        
        # Assuming 'kenya_shapefile' is your DataFrame
        for index, row in kenya_shapefile.iterrows():
            if pd.isna(row['clay_mean']):
                row['clay_mean'] = 0
                
            # Modeling month
            current_date = date.today()
            gfs_date = current_date + timedelta(days=15)

            # If the current date is greater than 14 (Y-M-14) using current month; otherwise, using the previous month.
            if current_date.month + 1 == gfs_date.month and gfs_date.day > 13:
                modeling_month = gfs_date.month
            else:
                modeling_month = current_date.month
            
            # Input data for the prediction
            input_data = [
                [
                    # modeling_month,
                    row["precipitation"],
                    float(row["temperature"]) + 273.15, # convrting Celsius to kelvin
                    row["clay_sum"],
                    row["clay_mean"],
                    row["altitide_m"],
                    row["_majority"],
                ]
            ]  # Your input data goes here
            
            # Generating predicted values
            predictions = loaded_model.predict_proba(input_data)
            if predictions[:, 1] > 0.4:
                predicted_value = 1
            else:
                predicted_value = 0
            
            # Updating temperature, rainfall and predicted values.
            BlockData.objects.filter(block_id = int(row['block_id'])).update(precipitation = row['precipitation'], temperature = row['temperature'], predicted = predicted_value, date = date.today())
            
        ModelingServices.make_raster_from_shp(gfs_date.year, gfs_date.month)
        
        return True

    
    
        
        
        
    
    
    
