# Generic
from decouple import config
from django.conf import settings
import datetime

# Media Content File Path
MEDIA_URL                               =   settings.STATIC_URL
BASE_DIR                                =   settings.BASE_DIR
GPM_IRI_STATIC_RESPONSE                 =   f"{settings.BASE_DIR}/dashboard/gpm_and_iri_static_data"

######################## General Constants Section ########################
FE_LINK                                 =   config('FE_LINK')
BE_LINK                                 =   config('BE_LINK')
GEE_INDICES_CRON_EXPRESSION             =   {'second':0,       # seconds
                                            'minute':0,       # minutes
                                            'hour':5,         # hours
                                            'day' :'*/2',     # days
                                            'timezone':'Asia/Kolkata'  # timezone
                                            }

GPM_IRI_CRON_EXPRESSION             =       {'second':0,       # seconds
                                            'minute':1,       # minutes
                                            'hour':5,         # hours
                                            'day' :'*/1',     # days
                                            'timezone':'Asia/Kolkata'  # timezone
                                            }

FORECASTED_RASTER_CRON_EXPRESSION   =       {'second':0,       # seconds
                                            'minute':1,       # minutes
                                            'hour':5,         # hours
                                            'day' :'*/1',     # days
                                            'timezone':'Asia/Kolkata'  # timezone
                                            }


IRI_FORECAST_URL                        =   config('IRI_FORECAST_URL')
IRI_dataSrcId                           =   "6"

GLOBAL_LIST_PAZE_SIZE                   =   10

IMG_EXT                                 =   ['jpg','JPG','jpeg','JPEG','png','PNG']

EMAIL_LOGO                              =   f"{config('FE_LINK')}emailLogo/rvf_email_logo.png"

######################## AWS Constants ########################
AWS_S3_BASE_URL                         =   config('AWS_S3_BASE_URL')

# S3 Bucket
S3_REGION_NAME                          =   config("S3_REGION_NAME")
BUCKET_NAME                             =   config("BUCKET_NAME")
ACCESS_KEY_ID                           =   config("AWS_ACCESS_KEY_ID")
SECRET_ACCESS_KEY                       =   config("AWS_SECRET_ACCESS_KEY")

######################## S3 DIR URLS Constants ########################
GENERAL_TOOLS_ICON_URL_PATH             =   f'{AWS_S3_BASE_URL}/icons/'
GENERAL_BANNERS_URL_PATH                =   f'{AWS_S3_BASE_URL}/banners/'
MODEL_PKL_FILE_URL_PATH                 =   f'{AWS_S3_BASE_URL}/Model/best_rf_model.pkl'

#https://rvf-prod.s3.ap-south-1.amazonaws.com/Model/best_rf_model.pkl

######################################## Google Cloud and GEE Settings Start ######################

#GEE API BASE URL AND PROJECT NAME
BASE_MAP_URL                    =   "https://earthengine.googleapis.com/v1alpha/"
GEE_PROJECT                     =   settings.GEE_PROJECT
# GEE_ASSET_URL                   =   config("GEE_ASSET_URL")

######################################## Google Cloud and GEE Settings End ######################

#################################  Access Key/Public API CONSTANTS Start  ################################

#ACCESS KEY
ACCESS_KEY_BASE_URL                     =   "Api-Key {}"
ACCESS_KEY_MINIMUM_TIME                 =   datetime.timedelta(days = 90)
ACCESS_KEY_MINIMUM_DURATION             =   3 # It is in months
ACCESS_KEY_PRE_REMINDER                 =   10 # It is in days

#General
DATE_FORMAT                             =   "%Y-%m-%d"
DATE_FORMAT_DMY                         =   "%d-%m-%Y"
PUBLIC_API_GLOBAL_SCALE                 =   1000
PUBLIC_API_GLOBAL_CRS                   =   "EPSG:4326"
GLOBAL_MAX_PIXELS                       =   1e13
PUBLIC_API_GLOBAL_TILE_SCALE            =   4
DEFAULT_TEMPORAL_AGGREGATION            =   "mean"

TEMPORAL_AGGREGATIONS                   =   ['mean', 'median', 'min', 'max', 'sum']
SPATIAL_AGGREGATIONS                    =   ['mean', 'min', 'max', 'sum','median']



##################### BULLETIN ################################
BULLETIN_FILE_PATH                       =   f"bulletin"
BULLETIN_PAGE_LIST_SIZE                  =  8

############################################# RAINFALL (ACCUMULATED RAINFALL) #############################################
# GPM
RAINFALL_API_NAME                           =   "Accumulated Rainfall (GPM)"
RAINFALL_DATASET                            =   "NASA/GPM_L3/IMERG_V06"
RAINFALL_BAND_NAME                          =   "precipitationCal"
RAINFALL_START_DATE                         =   "2000-01-01"
RAINFALL_UNITS                              =   "mm"
RAINFALL_DYNAMIC_MIN_MAX_SCALE              =   25000
RAINFALL_MIN                                =   -3#0
RAINFALL_MAX                                =   3#50
RAINFALL_MIN_SUM                            =   -3#0
RAINFALL_MAX_SUM                            =   3#100
RAINFALL_SCALE                              =   11131.950
RAINFALL_PALETTE                            =   ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"] 
RAINFALL_SLUG                               =   "accumulated_rainfall_gpm"
RAINFALL_DESCRET_LEGEND                     =  [
    {"color": "#F2B28B", "name": "Low"},
    {"color": "#D07A49", "name": "Moderate"},
    {"color": "#D5461F", "name": "High"} 
]

