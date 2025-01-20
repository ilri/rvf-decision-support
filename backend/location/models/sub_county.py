from django.db import models
from base.models import Base
from .county import County


class SubCounty(Base):
    county = models.ForeignKey(County, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, blank=False)
    code = models.CharField(max_length=100, blank=False)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    status = models.BooleanField(default=True)
    zoom_level = models.FloatField(default = 0)

    class Meta:
        db_table = 'sub_county'
        app_label = 'location'