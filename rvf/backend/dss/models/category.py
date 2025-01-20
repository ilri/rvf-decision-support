from django.db import models
from base.models import Base
from dss.models import EpidemicPhase
from dss.models import Event
from dss.models import SubEvent

class Category(Base):
    epidemic_phase      = models.ForeignKey(EpidemicPhase,  on_delete=models.CASCADE, null=True)
    event              = models.ForeignKey(Event,  on_delete=models.CASCADE, null=True)
    sub_event          = models.ForeignKey(SubEvent, on_delete=models.CASCADE, null=True)
    name               = models.CharField(max_length=255, blank=False)
    status             = models.BooleanField(default=True)
    order              = models.IntegerField(blank=False, null=True)

    class Meta:
        db_table = 'dss_category'
        app_label = 'dss'