#CHIRPS
RAINFALL_CHIRPS_API_NAME                    =   "Accumulated Rainfall (CHIRPS)"
RAINFALL_CHIRPS_DATASET                     =   "UCSB-CHG/CHIRPS/DAILY"
RAINFALL_CHIRPS_BAND_NAME                   =   "precipitation"
RAINFALL_CHIRPS_START_DATE                  =   "1981-01-01"
RAINFALL_CHIRPS_UNITS                       =   "mm"
RAINFALL_CHIRPS_DYNAMIC_MIN_MAX_SCALE       =   25000
RAINFALL_CHIRPS_MIN                         =   0
RAINFALL_CHIRPS_MAX                         =   50
RAINFALL_CHIRPS_MIN_SUM                     =   0
RAINFALL_CHIRPS_MAX_SUM                     =   100
RAINFALL_CHIRPS_PALETTE                     =   ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"] 
RAINFALL_CHIRPS_SLUG                        =   "accumulated_rainfall_chirps"

################################################# NOAA-GFS API ####################################################
NOAA_GFS_PARAMETERS = [
    "precipitation",
    "temperature",
]


NOAA_DATASET                    =   "NOAA/GFS0P25"
NOAA_PRECIPITATION_BAND         =   "precipitable_water_entire_atmosphere"
NOAA_PRECIPITATION_BAND_        =   "total_precipitation_surface"
NOAA_START_DATE                 =   "2015-07-01"
NOAA_PRECIPITATION_UNITS        =   "mm"
NOAA_DAYS                       =   15
NOAA_SCALE                      =   10000
NOAA_SCALE_FACTOR               =   100
NOAA_PRECIPITATION_MIN          =   0
NOAA_PRECIPITATION_MAX          =   100
NOAA_DYNAMIC_MIN_MAX            =   True
NOAA_PRECIPITATION_PALETTE      =   ['#0000BB','#0000F7','#004FFE','#00ADFE','#07FDF7','#4FFDAF','#9BFE63','#E3FE1B','#FED300','#FE8B00','#FF3F00','#F70000','#BB0000']

NOAA_TEMPERATURE_BAND = "temperature_2m_above_ground"
NOAA_TEMPERATURE_UNITS = "°C"
NOAA_TEMPERATURE_MIN = -69.18
NOAA_TEMPERATURE_MAX = 52.25
NOAA_TEMPERATURE_SLUG = "temperature"
NOAA_TEMPERATURE_PALETTE                    =   ['#8ecaf0','#9bd5f4','#ace1fd','#c2eaff','#ffffd0','#fef8ae','#fee892','#fee270','#fdd461','#f4a85e','#f48159','#f46859','#f44c49']


################################# TEMPERATURE ##############################################

TEMPERATURE_IMG_COL             =   'ECMWF/ERA5_LAND/DAILY_AGGR'#'ECMWF/ERA5/MONTHLY'
TEMPERATURE_IMG_COL_BAND        =   'temperature_2m'#'mean_2m_air_temperature'
TEMPERATURE_MIN                 =   224
TEMPERATURE_MAX                 =   304
TEMPERATURE_SCALE               =   11132
TEMPERATURE_PALETTE             =   [
                                        '000080', '0000d9', '4000ff', '8000ff', '0080ff', '00ffff',
                                        '00ff80', '80ff00', 'daff00', 'ffff00', 'fff500', 'ffda00',
                                        'ffb000', 'ffa400', 'ff4f00', 'ff2500', 'ff0a00', 'ff00ff',
                                    ]


########### SRTM ##############

SRTM_DATASET                             =   "CGIAR/SRTM90_V4"
SRTM_DATASET_MIN                         =   117.5
SRTM_DATASET_MAX                         =   2628
SRTM_DATASET_PALETTE                     =   ["#84BC6D", "#E0F199", "#F1E794", "#F6CD84", "#DE9E80", "#DC9495", "#F9CCE0"]
SRTM_DATASET_UNITS                       =   'm'
SRTM_SCALE                               =   1000

# Simplification point value based on a different location type
COUNTRY_SIMPLIFY_VALUE                      =   8000
COUNTY_SIMPLIFY_VALUE                       =   4000
SUB_COUNTY_SIMPLIFY_VALUE                   =   2000
SIMPLIFIED_POINT                            =   5000


############### Mdoeling ########################
BLOCK_JSON = f"{BASE_DIR}/modeling/static/block.geojson"
KENYA_BLOCK_SHP =  'projects/idmt-321615/assets/RVF/boundaries/ken_5km_exp_data'
MODELING_MAP_PALETTE_WITH_NAME                  =   ['#FDEE0C', '#F5B707','#EC8011', '#E75614', '#FF0000']

# [{'color':'#70D94C','name':'Negative Cases'}, 
#                                                     {'color':'#8F363C','name':'Positive Cases'}
#                                                     ]


MODELING_MAP_MIN    =   0
MODELING_MAP_MAX    =   1
# MODELING_MAP_PALETTE    =   ['#70D94C', '#8F363C']
 
MODELING_MAP_PALETTE = ['#FDEE0C', '#F5B707','#EC8011', '#E75614', '#FF0000']

MEDIA_CONTENT                           = f"{BASE_DIR.parent}/media_content"
SHP_FILE_PATH                           = f"{MEDIA_CONTENT}/shp"
RASTER_FILE_PATH                        = f"{MEDIA_CONTENT}/raster"
GCP_BUCKET                              = "rvf"
GCP_RASTE_DIR                           = "raster"
GCP_KENYA_RASTER_IMG                    = 'gs://rvf/raster/kenya_predicted_raster'

PKL_FILE_URL                            =  'https://storage.googleapis.com/rvf/PKL/kenya_predicted.pkl'
#'https://rvf-prod.s3.ap-south-1.amazonaws.com/Model/best_rf_model.pkl'


## Lambda function
LAMBDA_GEE_DATASET_ENDDATE_TIMESTAMP_DIVIDE_VALUE  =   1000
