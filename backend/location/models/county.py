from django.db import models
from base.models import Base
from location.models.country import Country


class County(Base):
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, blank=False)
    code = models.CharField(max_length=100, blank=False)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    status = models.BooleanField(default=True)
    zoom_level = models.FloatField(default = 0)

    class Meta:
        db_table = 'county'
        app_label = 'location'
