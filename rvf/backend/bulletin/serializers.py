#Genric
from rest_framework import serializers

from django.core.exceptions import ValidationError


#Loaded Models
from bulletin.models.bulletin import Bulletin
from location.models import country,county,sub_county
from mail_hub.models.email_group import EmailGroup

# Response and Messages
from util import messages

class AddBulletinSerializer(serializers.Serializer):
    country_name              =   serializers.CharField()
    county_name               =   serializers.CharField(required=False, allow_blank =True)
    sub_county_name           =   serializers.CharField(required=False, allow_blank =True)
    pdf_base64                =   serializers.CharField(required = True)
    image_base64              =   serializers.CharField(required = False)
    
    #For Required field validation start
    def __init__(self, *args, **kwargs):
        super(AddBulletinSerializer, self).__init__(*args, **kwargs) # call the super() 
        for field in self.fields: # iterate over the serializer fields
            self.fields[field].error_messages['blank'] = field.title().replace("_", " ")+messages.ERROR['FIELD_REQUIRED']
    #For Required field validation end 
    
    def validate(self, data):
        errors = {}
           
        if not country.Country.objects.filter(name = data.get('country_name')).exists():
            errors['country_name'] = f"country_name {messages.ERROR['NOT_EXIST']}"
            
        if data.get('county_name') and not county.County.objects.filter(country__name = data.get('country_name'), name = data.get('county_name')).exists():
            errors['county_name'] = f"county_name {messages.ERROR['NOT_EXIST']}"
        
        if data.get('sub_county_name') and not sub_county.SubCounty.objects.filter(county__country__name = data.get('country_name'), county__name = data.get('county_name'), name = data.get('sub_county_name')).exists():
            errors['sub_county_name'] = f"sub_county_name {messages.ERROR['NOT_EXIST']}"
        
        if errors:
            raise serializers.ValidationError(errors)
        else:
            return data


class BulletinListSerializer(serializers.Serializer):
    bulletin_status          =      serializers.CharField(required=False, allow_blank =True)
    is_delete                =      serializers.CharField(required=False, allow_blank =True)
    is_publish               =      serializers.CharField(required=False, allow_blank =True)
    year                     =      serializers.CharField(required=False, allow_blank =True)
    category_id              =      serializers.CharField(required = False)
      
class BulletinSerializer(serializers.ModelSerializer):
    published_date          =      serializers.CharField()
    pdf_base_64             =      serializers.CharField()
    class Meta:
        model = Bulletin
        fields = ['id', 'country_name','county_name','sub_county_name','pdf_file', 'image_file', 'published_date', 'pdf_base_64']
        

# Email validations
class MultiEmailField(serializers.ListField):
    def to_internal_value(self, data):
        data = super().to_internal_value(data)

        for email in data:
            if not validate_email(email):
                raise serializers.ValidationError("Invalid email address.")

        return data

def validate_email(email):
    from django.core.validators import validate_email as django_validate_email
    try:
        django_validate_email(email)
        return True
    except ValidationError:
        return False      
        
class SendBulletinSerializer(serializers.Serializer):
    email_group_id            =   serializers.CharField(required=False, allow_blank =True)
    country_name              =   serializers.CharField()
    county_name               =   serializers.CharField(required=False, allow_blank =True)
    sub_county_name           =   serializers.CharField(required=False, allow_blank =True)
    pdf_base64                =   serializers.CharField(required = True)
    email_group_name          =   serializers.CharField(required=False, allow_blank =True)
    email                     =   MultiEmailField(child=serializers.EmailField(), required = False)
    
    #For Required field validation start
    def __init__(self, *args, **kwargs):
        super(SendBulletinSerializer, self).__init__(*args, **kwargs) # call the super() 
        for field in self.fields: # iterate over the serializer fields
            self.fields[field].error_messages['blank'] = field.title().replace("_", " ")+messages.ERROR['FIELD_REQUIRED']
    #For Required field validation end 
    
    def validate(self, data):
        errors = {}
        
        if data.get('email_group_id') and not EmailGroup.objects.filter(id = data.get("email_group_id")).exists():
            errors['email_group_id'] = f"Email group id {messages.ERROR['NOT_EXIST']}"
            
        if data.get('email_group_id') and not (data.get('email') or data.get('email_group_name')):
            errors['email_group_id'] = f"Email or email group name{messages.ERROR['FIELD_REQUIRED']}"
            
        # Checking email group name 
        if data.get("email_group_name") and data.get('email') and EmailGroup.objects.filter(group_name = data.get("email_group_name")).exists():
            errors['email_group_name'] = f"Email group name {messages.ERROR['ALREADY_EXIST']}"
           
        if not country.Country.objects.filter(name = data.get('country_name')).exists():
            errors['country_name'] = f"country_name {messages.ERROR['NOT_EXIST']}"
            
        if data.get('county_name') and not county.County.objects.filter(country__name = data.get('country_name'), name = data.get('county_name')).exists():
            errors['county_name'] = f"county_name {messages.ERROR['NOT_EXIST']}"
        
        if data.get('sub_county_name') and not sub_county.SubCounty.objects.filter(county__country__name = data.get('country_name'), county__name = data.get('county_name'), name = data.get('sub_county_name')).exists():
            errors['sub_county_name'] = f"sub_county_name {messages.ERROR['NOT_EXIST']}"
        
        if errors:
            raise serializers.ValidationError(errors)
        else:
            return data