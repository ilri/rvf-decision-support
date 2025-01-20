from django.db import models
from base.models import Base
from dashboard.models.gee_indices import GeeIndices

class RainfallSource(Base):
    indices = models.ForeignKey(GeeIndices,  on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=255, blank=False)
    api_url = models.CharField(max_length=500, blank=True, default='')
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'rainfall_source'
        app_label = 'dashboard'