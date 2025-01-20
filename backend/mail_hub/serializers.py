#Genric
from rest_framework import serializers

from django.core.exceptions import ValidationError


#Loaded Models
from mail_hub.models.email_group import EmailGroup

# Response and Messages
from util import messages

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
        
class UpdateEmailGroupSerializer(serializers.Serializer):
    id              =   serializers.CharField()
    group_name      =   serializers.CharField(required=False, allow_blank =True)
    email           =   MultiEmailField(child=serializers.EmailField(), required = False)
    
    #For Required field validation start
    def __init__(self, *args, **kwargs):
        super(UpdateEmailGroupSerializer, self).__init__(*args, **kwargs) # call the super() 
        for field in self.fields: # iterate over the serializer fields
            self.fields[field].error_messages['blank'] = field.title().replace("_", " ")+messages.ERROR['FIELD_REQUIRED']
    #For Required field validation end 
    
    def validate(self, data):
        errors = {}
        
        if not (data.get('group_name') and data.get('email')):
            errors['group_name or email'] = f"{messages.ERROR['EMAIL_GROUP_NAME']}"
        
        # Checking id
        if not EmailGroup.objects.filter(id = data.get('id'), status = True).exists():
            errors['id'] = f"id {messages.ERROR['NOT_EXIST']}"
        
        if data.get('group_name') and EmailGroup.objects.filter(id = data.get('id'), group_name = data.get('group_name')).exists():
            errors['group_name'] = f"Group name {messages.ERROR['ALREADY_EXIST']}"
        
        if data.get('email') and EmailGroup.objects.filter(id = data.get('id'), email = data.get('email')).exists():
            errors['email'] = f"{data.get('email')} {messages.ERROR['ALREADY_EXIST']}"
        
        if errors:
            raise serializers.ValidationError(errors)
        else:
            return data
        
        
class CreateEmailGroupSerializer(serializers.Serializer):
    pass