from django.db import models
from base.models import Base


class GeneralTools(Base):
    name = models.CharField(max_length=255, blank=False)
    description = models.TextField()
    icon = models.CharField(max_length=500, blank=True, default='')
    slug = models.CharField(max_length=500, blank=True, default='')
    status = models.BooleanField(default=True)
    order = models.IntegerField(blank=False, null=True)

    class Meta:
        db_table = 'general_tools'
        app_label = 'home'
