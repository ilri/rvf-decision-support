#Genric
from rest_framework import status
import pandas as pd
import ee
import re 
from django.db.models import F, Q
import base64
from PIL import Image
from io import BytesIO
import calendar
from datetime import date

# Email template
from django.template.loader import get_template


#constants
from base import constants

#Models
# from location.models.region import Region
from location.models.country import Country
from location.models.county import County
from location.models.sub_county import SubCounty

# Mail
from base.helper.mailer import Mailer

class GEEServices:
    #Country clip
    def get_country_clip(self, country_name): #feature collection for countries
        country = ""
        try:
            if country_data := Country.objects.filter(name__iexact=country_name).values('adm0_feature_collection'):
                country = ee.FeatureCollection(country_data[0]['adm0_feature_collection'])
            return country

        except Exception:
            return country
    
    #County clip
    def get_county_clip(self, county_name,request_data): #feature collection for states
        county = ""
        try:
            country_data = Country.objects.filter(name__iexact = request_data['adm0_name']).values('id')
            countyNameData = County.objects.filter(name__iexact = county_name, country_id=country_data[0]['id']).values()
            if county_data := County.objects.filter(name=countyNameData[0]['name'], country_id=country_data[0]['id']).values(adm1_feature_collection=F('country_id__adm1_feature_collection'), adm1_feature_collection_key=F('country_id__adm1_feature_collection_key')):

                countis = ee.FeatureCollection(county_data[0]['adm1_feature_collection'])
                filter_county = ee.Filter.eq(f"{county_data[0]['adm1_feature_collection_key']}", countyNameData[0]['name'])

                county = countis.filter(filter_county)

                return county
        
        except :
            return county        
            
    #SubCounty clip
    def get_sub_county_clip(self, sub_county_name, request_data): #feature collection for districts
        sub_county = ""
        try:
            #Get the country id with name
            country_data = Country.objects.filter(name__iexact = request_data['adm0_name']).values()
            
            #Get the county id with name and country id
            county_data = County.objects.filter(name__iexact = request_data['adm1_name'],country_id=country_data[0]['id']).values()
            
            #Get the sub_county name with county id
            sub_county_name_data = SubCounty.objects.filter(name__iexact = sub_county_name,county_id=county_data[0]['id']).values()
            
            if sub_county_data := SubCounty.objects.filter(name=sub_county_name_data[0]['name'], county_id=county_data[0]['id']).values(adm2_feature_collection=F('county__country_id__adm2_feature_collection'), adm2_feature_collection_key=F('county__country_id__adm2_feature_collection_key')):
                sub_countys = ee.FeatureCollection(sub_county_data[0]['adm2_feature_collection'])
                filter_sub_county = ee.Filter.eq(f"{sub_county_data[0]['adm2_feature_collection_key']}", sub_county_name_data[0]['name'])

                sub_county = sub_countys.filter(filter_sub_county)

            return sub_county
        except Exception:
            return sub_county

    

    #Clip data
    def get_clip_data(self, request, geometry_type):
        clip_data = ""

        #If user will send the geometry (Polygon Values OR point values)
        if 'geometry' in request.data and request.data['geometry']:
            geometry_values = request.data['geometry']

            if len(geometry_values) < 2: #Point Based
                geometry_data = {'type':'FeatureCollection','features':[{'type':'Feature','properties':{'label':(geometry_values[0][0],geometry_values[0][1])},'geometry':{'type':'Point','coordinates':geometry_values[0]}}]}

            else: #Polygon
                geometry_data = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"label":"Polygon"},"geometry":{"type":"Polygon","coordinates":[geometry_values]}}]}

            clip_data = geometry_data['features'][0]['geometry']
            return clip_data     
        
        else:
            #SubCounty clip
            if 'adm2_name' in request.data and request.data['adm2_name'] and 'adm1_name' in request.data and request.data['adm1_name'] and 'adm0_name' in request.data and request.data['adm0_name']:
                clip_data = GEEServices.get_sub_county_clip(self, request.data['adm2_name'], request.data)
                if geometry_type == 'geometry':
                    clip_data = clip_data.geometry() if clip_data else ""
                else:
                    clip_data = clip_data or ""

                return clip_data

            #County clip
            if 'adm1_name' in request.data and request.data['adm1_name'] and 'adm0_name' in request.data and request.data['adm0_name']:
                clip_data = GEEServices.get_county_clip(self, request.data['adm1_name'],request.data)
                if geometry_type == 'geometry':
                    clip_data = clip_data.geometry() if clip_data else ""
                else:
                    clip_data = clip_data or ""
                return clip_data

            #Country clip
            if 'adm0_name' in request.data and request.data['adm0_name']:
                clip_data = GEEServices.get_country_clip(self, request.data['adm0_name'])
                if geometry_type == 'geometry':
                    clip_data = clip_data.geometry() if clip_data else ""
                else:
                    clip_data = clip_data or ""
                    
                return clip_data
 
                
    #Simplify(get the results quickly based on location type)
    def get_simplify(self, request, clip_data):
        simplify_point = ''
        if 'geometry' in request.data and request.data['geometry']:
            simplify_point = clip_data
        else:
            if 'adm0_name' in request.data and request.data['adm0_name']:
                simplify_point = clip_data.simplify(constants.COUNTRY_SIMPLIFY_VALUE)
            
            if 'adm1_name' in request.data and request.data['adm1_name']:
                simplify_point = clip_data.simplify(constants.COUNTY_SIMPLIFY_VALUE)
            
            if 'adm2_name' in request.data and request.data['adm2_name']:
                simplify_point = clip_data.simplify(constants.SUB_COUNTY_SIMPLIFY_VALUE)
            
        return simplify_point
             
                
    #Map URL
    def get_map_url(self, map_id, palette):
        map_url = constants.BASE_MAP_URL + map_id['mapid']+"/tiles/{z}/{x}/{y}"
        return {'code': status.HTTP_200_OK, 'map_url': map_url, 'min': palette['min'], 'max': palette['max'], 'palette': palette['palette']}
    
    
    #Get dynamic min, max values
    def get_dynamic_min_max_values(self, img, clip_data, min_value, max_value, scale):
        #Getting min and max vales based on clip_data with image
        try:
            img_reg = img.reduceRegion(reducer = ee.Reducer.minMax(), geometry = clip_data, scale = scale, maxPixels = 1e13)
            min_max_values = ee.ImageCollection(img_reg).getInfo()
            max_val, min_val, *_ = min_max_values.values()
            
            #Two decimal
            min_val = float(format(min_val,".2f"))
            max_val = float(format(max_val,".2f"))
            
            '''#min-max values in between constants min-max
            if min_val or max_val:
                min_val = min_value if min_value and min_val < min_value or min_val > max_value else min_val
                max_val = max_value if max_value and max_val < min_value or max_val  > max_value else max_val
            '''
        except Exception:
            min_val = min_value
            max_val = max_value
        
        if min_val == max_val:
            min_val = 0

        return min_val,max_val    
    

    # Basic Code to get the Timeseries Data Start
    def time_series_calculation(self, img_col, spatial_aggregation, scale, clip_data, band_name):
        def reduce_function(img):
            reduce_fu = img.reduceRegion(reducer = spatial_aggregation,
                                    geometry = clip_data,
                                    scale = scale,
                                    maxPixels = 1e13)

            return img.set('data', reduce_fu.get(band_name))

        data_list = img_col.map(reduce_function).reduceColumns(ee.Reducer.toList(2), ['data', 'system:time_start']).values().get(0)
        return pd.DataFrame(data_list.getInfo(), columns=['data', 'millis'])


    # Spatial Aggregation
    def switch_spatial_aggregation(self, argument):
        switcher = {
            'mean': ee.Reducer.mean(),
            'median': ee.Reducer.median(),
            'min': ee.Reducer.min(),
            'max': ee.Reducer.max(),
            'sum' : ee.Reducer.sum()
        }
        return switcher.get(str(argument))


    #Temporal aggregation
    def switch_temporal_aggregation(self, argument, img_col):
        switcher = {
            'mean': img_col.mean(),
            'median': img_col.median(),
            'min': img_col.min(),
            'max': img_col.max(),
            'sum': img_col.sum()
        }
        return switcher.get(str(argument)) 
    
    
    #Palette data
    def getPaletteData(self, min_val, max_val, palette_val, request):
        #Min values
        if 'min' in request.data and str(request.data['min']):
            min_val = request.data['min']

        #Max values
        if 'max' in request.data and str(request.data['max']):
            max_val = request.data['max']

        #palette values
        if 'palette' in request.data and request.data['palette']:
            palette_val = request.data['palette']

        return {"min": min_val, "max": max_val, "palette": palette_val}
    
    
    #Get Metadata of image/ image collection
    def get_image_metadata(self, image, band_name):
        #Get start date,pixel size, projection
        image = ee.Image(ee.ImageCollection(image).first())

        b1scale = image.select(band_name).projection().nominalScale()
        pixel_size = b1scale.getInfo()

        date = ee.Date(image.get('system:time_start'))
        date2 = date.format('YYYY-MM-dd')
        image_start_date = date2.getInfo()

        b1proj = image.select(band_name).projection()
        projection = b1proj.getInfo()
        projection = projection['transform'][0]
        
        return image_start_date, pixel_size, projection
    
class BaseServices:
    
    def send_email_with_template(self, subject, template, template_data, to, attachments=None, file_name = None):
        ''' Send Email with template and template data'''

        message = get_template(f'{template}.html').render(template_data)
        Mailer.send_mail(to, subject, message, attachments, file_name)
    
    def get_start_and_end_dates(self, year, month):
        # Find the number of days in the given month
        _, last_day = calendar.monthrange(year, month)
        
        # Create date objects for the first and last days of the month
        start_date = date(year, month, 1)
        end_date = date(year, month, last_day)
        
        return start_date, end_date
    
    
    def convert_base64_to_img(self, img_base64, extension):
        ''' Converting base64 to image '''
        
        image_data = base64.b64decode(img_base64)
        image = Image.open(BytesIO(image_data))
        buffer = BytesIO()
        image.save(buffer, format= extension, optimize=True, quality = 75)
        buffer.seek(0)
        return  buffer
    
    def convert_base64_to_pdf_or_doc(slef, base64_string):
        ''' Converting base64 to pdf or doc file'''
        
        pdf_or_doc = base64.b64decode(base64_string)
        buffer = BytesIO(pdf_or_doc)
        buffer.seek(0)
        return buffer
