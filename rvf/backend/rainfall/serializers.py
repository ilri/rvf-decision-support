#Genric
from rest_framework import serializers
from datetime import datetime

#All Messages
from util import messages

# Constant
from base import constants

class ForecastDataTimeSeriesSerializer(serializers.Serializer):
    adm0_name               =   serializers.CharField(allow_blank = True, required = False)
    adm1_name               =   serializers.CharField(allow_blank = True, required = False)
    adm2_name               =   serializers.CharField(allow_blank = True, required = False)
    geometry                =   serializers.ListField(required = False)
    spatial_aggregation     =   serializers.CharField()
    parameter_id            =   serializers.CharField(allow_blank = True, required = False)
    
    #IRI
    # forecast_time_year       = serializers.CharField(allow_blank=True, required=False) #This is for IRI
    # forecast_time_month      = serializers.CharField(allow_blank=True, required=False) #This is for IRI
    # forecast_lead_time       = serializers.CharField(allow_blank=True, required=False) #This is for IRI
    
    start_date              =   serializers.DateField(required = False,  default = "")
    end_date                =   serializers.DateField(required = False,  default = "")
    
    #For Required field validation start
    def __init__(self, *args, **kwargs):
        super(ForecastDataTimeSeriesSerializer, self).__init__(*args, **kwargs) # call the super() 
        for field in self.fields: # iterate over the serializer fields
            self.fields[field].error_messages['blank'] = field.title().replace("_", " ")+messages.ERROR['FIELD_REQUIRED']
    #For Required field validation end
    
    def validate(self, data):
        spatial_aggregation =  data.get("spatial_aggregation")
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        errors = {}

        list_spatial_aggregation = constants.SPATIAL_AGGREGATIONS
        if spatial_aggregation not in list_spatial_aggregation:
            errors['spatial_aggregation'] = [messages.ERROR['SPATIAL_AGGERGATION']]
        
        if 'start_date' in data and data.get('start_date'):
            if not start_date:
                errors['start_date'] =  ['Start Date'+messages.ERROR['FIELD_REQUIRED']]
            else:
                api_start_date = datetime.strptime(str(self.context['api_start_date']), constants.DATE_FORMAT).date()
                start_date = datetime.strptime(str(start_date), constants.DATE_FORMAT).date()
                if start_date < api_start_date:
                    errors['start_date'] = [messages.ERROR['START_DATE_GREATER_THAN_API_DATE']+ str(api_start_date.strftime(constants.DATE_FORMAT_DMY))+'.']

        if 'end_date' in data and not data.get('end_date'):
            errors['end_date'] =  ['End Date'+messages.ERROR['FIELD_REQUIRED']]

        if 'start_date' in data and data.get('start_date') and 'end_date' in data and data.get('end_date'):
            start_date = datetime.strptime(str(start_date), constants.DATE_FORMAT).date()
            end_date = datetime.strptime(str(end_date), constants.DATE_FORMAT).date()
            if start_date > end_date:
                errors['start_date'] = [messages.ERROR['START_DATE_LESS_TO_END_DATE']]

        if errors:
            raise serializers.ValidationError(errors)
        else:
            return data