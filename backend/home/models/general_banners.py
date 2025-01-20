from django.db import models
from base.models import Base

class GeneralBanners(Base):
    name = models.CharField(max_length=255, blank=False)
    image_url = models.CharField(max_length=500, blank=True, default='')
    description = models.TextField(blank=True)
    order = models.IntegerField(blank=False, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'general_banners'
        app_label = 'home'