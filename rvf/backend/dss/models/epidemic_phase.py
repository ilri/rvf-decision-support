from django.db import models
from base.models import Base

class EpidemicPhase(Base):
    name        = models.CharField(max_length=255, blank=False)
    order       = models.IntegerField(blank=False, null=True)
    status      = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'dss_epidemic_phase'
        app_label = 'dss'