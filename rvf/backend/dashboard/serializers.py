#Genric
from rest_framework import serializers
from datetime import date, datetime

#Constants
from base import constants  

#Messages
from util import messages

#All models
from .models.rainfall_source import RainfallSource
from location.models.country import Country
from location.models.county import County
from location.models.sub_county import SubCounty


class TimeseriesSerializer(serializers.Serializer):
    adm0_name               =   serializers.CharField(allow_blank = True, required = False)
    adm1_name               =   serializers.CharField(allow_blank = True, required = False)
    adm2_name               =   serializers.CharField(allow_blank = True, required = False)     
    geometry                =   serializers.ListField(required = False)
    spatial_aggregation     =   serializers.CharField(required = True)
    start_date              =   serializers.DateField(required = True)
    end_date                =   serializers.DateField(required = True)

    ''' For Required field validation start '''
    def __init__(self, *args, **kwargs):
        super(TimeseriesSerializer, self).__init__(*args, **kwargs) # call the super() 
        for field in self.fields: # iterate over the serializer fields
            self.fields[field].error_messages['blank'] = field.title().replace("_", " ")+" "+messages.ERROR['FIELD_REQUIRED']
            self.fields[field].error_messages['required'] = field.title().replace("_", " ")+" "+messages.ERROR['FIELD_REQUIRED']
    ''' For Required field validation end '''

    def validate(self, data):
        spatial_aggregation     =   data['spatial_aggregation']

        start_date = data['start_date'] if 'start_date' in data and data['start_date'] else ''
        end_date = data['end_date'] if 'end_date' in data and data['end_date'] else ''

        errors = {}

        if 'adm0_name' in data and data['adm0_name'] and not Country.objects.filter(name__iexact = data['adm0_name']).exists():
            errors['adm0_name'] = [messages.ERROR['CHOOSE_COUNTRY']]

        if 'adm1_name' in data and data['adm1_name'] and not County.objects.filter(name__iexact = data['adm1_name']).exists():
            errors['adm1_name'] = [messages.ERROR['CHOOSE_COUNTY']]

        if 'adm2_name' in data and data['adm2_name'] and not SubCounty.objects.filter(name__iexact = data['adm2_name']).exists():
            errors['adm2_name'] = [messages.ERROR['CHOOSE_SUB_COUNTY']]

        if spatial_aggregation not in constants.SPATIAL_AGGREGATIONS:
            errors['spatial_aggregation'] = [messages.ERROR['SPATIAL_AGGERGATION']]

        # if not start_date: 
        #     errors['start_date'] = ['Start Date'+messages.ERROR['FIELD_REQUIRED']]

        # if not end_date:
        #     errors['end_date'] = ['End Date'+messages.ERROR['FIELD_REQUIRED']]
        # else:
        #     #End date should not be greater than today date
        #     end_date = datetime.strptime(str(end_date), constants.DATE_FORMAT).date()
        #     if end_date > date.today():
        #         errors['end_date'] = [messages.ERROR['END_DATE_NOT_GREATER_THAN_TODAY']]

        # if start_date and end_date:
        #     start_date = datetime.strptime(str(start_date), constants.DATE_FORMAT).date()
        #     end_date = datetime.strptime(str(end_date), constants.DATE_FORMAT).date()

        #     if start_date == end_date:
        #         errors['start_date'] = [messages.ERROR['START_DATE_NOT_EQUAL_END_DATE']]    
        #     elif start_date > end_date:
        #         errors['start_date'] = [messages.ERROR['START_DATE_LESS_TO_END_DATE']]

        if errors:  
            raise serializers.ValidationError(errors)
        else:
            return data



