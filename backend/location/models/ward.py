from django.db import models
from base.models import Base
from .sub_county import SubCounty
from .county import County
from .country import Country


class Ward(Base):
    sub_county = models.ForeignKey(SubCounty, on_delete=models.CASCADE)
    sub_county_code = models.CharField(max_length=100, blank=True)
    county = models.ForeignKey(County,on_delete=models.CASCADE, null=True)
    county_code = models.CharField(max_length=100, blank=True)
    country = models.ForeignKey(Country,on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=100, blank=False)
    code = models.CharField(max_length=100, blank=False)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'ward'
        app_label = 'location' 
        
        indexes = [
            models.Index(fields=['sub_county']),         
            models.Index(fields=['county']),     
            models.Index(fields=['country'])

        ]