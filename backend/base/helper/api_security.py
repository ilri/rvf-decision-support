#Genric
from rest_framework import permissions
from django.conf import settings
from rest_framework.exceptions import ValidationError

#Messages
from util import messages

class SafelistPermission(permissions.BasePermission):
    """
    Ensure the request's IP address is on the safe list configured in Django settings.
    """

    def has_permission(self, request, view):
        http_origin = request.META.get('HTTP_ORIGIN') # HTTP Origin
        http_referer = request.META.get('HTTP_REFERER') # HTTP Referer
        
        for valid_ip in settings.REST_SAFE_LIST_IPS: #Validating the address 
            if str(valid_ip) in str(http_referer) or str(valid_ip) in str(http_origin):
                return True

        raise ValidationError({"detail":messages.ERROR['API_SECURITY_DONT_HAVE_PERMISSION']}, code=410)