class MapSerializer(serializers.Serializer):
    adm0_name               =   serializers.CharField(allow_blank = True, required = False)
    adm1_name               =   serializers.CharField(allow_blank = True, required = False)
    adm2_name               =   serializers.CharField(allow_blank = True, required = False)  
    
    temporal_aggregation    =   serializers.CharField()
    
    start_date              =   serializers.DateField(required = False)
    end_date                =   serializers.DateField(required = False)
    

    ''' For Required field validation start '''
    def __init__(self, *args, **kwargs):
        super(MapSerializer, self).__init__(*args, **kwargs) # call the super() 
        for field in self.fields: # iterate over the serializer fields
            self.fields[field].error_messages['blank'] = field.title().replace("_", " ")+" "+messages.ERROR['FIELD_REQUIRED']
            self.fields[field].error_messages['required'] = field.title().replace("_", " ")+" "+messages.ERROR['FIELD_REQUIRED']
    ''' For Required field validation end '''

    def validate(self, data):
        temporal_aggregation    =   data['temporal_aggregation']

        start_date = data['start_date'] if 'start_date' in data and data['start_date'] else ''
        end_date = data['end_date'] if 'end_date' in data and data['end_date'] else ''

        errors = {}

        if 'adm0_name' in data and data['adm0_name'] and not Country.objects.filter(name__iexact = data['adm0_name']).exists():
            errors['adm0_name'] = [messages.ERROR['CHOOSE_COUNTRY']]

        if 'adm1_name' in data and data['adm1_name'] and not County.objects.filter(name__iexact = data['adm1_name']).exists():
            errors['adm1_name'] = [messages.ERROR['CHOOSE_COUNTY']]

        if 'adm2_name' in data and data['adm2_name'] and not SubCounty.objects.filter(name__iexact = data['adm2_name']).exists():
            errors['adm2_name'] = [messages.ERROR['CHOOSE_SUB_COUNTY']]

        if temporal_aggregation not in constants.TEMPORAL_AGGREGATIONS:
            errors['temporal_aggregation'] = [messages.ERROR['TEMPORAL_AGGERGATION']]

        if not start_date: 
            errors['start_date'] = ['Start Date'+messages.ERROR['FIELD_REQUIRED']]
        
        if not end_date:
            errors['end_date'] = ['End Date'+messages.ERROR['FIELD_REQUIRED']]
        else:
            #End date should not be greater than today date
            end_date = datetime.strptime(str(end_date), constants.DATE_FORMAT).date()
            if end_date > date.today():
                errors['end_date'] = [messages.ERROR['END_DATE_NOT_GREATER_THAN_TODAY']]

        if start_date and end_date:
            start_date = datetime.strptime(str(start_date), constants.DATE_FORMAT).date()
            end_date = datetime.strptime(str(end_date), constants.DATE_FORMAT).date()

            if start_date == end_date:
                errors['start_date'] = [messages.ERROR['START_DATE_NOT_EQUAL_END_DATE']]    
            elif start_date > end_date:
                errors['start_date'] = [messages.ERROR['START_DATE_LESS_TO_END_DATE']]

        if errors:
            raise serializers.ValidationError(errors)
        else:
            return data
        

class GPMForecastTimeseriesSerializer(serializers.Serializer):
    adm0_name               =   serializers.CharField(allow_blank = True, required = False)
    adm1_name               =   serializers.CharField(allow_blank = True, required = False)
    adm2_name               =   serializers.CharField(allow_blank = True, required = False)     
    geometry                =   serializers.ListField(required = False)
    spatial_aggregation     =   serializers.CharField(required = True)
    start_date              =   serializers.DateField(required = True)
    end_date                =   serializers.DateField(required = True)

    ''' For Required field validation start '''
    def __init__(self, *args, **kwargs):
        super(GPMForecastTimeseriesSerializer, self).__init__(*args, **kwargs) # call the super() 
        for field in self.fields: # iterate over the serializer fields
            self.fields[field].error_messages['blank'] = field.title().replace("_", " ")+" "+messages.ERROR['FIELD_REQUIRED']
            self.fields[field].error_messages['required'] = field.title().replace("_", " ")+" "+messages.ERROR['FIELD_REQUIRED']
    ''' For Required field validation end '''

    def validate(self, data):
        spatial_aggregation     =   data['spatial_aggregation']

        start_date = data['start_date'] if 'start_date' in data and data['start_date'] else ''
        end_date = data['end_date'] if 'end_date' in data and data['end_date'] else ''

        errors = {}

        if 'adm0_name' in data and data['adm0_name'] and not Country.objects.filter(name__iexact = data['adm0_name']).exists():
            errors['adm0_name'] = [messages.ERROR['CHOOSE_COUNTRY']]

        if 'adm1_name' in data and data['adm1_name'] and not County.objects.filter(name__iexact = data['adm1_name']).exists():
            errors['adm1_name'] = [messages.ERROR['CHOOSE_COUNTY']]

        if 'adm2_name' in data and data['adm2_name'] and not SubCounty.objects.filter(name__iexact = data['adm2_name']).exists():
            errors['adm2_name'] = [messages.ERROR['CHOOSE_SUB_COUNTY']]

        if spatial_aggregation not in constants.SPATIAL_AGGREGATIONS:
            errors['spatial_aggregation'] = [messages.ERROR['SPATIAL_AGGERGATION']]

        if not start_date: 
            errors['start_date'] = ['Start Date'+messages.ERROR['FIELD_REQUIRED']]

        if not end_date:
            errors['end_date'] = ['End Date'+messages.ERROR['FIELD_REQUIRED']]
       
        if start_date and end_date:
            start_date = datetime.strptime(str(start_date), constants.DATE_FORMAT).date()
            end_date = datetime.strptime(str(end_date), constants.DATE_FORMAT).date()

            if start_date == end_date:
                errors['start_date'] = [messages.ERROR['START_DATE_NOT_EQUAL_END_DATE']]    
            elif start_date > end_date:
                errors['start_date'] = [messages.ERROR['START_DATE_LESS_TO_END_DATE']]

        if errors:  
            raise serializers.ValidationError(errors)
        else:
            return data


class RainfallSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RainfallSource
        fields = '__all__'
