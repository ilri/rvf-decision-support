from django.db import models
from base.models import Base
from dss.models import EpidemicPhase
from dss.models import Event
from dss.models import SubEvent
from dss.models import Category
from dss.models import Activity

class Intervention(Base):
    epidemic_phase      = models.ForeignKey(EpidemicPhase, on_delete=models.CASCADE)
    event              = models.ForeignKey(Event, on_delete=models.CASCADE, null=True)
    sub_event          = models.ForeignKey(SubEvent, on_delete=models.CASCADE, null=True)
    category           = models.ForeignKey(Category, on_delete=models.CASCADE)
    activity           = models.ForeignKey(Activity, on_delete=models.CASCADE)
    human_health       = models.TextField(null=True)
    animal_health      = models.TextField(null=True)
    status             = models.BooleanField(default=True)

    class Meta:
        db_table = 'dss_intervention'
        app_label = 'dss'