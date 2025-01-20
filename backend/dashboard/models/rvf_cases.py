from django.db import models
from base.models import Base

# Models
from location.models.country import Country
from location.models.county import County
from location.models.sub_county import SubCounty


class RVFCases(Base):
    country         = models.ForeignKey(Country, on_delete=models.CASCADE, null=True)
    county          = models.ForeignKey(County, on_delete=models.CASCADE, null=True)
    sub_county      = models.ForeignKey(SubCounty, on_delete=models.CASCADE, null=True)
    ward_name       = models.CharField(max_length=255, null=True)
    year            = models.IntegerField()
    month           = models.IntegerField(default=0)
    latitude        = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude       = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    outcome         = models.IntegerField()
    status          = models.BooleanField(default=True)

    class Meta:
        db_table = 'rvf_cases'
        app_label = 'dashboard'