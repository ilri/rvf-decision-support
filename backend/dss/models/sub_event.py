from django.db import models
from base.models import Base
from dss.models import Event

class SubEvent(Base):
    event      = models.ForeignKey(Event,  on_delete=models.CASCADE, null=True, related_name='sub_events')
    name       = models.CharField(max_length=255, blank=False)
    status     = models.BooleanField(default=True)
    order      = models.IntegerField(blank=False, null=True)

    class Meta:
        db_table = 'dss_sub_event'
        app_label = 'dss'