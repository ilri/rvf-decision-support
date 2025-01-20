from django.db import models
from base.models import Base
from dss.models import EpidemicPhase

class Event(Base):
    epidemic_phase      = models.ForeignKey(EpidemicPhase,  on_delete=models.CASCADE, null=True, related_name= 'events')
    name               = models.CharField(max_length=255, blank=False)
    status             = models.BooleanField(default=True)
    order              = models.IntegerField(blank=False, null=True)

    class Meta:
        db_table = 'dss_event'
        app_label = 'dss'