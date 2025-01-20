#Genric
from rest_framework import serializers

#Messages
from util import messages

#All models
from location.models.country import Country
from location.models.county import County
from location.models.sub_county import SubCounty


class ForecastSerializer(serializers.Serializer):
    adm0_name               =   serializers.CharField(allow_blank = True, required = False)
    adm1_name               =   serializers.CharField(allow_blank = True, required = False)
    adm2_name               =   serializers.CharField(allow_blank = True, required = False)   
    start_date              =   serializers.DateField(required = False)  
    

    ''' For Required field validation start '''
    def __init__(self, *args, **kwargs):
        super(ForecastSerializer, self).__init__(*args, **kwargs) # call the super() 
        for field in self.fields: # iterate over the serializer fields
            self.fields[field].error_messages['blank'] = field.title().replace("_", " ")+" "+messages.ERROR['FIELD_REQUIRED']
            self.fields[field].error_messages['required'] = field.title().replace("_", " ")+" "+messages.ERROR['FIELD_REQUIRED']
    ''' For Required field validation end '''

    def validate(self, data):
        errors = {}

        if 'adm0_name' in data and data['adm0_name'] and not Country.objects.filter(name__iexact = data['adm0_name']).exists():
            errors['adm0_name'] = [messages.ERROR['CHOOSE_COUNTRY']]

        if 'adm1_name' in data and data['adm1_name'] and not County.objects.filter(name__iexact = data['adm1_name']).exists():
            errors['adm1_name'] = [messages.ERROR['CHOOSE_COUNTY']]

        if 'adm2_name' in data and data['adm2_name'] and not SubCounty.objects.filter(name__iexact = data['adm2_name']).exists():
            errors['adm2_name'] = [messages.ERROR['CHOOSE_SUB_COUNTY']]

        
        if errors:  
            raise serializers.ValidationError(errors)
        else:
            return data


