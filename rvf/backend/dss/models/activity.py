from django.db import models
from base.models import Base
from dss.models import Category

class Activity(Base):
    category        = models.ForeignKey(Category,  on_delete=models.CASCADE, related_name='activities')
    name            = models.TextField(blank=False)
    status          = models.BooleanField(default=True)
    order           = models.IntegerField(blank=False, null=True)

    class Meta:
        db_table = 'dss_activity'
        app_label = 'dss'