from django.db import models
from base.models import Base


class Country(Base):
    name = models.CharField(max_length=100, blank=False)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    status = models.BooleanField(default=True)
    zoom_level = models.FloatField(default = 0)

    adm0_feature_collection    =   models.CharField(max_length = 255, blank = True)
    adm1_feature_collection    =   models.CharField(max_length = 255, blank=True, null=True)
    adm2_feature_collection    =   models.CharField(max_length = 255, blank=True, null=True)
    adm3_feature_collection    =   models.CharField(max_length = 255, blank=True, null=True)

    adm0_feature_collection_key =  models.CharField(max_length = 255, blank=True, null=True)
    adm1_feature_collection_key =  models.CharField(max_length = 255, blank=True, null=True)
    adm2_feature_collection_key =  models.CharField(max_length = 255, blank=True, null=True)
    adm3_feature_collection_key =  models.CharField(max_length = 255, blank=True, null=True)

    class Meta:
        db_table = 'country'
        app_label = 'location'
